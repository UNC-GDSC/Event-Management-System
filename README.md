# Micro SaaS Starter Kit 🚀

A production-ready SaaS boilerplate built with Next.js 14, TypeScript, Stripe, and more. Launch your SaaS product in days, not months.

## Features ✨

- **🔐 Authentication** - Complete auth system with NextAuth.js (Google, GitHub, Email)
- **💳 Payments** - Stripe integration with subscriptions, checkout, and customer portal
- **📊 Admin Dashboard** - Comprehensive admin panel with analytics and user management
- **👤 User Dashboard** - Beautiful user dashboard with subscription management
- **📧 Email System** - Transactional emails with Resend
- **🎨 Modern UI** - Stunning UI built with Tailwind CSS and shadcn/ui
- **🌙 Dark Mode** - Full dark mode support
- **📱 Responsive** - Mobile-first responsive design
- **🔒 Type Safe** - Full TypeScript support
- **🗄️ Database** - PostgreSQL with Prisma ORM
- **🎁 Referral System** - Built-in referral program
- **📈 Analytics** - Usage tracking and analytics
- **🚀 SEO Optimized** - Built-in SEO best practices
- **⚡ Performance** - Optimized with Next.js 14 App Router

## Tech Stack 🛠️

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** NextAuth.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Payments:** Stripe
- **Email:** Resend
- **Analytics:** PostHog (optional)

## Getting Started 🏁

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Stripe account
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)
- Resend account (optional)

### Installation

1. **Clone the repository**

\`\`\`bash
git clone https://github.com/yourusername/micro-saas-starter-kit.git
cd micro-saas-starter-kit
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**

Copy `.env.example` to `.env` and fill in your values:

\`\`\`bash
cp .env.example .env
\`\`\`

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for local)
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret

4. **Set up the database**

\`\`\`bash
npm run db:push
\`\`\`

5. **Run the development server**

\`\`\`bash
npm run dev
\`\`\`

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Stripe Setup 💳

1. **Create Stripe Products**

Go to your Stripe Dashboard and create products for each plan:
- Starter Plan (e.g., $9/month)
- Pro Plan (e.g., $29/month)
- Enterprise Plan (e.g., $99/month)

2. **Update Environment Variables**

Add the price IDs to your `.env`:

\`\`\`
STRIPE_PRICE_ID_STARTER=price_xxx
STRIPE_PRICE_ID_PRO=price_xxx
STRIPE_PRICE_ID_ENTERPRISE=price_xxx
\`\`\`

3. **Set up Webhooks**

In development, use Stripe CLI:

\`\`\`bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
\`\`\`

In production, add webhook endpoint in Stripe Dashboard:
- URL: `https://yourdomain.com/api/webhooks/stripe`
- Events to listen: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`, `invoice.payment_succeeded`

## OAuth Setup 🔑

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Add credentials to `.env`:

\`\`\`
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
\`\`\`

### GitHub OAuth

1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Create a new OAuth app
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add credentials to `.env`:

\`\`\`
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
\`\`\`

## Project Structure 📁

\`\`\`
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── api/              # API routes
│   │   ├── auth/             # Auth pages
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── admin/            # Admin pages
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── navbar.tsx       # Navigation
│   │   └── footer.tsx       # Footer
│   └── lib/                  # Utility functions
│       ├── auth.ts          # NextAuth configuration
│       ├── db.ts            # Prisma client
│       ├── stripe.ts        # Stripe utilities
│       ├── email.ts         # Email functions
│       └── utils.ts         # Helper functions
├── .env.example              # Example environment variables
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
└── package.json             # Dependencies
\`\`\`

## Available Scripts 📜

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma client

## Deployment 🚀

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Docker

Build and run with Docker:

\`\`\`bash
docker build -t micro-saas .
docker run -p 3000:3000 micro-saas
\`\`\`

## Customization 🎨

### Branding

1. Update `NEXT_PUBLIC_APP_NAME` in `.env`
2. Replace logo in `src/components/navbar.tsx`
3. Update metadata in `src/app/layout.tsx`
4. Customize colors in `tailwind.config.ts`

### Pricing Plans

Edit plans in `src/lib/stripe.ts`:

\`\`\`typescript
export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [...],
    limits: { apiCalls: 100 }
  },
  // Add or modify plans
}
\`\`\`

## Features in Detail 📝

### Authentication

- Email/password login
- OAuth (Google, GitHub)
- Protected routes with middleware
- Session management

### Subscriptions

- Multiple pricing tiers
- Stripe Checkout integration
- Customer portal for managing subscriptions
- Automatic invoice generation
- Webhook handling for subscription events

### Admin Dashboard

- User management
- Subscription analytics
- Revenue tracking
- Usage statistics

### User Dashboard

- Subscription status
- Usage tracking
- Billing management
- Referral program

### Referral System

- Unique referral codes
- Credit rewards
- Conversion tracking

## Security 🔒

- Environment variables for sensitive data
- Stripe webhook signature verification
- Protected API routes
- SQL injection prevention with Prisma
- XSS protection with Next.js

## Performance ⚡

- Server-side rendering
- Static generation where possible
- Image optimization
- Code splitting
- Lazy loading

## Support 💬

For support, email support@yourdomain.com or join our Discord community.

## Contributing 🤝

Contributions are welcome! Please read our contributing guidelines first.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Stripe](https://stripe.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)

---

Made with ❤️ by [Your Name]

**Star ⭐ this repo if you find it helpful!**
