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

    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription) {
      return new NextResponse('Subscription not found', { status: 404 })
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: absoluteUrl('/dashboard/billing'),
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Create portal session error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
