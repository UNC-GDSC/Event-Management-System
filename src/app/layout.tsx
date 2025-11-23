import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME || 'Micro SaaS Starter',
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'Micro SaaS Starter'}`,
  },
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Launch your SaaS in days, not months',
  keywords: ['SaaS', 'Starter Kit', 'Next.js', 'Stripe', 'Subscriptions'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    creator: '@yourusername',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
