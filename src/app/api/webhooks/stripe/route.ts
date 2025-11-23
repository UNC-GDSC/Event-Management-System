import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import {
  sendSubscriptionConfirmation,
  sendSubscriptionCancelled,
  sendPaymentFailed,
} from '@/lib/email'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  try {
    // Log webhook event
    await db.webhookEvent.create({
      data: {
        type: event.type,
        data: event.data.object as any,
      },
    })

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription as string
          const customerId = session.customer as string

          const subscription = await stripe.subscriptions.retrieve(subscriptionId)

          await db.subscription.update({
            where: { stripeCustomerId: customerId },
            data: {
              stripeSubscriptionId: subscriptionId,
              stripePriceId: subscription.items.data[0].price.id,
              stripeProductId: subscription.items.data[0].price.product as string,
              status: subscription.status.toUpperCase() as any,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              plan: getPlanFromPriceId(subscription.items.data[0].price.id),
            },
          })

          // Send confirmation email
          const user = await db.user.findFirst({
            where: {
              subscription: {
                stripeCustomerId: customerId,
              },
            },
          })

          if (user && user.email) {
            await sendSubscriptionConfirmation(
              user.email,
              user.name || 'User',
              getPlanFromPriceId(subscription.items.data[0].price.id)
            )
          }

          // Log analytics event
          if (user) {
            await db.analyticsEvent.create({
              data: {
                userId: user.id,
                event: 'subscription_created',
                properties: {
                  plan: getPlanFromPriceId(subscription.items.data[0].price.id),
                  priceId: subscription.items.data[0].price.id,
                },
              },
            })
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        await db.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status.toUpperCase() as any,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            plan: getPlanFromPriceId(subscription.items.data[0].price.id),
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        const dbSubscription = await db.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: 'CANCELED',
            plan: 'FREE',
          },
          include: {
            user: true,
          },
        })

        // Send cancellation email
        if (dbSubscription.user.email) {
          await sendSubscriptionCancelled(
            dbSubscription.user.email,
            dbSubscription.user.name || 'User',
            new Date(subscription.current_period_end * 1000)
          )
        }

        // Log analytics event
        await db.analyticsEvent.create({
          data: {
            userId: dbSubscription.user.id,
            event: 'subscription_cancelled',
            properties: {
              previousPlan: subscription.items.data[0].price.id,
            },
          },
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        const subscription = await db.subscription.findUnique({
          where: { stripeCustomerId: invoice.customer as string },
          include: { user: true },
        })

        if (subscription && subscription.user.email) {
          await sendPaymentFailed(
            subscription.user.email,
            subscription.user.name || 'User'
          )
        }

        // Log analytics event
        if (subscription) {
          await db.analyticsEvent.create({
            data: {
              userId: subscription.user.id,
              event: 'payment_failed',
              properties: {
                amount: invoice.amount_due,
                invoiceId: invoice.id,
              },
            },
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice

        const subscription = await db.subscription.findUnique({
          where: { stripeCustomerId: invoice.customer as string },
        })

        if (subscription) {
          await db.analyticsEvent.create({
            data: {
              userId: subscription.userId,
              event: 'payment_succeeded',
              properties: {
                amount: invoice.amount_paid,
                invoiceId: invoice.id,
              },
            },
          })
        }
        break
      }
    }

    // Mark webhook as processed
    await db.webhookEvent.updateMany({
      where: {
        type: event.type,
        data: {
          equals: event.data.object as any,
        },
      },
      data: {
        processed: true,
      },
    })

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return new NextResponse('Webhook handler failed', { status: 500 })
  }
}

function getPlanFromPriceId(priceId: string): string {
  const { getPlanFromPriceId: getPlan } = require('@/lib/stripe')
  return getPlan(priceId) || 'FREE'
}
