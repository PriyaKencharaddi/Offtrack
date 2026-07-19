# Offtrack — Subscription Fatigue Checker

> Stop paying for subscriptions you forgot.

Offtrack is a premium dark-mode SaaS application for understanding recurring spend, spotting money leaks, tracking renewals, and finding verified cancellation paths.

## Features

- Premium responsive landing experience with motion and glassmorphism
- Supabase Authentication: email/password, Google OAuth, resets, persistent sessions, and protected routes
- Live subscription dashboard: spending, savings, health score, renewals, and calendar
- Subscription CRUD with trial, billing, status, notes, and payment-method fields
- Cancellation concierge for ChatGPT, Netflix, Spotify, Adobe, Canva, Notion, Figma, Grammarly, GitHub Copilot, Google One, Microsoft 365, and Amazon Prime
- Category and spending trend analytics
- Supabase Realtime updates per authenticated user

## Stack

React 19, TypeScript, Vite, Framer Motion, Lucide React, Recharts, FullCalendar, Supabase Auth/Postgres/Realtime, and Vercel.

## Local setup

Requirements: Node.js 20+ and a Supabase project.

```bash
npm install
```

Create `.env.local` using `.env.example`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Run the app:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Supabase database

Run this in Supabase **SQL Editor** to create private user profiles:

```sql
create table if not exists public."Users" (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public."Users" enable row level security;

create policy "Profiles are private"
on public."Users"
for all using (auth.uid() = id)
with check (auth.uid() = id);
```

Run this to create subscriptions and their RLS policy:

```sql
create table if not exists public."Subscriptions" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  logo text,
  cost numeric not null,
  currency text not null default 'USD',
  billing_cycle text not null check (billing_cycle in ('monthly', 'yearly')),
  purchase_date date,
  renewal_date date not null,
  trial_end_date date,
  email_used text,
  payment_method text,
  auto_renew boolean not null default true,
  notes text,
  status text not null default 'active' check (status in ('active', 'trial', 'cancelled')),
  created_at timestamptz default now()
);

alter table public."Subscriptions" enable row level security;

create policy "Users manage only their subscriptions"
on public."Subscriptions"
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

For live dashboard updates, go to Supabase **Database → Replication**, open `supabase_realtime`, and add `Subscriptions`.

## Authentication

### Email/password

Enable Email in Supabase **Authentication → Sign In / Providers**. Keep **Confirm email** enabled in production.

### Google OAuth

1. Create an OAuth 2.0 **Web application** client in Google Cloud.
2. Add this Authorized JavaScript origin:

   ```text
   http://localhost:5173
   ```

3. Add this Google Cloud Authorized redirect URI:

   ```text
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

4. In Supabase **Authentication → Sign In / Providers → Google**, enable Google and paste the matching Google Client ID and Client Secret.
5. In Supabase **Authentication → URL Configuration**, set:

   ```text
   Site URL: http://localhost:5173
   Redirect URL: http://localhost:5173/auth/callback
   ```

The Google callback and the app callback are different on purpose:

| Configuration | Value |
| --- | --- |
| Google Cloud redirect URI | `https://your-project-ref.supabase.co/auth/v1/callback` |
| Supabase app redirect URL | `http://localhost:5173/auth/callback` |

If Google cannot exchange the authorization code, replace the Client Secret in Supabase with a fresh secret from the same Google OAuth Web client. Do not use a Google AI Studio API key.

## Build

```bash
npm run build
npm run preview
```

## Deploy on Vercel

1. Push the project to GitHub.
2. Open [Vercel](https://vercel.com/new), import the repository, and use the free Hobby plan.
3. Add these Vercel environment variables:

   ```text
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   ```

4. Deploy. The included `vercel.json` provides SPA route rewrites.
5. In Supabase URL Configuration, use:

   ```text
   Site URL: https://your-app.vercel.app
   Redirect URL: https://your-app.vercel.app/auth/callback
   ```

6. Add `https://your-app.vercel.app` under Google Cloud Authorized JavaScript origins.

## Project structure

```text
src/
  components/  shared UI, route protection, subscription form
  context/     Supabase session state
  lib/         Supabase, subscriptions, cancellation guides
  pages/       landing, auth, callback, dashboard
  types.ts     shared models
```

## Security

- Never commit `.env.local` or Google Client Secrets.
- The anon key belongs in the browser only with Row Level Security enabled.
- All subscription access is scoped through `auth.uid()` policies.
- Google origins and redirect URLs must match exactly.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| “Supabase is not configured” | Add `.env.local` values and restart Vite. |
| `redirect_uri_mismatch` | Check Google Cloud has the Supabase `/auth/v1/callback` URI. |
| OAuth callback rejected | Add the app’s `/auth/callback` under Supabase Redirect URLs. |
| Google code exchange error | Recheck the matching Google Client ID and Secret in Supabase. |
| Dashboard has no data | Run the SQL schema and add a subscription while signed in. |
| Live updates missing | Add `Subscriptions` to `supabase_realtime`. |

## License

Private project. All rights reserved.
