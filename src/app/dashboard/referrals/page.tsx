'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Check, Gift, Users } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function ReferralsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [referralData, setReferralData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${referralData?.code || ''}`

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/referrals')
      const data = await response.json()
      setReferralData(data)
    } catch (error) {
      console.error('Failed to fetch referral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    toast({
      title: 'Copied!',
      description: 'Referral link copied to clipboard',
    })
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Referral Program</h1>
        <p className="text-muted-foreground">
          Invite friends and earn rewards
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Code</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralData?.code || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              Your unique code
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralData?.conversions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Successful signups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Earned</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${referralData?.credits || 0}</div>
            <p className="text-xs text-muted-foreground">
              In rewards
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>
            Share this link to invite friends and earn rewards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={referralUrl} readOnly />
            <Button onClick={copyToClipboard} variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Earn $10 credit for each friend who signs up for a paid plan using your referral link!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How it Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Share your unique referral link with friends</li>
            <li>They sign up using your link</li>
            <li>When they subscribe to a paid plan, you both earn $10 credit</li>
            <li>Credits can be applied to your subscription</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
