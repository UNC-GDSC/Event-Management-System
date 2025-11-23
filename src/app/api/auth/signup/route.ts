import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user.email!,
      name: user.name || undefined,
      metadata: {
        userId: user.id,
      },
    })

    // Create free subscription
    await db.subscription.create({
      data: {
        userId: user.id,
        stripeCustomerId: customer.id,
        status: 'ACTIVE',
        plan: 'FREE',
      },
    })

    // Log analytics event
    await db.analyticsEvent.create({
      data: {
        userId: user.id,
        event: 'user_signup',
        properties: {
          method: 'credentials',
        },
      },
    })

    // Send welcome email
    if (user.email && user.name) {
      await sendWelcomeEmail(user.email, user.name)
    }

    return NextResponse.json(
      { message: 'User created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
