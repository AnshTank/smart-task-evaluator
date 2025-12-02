# Deployment Guide

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down your project URL and anon key

### 2. Database Setup

1. Go to SQL Editor in Supabase dashboard
2. Run the schema from `supabase/schema.sql`
3. Verify all tables are created with RLS enabled

### 3. Authentication Setup

1. Go to Authentication > Settings
2. Enable email authentication
3. Add site URL: `https://your-domain.vercel.app`
4. Add redirect URLs for auth callbacks

## Vercel Deployment

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings (Next.js preset)

### 2. Environment Variables

Add all environment variables from `.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

### 3. Deploy

1. Click Deploy
2. Wait for build to complete
3. Test the live application

## API Keys Setup

### Google Gemini

1. Go to [ai.google.dev](https://ai.google.dev)
2. Create API key
3. Add to environment variables

### Stripe

1. Go to [stripe.com](https://stripe.com)
2. Get publishable and secret keys
3. Set up webhook endpoint for payment confirmation
4. Add webhook secret to environment variables

## Post-Deployment Checklist

- [✔️] All pages load correctly
- [✔️] Authentication works
- [✔️] Task submission functions
- [✔️] AI evaluation processes
- [✔️] Payment flow completes
- [✔️] Database operations succeed
- [✔️] Environment variables are secure
