import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { absoluteUrl } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { priceId } = await req.json()

    if (!priceId) {
      return new NextResponse('Price ID required', { status: 400 })
    }

    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription) {
      return new NextResponse('Subscription not found', { status: 404 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: subscription.stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: absoluteUrl('/dashboard/billing?success=true'),
      cancel_url: absoluteUrl('/dashboard/billing?canceled=true'),
      metadata: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Create checkout session error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
