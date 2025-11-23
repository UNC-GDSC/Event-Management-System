import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateReferralCode } from '@/lib/utils'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    let referral = await db.referral.findUnique({
      where: { userId: session.user.id },
    })

    if (!referral) {
      // Create referral code if doesn't exist
      const code = generateReferralCode()
      referral = await db.referral.create({
        data: {
          userId: session.user.id,
          code,
        },
      })
    }

    return NextResponse.json(referral)
  } catch (error) {
    console.error('Referral fetch error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
