import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, ArrowRight, Star, Zap, Shield, TrendingUp, Users, Globe } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PLANS } from '@/lib/stripe'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-block">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                <Zap className="mr-2 h-4 w-4" />
                Launch your SaaS in days, not months
              </span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">
              Build and Launch Your
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> SaaS </span>
              Faster
            </h1>
            <p className="mb-10 text-xl text-muted-foreground">
              Complete Next.js SaaS boilerplate with authentication, payments, subscriptions,
              and everything you need to launch your product.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="text-lg">
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required • Free plan available
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-bold">Everything You Need</h2>
            <p className="mb-12 text-lg text-muted-foreground">
              All the features you need to launch and scale your SaaS product
            </p>
          </div>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Shield className="h-8 w-8" />}
                title="Authentication"
                description="Complete auth system with Google, GitHub, and email login. Secure and ready to use."
              />
              <FeatureCard
                icon={<TrendingUp className="h-8 w-8" />}
                title="Stripe Integration"
                description="Full Stripe integration with subscriptions, webhooks, and customer portal."
              />
              <FeatureCard
                icon={<Users className="h-8 w-8" />}
                title="User Management"
                description="Admin dashboard to manage users, subscriptions, and analytics."
              />
              <FeatureCard
                icon={<Globe className="h-8 w-8" />}
                title="SEO Optimized"
                description="Built-in SEO best practices, metadata, and sitemap generation."
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8" />}
                title="High Performance"
                description="Optimized for speed with Next.js 14 and server components."
              />
              <FeatureCard
                icon={<Star className="h-8 w-8" />}
                title="Modern UI"
                description="Beautiful, responsive UI built with Tailwind CSS and shadcn/ui."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-bold">Simple, Transparent Pricing</h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </div>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-4">
              <PricingCard
                name={PLANS.FREE.name}
                price={PLANS.FREE.price}
                description="Perfect for getting started"
                features={PLANS.FREE.features}
                cta="Get Started"
                href="/auth/signup"
              />
              <PricingCard
                name={PLANS.STARTER.name}
                price={PLANS.STARTER.price}
                description="For growing businesses"
                features={PLANS.STARTER.features}
                cta="Start Free Trial"
                href="/auth/signup"
                popular
              />
              <PricingCard
                name={PLANS.PRO.name}
                price={PLANS.PRO.price}
                description="For professional teams"
                features={PLANS.PRO.features}
                cta="Start Free Trial"
                href="/auth/signup"
              />
              <PricingCard
                name={PLANS.ENTERPRISE.name}
                price={PLANS.ENTERPRISE.price}
                description="For large organizations"
                features={PLANS.ENTERPRISE.features}
                cta="Contact Sales"
                href="/contact"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-bold">Loved by Founders</h2>
            <p className="mb-12 text-lg text-muted-foreground">
              See what our customers have to say
            </p>
          </div>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <TestimonialCard
                quote="This starter kit saved me months of development time. Highly recommended!"
                author="Sarah Johnson"
                role="Founder at StartupXYZ"
                rating={5}
              />
              <TestimonialCard
                quote="The best SaaS boilerplate I've used. Clean code and great documentation."
                author="Michael Chen"
                role="CEO at TechCorp"
                rating={5}
              />
              <TestimonialCard
                quote="Stripe integration works flawlessly. Saved us so much time on payments."
                author="Emily Rodriguez"
                role="CTO at AppVentures"
                rating={5}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold">Ready to Get Started?</h2>
            <p className="mb-8 text-xl opacity-90">
              Join thousands of founders building their SaaS with our starter kit
            </p>
            <Button size="lg" variant="secondary" asChild className="text-lg">
              <Link href="/auth/signup">
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 text-primary">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  href,
  popular = false,
}: {
  name: string
  price: number
  description: string
  features: string[]
  cta: string
  href: string
  popular?: boolean
}) {
  return (
    <Card className={popular ? 'border-primary shadow-lg' : ''}>
      {popular && (
        <div className="bg-primary px-3 py-1 text-center text-sm font-medium text-primary-foreground">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <Check className="mr-2 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={popular ? 'default' : 'outline'} asChild>
          <Link href={href}>{cta}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function TestimonialCard({ quote, author, role, rating }: { quote: string; author: string; role: string; rating: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <CardDescription className="text-base">&ldquo;{quote}&rdquo;</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-muted-foreground">{role}</div>
        </div>
      </CardContent>
    </Card>
  )
}
