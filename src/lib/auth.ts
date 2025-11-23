import { NextAuthOptions, DefaultSession, User as NextAuthUser } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
    } & DefaultSession['user']
  }

  interface User extends NextAuthUser {
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Create Stripe customer and free subscription on first sign in
      if (account?.provider && user.email) {
        const existingSubscription = await db.subscription.findUnique({
          where: { userId: user.id },
        })

        if (!existingSubscription) {
          const stripe = require('@/lib/stripe').stripe

          const customer = await stripe.customers.create({
            email: user.email,
            name: user.name || undefined,
            metadata: {
              userId: user.id,
            },
          })

          await db.subscription.create({
            data: {
              userId: user.id,
              stripeCustomerId: customer.id,
              status: 'ACTIVE',
              plan: 'FREE',
            },
          })
        }
      }
      return true
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.role = token.role
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      } else if (token.email) {
        // Refresh user data from database
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
        }
      }
      return token
    },
  },
  events: {
    async createUser({ user }) {
      // Log analytics event
      await db.analyticsEvent.create({
        data: {
          userId: user.id,
          event: 'user_created',
          properties: {
            email: user.email,
            name: user.name,
          },
        },
      })
    },
  },
}
