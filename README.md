# Chai Pe Charcha — Next.js + Supabase (v2)

The rebuild of the restaurant site on Next.js (App Router, TypeScript), Supabase
(Postgres + Auth + Storage), Tailwind, and Vercel. **Cash on Delivery only** (no
online payments). This folder is the new app; the old HTML/Flask site stays
untouched until v2 is ready.

## Build status

- ✅ **Phase 0** — scaffold, brand theme, Supabase clients, middleware, security headers
- ✅ **Phase 1** — database schema, Row Level Security, secure `place_order`, seed
- ⏭️ Phase 2 — Auth + admin route protection
- ⏭️ Phase 3 — Storefront (home, menu, cart, COD checkout, tracking)
- ⏭️ Phase 4 — Admin dashboard
- ⏭️ Phase 5 — Hardening + launch

## One-time setup

### 1. Create a Supabase project
Go to **supabase.com** → New project (free). When it's ready, open
**Settings → API** and copy three values:
- Project URL
- `anon` public key
- `service_role` secret key

### 2. Create the database
Supabase → **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**.
This creates all tables, Row Level Security, the secure order function, and seeds
the categories + a few starter items.

### 3. Create your admin user
Supabase → **Authentication → Users → Add user** (email + password). Then in
**SQL Editor**, make that user an admin (use the email you just created):
```sql
update profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

### 4. Configure the app
```bash
cp .env.example .env.local
# paste your three Supabase values into .env.local
```

### 5. Install + run
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Project structure
```
app/            routes (storefront + /admin)  — Server Components by default
components/     reusable UI (storefront + admin)
lib/supabase/   client.ts (browser) · server.ts (SSR) · admin.ts (service role, server-only)
lib/actions/    Server Actions (secure mutations)
lib/validations/Zod schemas
middleware.ts   guards /admin
supabase/       schema.sql (run once)
```

## Security model (already in place)
- **RLS** — the database itself blocks non-admins from reading orders or writing menu data.
- **`place_order()`** — prices are computed in the database from the real item prices; the client can never set a price. Customers can only place orders through this function.
- **`get_order()`** — order details require the matching phone number (no enumeration).
- **Auth** — Supabase sessions in secure httpOnly cookies (same-domain on Vercel).
- **Service-role key** — only in `lib/supabase/admin.ts`, guarded by `server-only`.
- **Security headers** — set in `next.config.mjs`.

## Deploy (later, in Phase 5)
Push to GitHub → import into **Vercel** → add the three env vars in Vercel's
dashboard → deploy. Always-on, automatic HTTPS, no cold starts.
