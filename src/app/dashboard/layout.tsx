import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { DashboardNav } from '@/components/dashboard-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1 overflow-y-auto bg-muted/10 p-8">
        {children}
      </main>
    </div>
  )
}
