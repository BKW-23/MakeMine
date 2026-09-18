# MakeMine

MakeMine is a Vite/React storefront backed by Supabase and Vercel serverless
functions. The browser uses only the Supabase anon key. Customer/order lookups,
admin operations, and Gemini calls run through controlled server endpoints.

## Setup

1. Install Node.js 20+.
2. Install dependencies with `pnpm install` or `npm install`.
3. Apply `supabase/migrations/001_init.sql`, then
   `supabase/migrations/002_security_hardening.sql` in Supabase.
4. Run `supabase/seed.sql` to add the sample catalog.
5. Start the frontend with `npm run dev`.

## Environment variables

Client-side (safe to expose):

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

Vercel server-only variables (never prefix with `VITE_`):

```text
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
GEMINI_API_KEY=YOUR_GEMINI_KEY
```

Set all five variables for Vercel Production, redeploy, and add the deployed
Vercel origin to Supabase Auth redirect URLs. Promote an account to admin only
after registration by updating its `profiles.role` in Supabase.

## Checks

```bash
npm run build
npm run lint
```

The `api/` directory contains Vercel functions. Secrets are read only from
server-side environment variables and are never imported into the browser build.
