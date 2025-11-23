import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PLANS } from '@/lib/stripe'
import { CreditCard, TrendingUp, Users, Activity } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  })

  // Get usage stats for current month
  const currentMonth = new Date()
  currentMonth.setDate(1)
  currentMonth.setHours(0, 0, 0, 0)

  const usageStats = await db.usageRecord.aggregate({
    where: {
      userId: session.user.id,
      createdAt: {
        gte: currentMonth,
      },
    },
    _sum: {
      count: true,
    },
  })

  const apiCallsUsed = usageStats._sum.count || 0
  const plan = subscription ? PLANS[subscription.plan as keyof typeof PLANS] : PLANS.FREE
  const apiCallsLimit = plan.limits.apiCalls
  const usagePercentage = (apiCallsUsed / apiCallsLimit) * 100

  // Get recent activity
  const recentActivity = await db.analyticsEvent.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscription?.plan || 'FREE'}</div>
            <p className="text-xs text-muted-foreground">
              {subscription?.status === 'ACTIVE' ? 'Active' : 'Inactive'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiCallsUsed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              of {apiCallsLimit.toLocaleString()} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usagePercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              of monthly limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(session.user.id).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Active member
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Usage</CardTitle>
          <CardDescription>
            Your API usage for the current billing period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>API Calls Used</span>
              <span className="font-medium">
                {apiCallsUsed.toLocaleString()} / {apiCallsLimit.toLocaleString()}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            {usagePercentage > 80 && (
              <p className="text-sm text-yellow-600 dark:text-yellow-500">
                You're approaching your monthly limit. Consider upgrading your plan.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium capitalize">
                      {activity.event.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
