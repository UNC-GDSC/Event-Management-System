import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  // Get statistics
  const totalUsers = await db.user.count()
  const activeSubscriptions = await db.subscription.count({
    where: { status: 'ACTIVE', plan: { not: 'FREE' } },
  })

  const monthlyRevenue = await db.subscription.count({
    where: { status: 'ACTIVE', plan: { in: ['STARTER', 'PRO', 'ENTERPRISE'] } },
  })

  const recentUsers = await db.user.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      subscription: true,
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your SaaS platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Paid subscribers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyRevenue * 20}</div>
            <p className="text-xs text-muted-foreground">
              Estimated MRR
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUsers > 0 ? ((activeSubscriptions / totalUsers) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Free to paid
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest user registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{user.name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{user.subscription?.plan || 'FREE'}</p>
                  <p className="text-xs text-muted-foreground">{user.subscription?.status || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
