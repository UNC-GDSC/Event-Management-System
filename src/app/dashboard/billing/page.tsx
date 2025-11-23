'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { PLANS } from '@/lib/stripe'

export default function BillingPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string | null, planName: string) => {
    if (!priceId) {
      toast({
        title: 'Info',
        description: 'You are already on the free plan',
      })
      return
    }

    setLoading(planName)
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to start checkout. Please try again.',
      })
      setLoading(null)
    }
  }

  const handleManageBilling = async () => {
    setLoading('portal')
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No portal URL returned')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to open billing portal. Please try again.',
      })
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscriptions</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Subscription</CardTitle>
          <CardDescription>
            Update your payment method, view invoices, and manage your subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleManageBilling} disabled={loading === 'portal'}>
            {loading === 'portal' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Open Billing Portal
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-6 text-2xl font-bold">Available Plans</h2>
        <div className="grid gap-6 lg:grid-cols-4">
          {Object.entries(PLANS).map(([key, plan]) => (
            <Card key={key} className={key === 'PRO' ? 'border-primary shadow-lg' : ''}>
              {key === 'PRO' && (
                <div className="bg-primary px-3 py-1 text-center text-sm font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={key === 'PRO' ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.priceId, plan.name)}
                  disabled={loading === plan.name}
                >
                  {loading === plan.name && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {plan.price === 0 ? 'Current Plan' : 'Subscribe'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
