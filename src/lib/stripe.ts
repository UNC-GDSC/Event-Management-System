import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Price IDs for different plans
export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Up to 100 API calls/month',
      'Basic support',
      'Community access',
      '1 project',
    ],
    limits: {
      apiCalls: 100,
      projects: 1,
    },
  },
  STARTER: {
    name: 'Starter',
    price: 9,
    priceId: process.env.STRIPE_PRICE_ID_STARTER,
    features: [
      'Up to 10,000 API calls/month',
      'Email support',
      'Priority community access',
      '5 projects',
      'Advanced analytics',
    ],
    limits: {
      apiCalls: 10000,
      projects: 5,
    },
  },
  PRO: {
    name: 'Pro',
    price: 29,
    priceId: process.env.STRIPE_PRICE_ID_PRO,
    features: [
      'Up to 100,000 API calls/month',
      'Priority support',
      'Unlimited projects',
      'Advanced analytics',
      'Custom integrations',
      'API access',
    ],
    limits: {
      apiCalls: 100000,
      projects: 999999,
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 99,
    priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE,
    features: [
      'Unlimited API calls',
      '24/7 dedicated support',
      'Unlimited projects',
      'Advanced analytics',
      'Custom integrations',
      'API access',
      'Custom SLA',
      'Dedicated account manager',
    ],
    limits: {
      apiCalls: 999999999,
      projects: 999999,
    },
  },
} as const

export type PlanName = keyof typeof PLANS

// Helper function to get plan from price ID
export function getPlanFromPriceId(priceId: string): PlanName | null {
  for (const [planName, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) {
      return planName as PlanName
    }
  }
  return null
}

// Helper function to check if user has access to a feature
export async function checkFeatureAccess(
  userId: string,
  feature: string,
  count: number = 1
): Promise<boolean> {
  const { db } = await import('@/lib/db')

  const subscription = await db.subscription.findUnique({
    where: { userId },
  })

  if (!subscription) return false

  const plan = PLANS[subscription.plan as PlanName]

  // Check usage limits
  if (feature === 'apiCalls') {
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const usage = await db.usageRecord.aggregate({
      where: {
        userId,
        feature: 'apiCalls',
        createdAt: {
          gte: currentMonth,
        },
      },
      _sum: {
        count: true,
      },
    })

    const totalUsage = (usage._sum.count || 0) + count
    return totalUsage <= plan.limits.apiCalls
  }

  return true
}

// Record usage
export async function recordUsage(
  userId: string,
  feature: string,
  count: number = 1,
  metadata?: any
) {
  const { db } = await import('@/lib/db')

  await db.usageRecord.create({
    data: {
      userId,
      feature,
      count,
      metadata,
    },
  })
}
