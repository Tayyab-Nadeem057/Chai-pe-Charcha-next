# Security — Chai Pe Charcha (Next.js + Supabase)

## Already enforced (the strong foundation)

- **Row Level Security (RLS)** on every table. Non-admins cannot read orders or
  write menu data — enforced by the database itself, not just app code.
- **Server-side pricing.** `place_order()` is a `SECURITY DEFINER` function that
  computes every total from the DB. The client can never set a price.
- **No order enumeration.** `get_order()` only returns details when the phone matches.
- **Auth in httpOnly, Secure cookies** (Supabase, same-domain on Vercel). The token
  is never in `localStorage`, so XSS can't steal it.
- **Admin protected twice:** `middleware.ts` (session) + the admin layout (role check),
  and RLS blocks the data even if both were bypassed.
- **Service-role key is server-only** (`server-only` import guard) — never shipped to
  the browser.
- **Input validation** with Zod on all mutations.
- **Image upload** is admin-gated, size-limited, and stored in Supabase Storage.
- **XSS:** React escapes all output by default; no `dangerouslySetInnerHTML`.
- **Security headers** (next.config.mjs): CSP, HSTS, X-Frame-Options DENY,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **SQL injection:** impossible — all queries are parameterized via Supabase.

## Action items (do these to fully harden)

### 1. Patch Next.js (known vulnerability)
```bash
npm install next@14 eslint-config-next@14
git add -A && git commit -m "Security: patch Next.js + harden headers" && git push
```

### 2. Rotate the Supabase secret key (it was shared in chat)
Supabase → **Settings → API → Secret keys → roll/rotate** the `sb_secret_…` key.
Then update `SUPABASE_SERVICE_ROLE_KEY` in **Vercel → Settings → Environment
Variables**, and redeploy.

### 3. Disable public sign-ups
Only the few admins you create should ever have accounts.
Supabase → **Authentication → Sign In / Providers → Email** → turn **OFF**
"Allow new users to sign up." (Create staff via the dashboard only.)

### 4. Enable extra auth protections
Supabase → **Authentication → Policies / Settings**:
- Turn on **Leaked password protection** (blocks known-breached passwords).
- Set a minimum password length (8+).

### 5. (Recommended) Rate limiting
Supabase Auth already rate-limits logins. To also throttle guest order spam,
add Upstash Redis + `@upstash/ratelimit` in front of the order action later.

## Verify
- Try opening `/admin` while logged out → must redirect to `/login`.
- Try reading the `orders` table from the public site → RLS returns nothing.
- Place an order with a tampered price in the request → the saved total is the
  real DB price.
