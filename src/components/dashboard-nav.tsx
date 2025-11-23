'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  Users,
  BarChart3,
  LogOut,
  Home,
  Gift,
} from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Referrals', href: '/dashboard/referrals', icon: Gift },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Users', href: '/admin/users', icon: Users },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="flex w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Home className="h-6 w-6" />
          <span>{process.env.NEXT_PUBLIC_APP_NAME || 'MicroSaaS'}</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}

        {isAdmin && (
          <>
            <div className="my-4 border-t" />
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
              ADMIN
            </div>
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3 px-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {session?.user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="truncate text-sm font-medium">{session?.user?.name}</div>
            <div className="truncate text-xs text-muted-foreground">
              {session?.user?.email}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
