# Setup Guide 🚀

This guide will walk you through setting up your Micro SaaS Starter Kit from scratch.

## Quick Start (5 minutes)

### 1. Environment Setup

\`\`\`bash
# Clone and install
git clone <your-repo>
cd micro-saas-starter-kit
npm install

# Copy environment file
cp .env.example .env
\`\`\`

### 2. Database Setup

**Option A: Local PostgreSQL**

\`\`\`bash
# Install PostgreSQL (if not installed)
# macOS
brew install postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql-15

# Start PostgreSQL
brew services start postgresql@15  # macOS
sudo service postgresql start       # Linux

# Create database
createdb micro_saas

# Update .env
DATABASE_URL="postgresql://user:password@localhost:5432/micro_saas"
\`\`\`

**Option B: Docker PostgreSQL**

\`\`\`bash
docker run -d \\
  --name micro-saas-db \\
  -e POSTGRES_PASSWORD=postgres \\
  -e POSTGRES_DB=micro_saas \\
  -p 5432:5432 \\
  postgres:15-alpine

# Update .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/micro_saas"
\`\`\`

**Option C: Cloud Database (Recommended for production)**

- [Neon](https://neon.tech) - Free tier available
- [Supabase](https://supabase.com) - Free tier available
- [PlanetScale](https://planetscale.com) - Free tier available

### 3. Stripe Setup

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Create account or login

2. **Get API Keys**
   - Go to Developers > API Keys
   - Copy "Publishable key" and "Secret key"
   - Add to `.env`:
   \`\`\`
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   \`\`\`

3. **Create Products**
   - Go to Products
   - Create three products:
     - **Starter** - $9/month
     - **Pro** - $29/month
     - **Enterprise** - $99/month
   - For each product, copy the Price ID
   - Add to `.env`:
   \`\`\`
   STRIPE_PRICE_ID_STARTER=price_...
   STRIPE_PRICE_ID_PRO=price_...
   STRIPE_PRICE_ID_ENTERPRISE=price_...
   \`\`\`

4. **Setup Webhooks (Development)**
   \`\`\`bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe  # macOS

   # Login
   stripe login

   # Start webhook forwarding
   stripe listen --forward-to localhost:3000/api/webhooks/stripe

   # Copy webhook secret to .env
   STRIPE_WEBHOOK_SECRET=whsec_...
   \`\`\`

### 4. NextAuth Setup

1. **Generate Secret**
   \`\`\`bash
   openssl rand -base64 32
   \`\`\`

   Add to `.env`:
   \`\`\`
   NEXTAUTH_SECRET=<generated-secret>
   NEXTAUTH_URL=http://localhost:3000
   \`\`\`

2. **Google OAuth (Optional)**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project
   - Enable Google+ API
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI:
     - `http://localhost:3000/api/auth/callback/google`
   - Add credentials to `.env`:
   \`\`\`
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   \`\`\`

3. **GitHub OAuth (Optional)**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create new OAuth app
   - Set callback URL: `http://localhost:3000/api/auth/callback/github`
   - Add credentials to `.env`:
   \`\`\`
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   \`\`\`

### 5. Email Setup (Optional but Recommended)

**Using Resend (Recommended)**

1. Create account at [resend.com](https://resend.com)
2. Get API key
3. Add to `.env`:
   \`\`\`
   RESEND_API_KEY=re_...
   EMAIL_FROM=noreply@yourdomain.com
   \`\`\`

### 6. Initialize Database

\`\`\`bash
# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio to view data
npm run db:studio
\`\`\`

### 7. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## Production Deployment

### Vercel (Easiest)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables from `.env`
   - Deploy!

3. **Setup Production Webhooks**
   - In Stripe Dashboard, add webhook endpoint:
   - URL: `https://yourdomain.vercel.app/api/webhooks/stripe`
   - Events: Select all subscription and payment events
   - Copy webhook secret to Vercel environment variables

### Docker

\`\`\`bash
# Build
docker build -t micro-saas .

# Run
docker run -p 3000:3000 --env-file .env micro-saas
\`\`\`

### Docker Compose

\`\`\`bash
docker-compose up -d
\`\`\`

## Post-Deployment Checklist

- [ ] Database is accessible and seeded
- [ ] Stripe webhooks are working
- [ ] OAuth providers are configured
- [ ] Email sending works
- [ ] All environment variables are set
- [ ] SSL certificate is active
- [ ] Test user signup
- [ ] Test subscription purchase
- [ ] Test webhook delivery
- [ ] Configure DNS
- [ ] Set up monitoring

## Customization

### Update Branding

1. **App Name**
   - Update `NEXT_PUBLIC_APP_NAME` in `.env`
   - Update in `src/components/navbar.tsx`

2. **Logo**
   - Replace logo in navbar component
   - Add favicon to `public/`

3. **Colors**
   - Edit `tailwind.config.ts`
   - Update CSS variables in `src/app/globals.css`

### Modify Plans

Edit `src/lib/stripe.ts`:

\`\`\`typescript
export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: ['Feature 1', 'Feature 2'],
    limits: { apiCalls: 100 }
  },
  // Add more plans
}
\`\`\`

## Troubleshooting

### Database Connection Issues

\`\`\`bash
# Test connection
npx prisma db pull

# Reset database
npx prisma migrate reset
\`\`\`

### Stripe Webhooks Not Working

- Check webhook secret is correct
- Ensure webhook URL is accessible
- Check Stripe CLI is running (development)
- Verify webhook signature in Stripe Dashboard

### OAuth Not Working

- Check redirect URIs match exactly
- Verify client IDs and secrets
- Check OAuth app is enabled
- Clear browser cookies

### Build Errors

\`\`\`bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
\`\`\`

## Need Help?

- 📧 Email: support@yourdomain.com
- 💬 Discord: [Join our community]
- 📚 Docs: [Documentation]
- 🐛 Issues: [GitHub Issues]

## Next Steps

After setup:
1. Customize your landing page
2. Add your product features
3. Configure email templates
4. Set up analytics
5. Add your content
6. Test everything
7. Launch! 🚀
