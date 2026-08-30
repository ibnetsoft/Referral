# Referral Signup Temporary Web MVP

## Project Structure

```text
src/
  app/
    api/
      admin/export/route.ts
      auth/login/route.ts
      auth/logout/route.ts
      auth/signup/route.ts
      referrals/lookup/route.ts
      tree/route.ts
    admin/page.tsx
    login/page.tsx
    mypage/page.tsx
    signup/page.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
    auth/login-form.tsx
    auth/signup-form.tsx
    referral-tree.tsx
    share-buttons.tsx
  lib/
    auth/
      current-user.ts
      guards.ts
      password.ts
      rate-limit.ts
      session.ts
    admin.ts
    db.ts
    env.ts
    http.ts
    referral.ts
    tree.ts
    users.ts
    validators.ts
supabase/
  migrations/
    20260830_init_referral_signup_mvp.sql
```

## DB Design

### `public.users`

- `id UUID PK`
- `username VARCHAR UNIQUE NOT NULL`
- `password_hash TEXT NOT NULL`
- `referral_code VARCHAR UNIQUE NOT NULL`
- `recommender_id UUID NULL REFERENCES users(id)`
- `role VARCHAR NOT NULL DEFAULT 'USER'`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`

### `public.user_sessions`

- `id UUID PK`
- `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE`
- `token_hash TEXT UNIQUE NOT NULL`
- `expires_at TIMESTAMPTZ NOT NULL`
- `ip_address INET NULL`
- `user_agent TEXT NULL`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()`

### `public.login_attempts`

- `id UUID PK`
- `username VARCHAR NULL`
- `ip_address INET NULL`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`

## API Design

### Auth

- `POST /api/auth/signup`
  - body: `username`, `password`, `password_confirm`, `referral_code`, `locked_referral_code`
  - behavior: validates input, re-validates referral code on server, creates hashed password + referral code + session cookie
- `POST /api/auth/login`
  - body: `username`, `password`
  - behavior: DB-backed rate limit, password verification, session issue
- `POST /api/auth/logout`
  - behavior: session revoke + cookie clear

### Referral

- `GET /api/referrals/lookup?code=XXXX`
  - response: recommender basic info or invalid state
- `GET /api/tree?rootUserId=<uuid>`
  - auth required
  - normal user: only own root allowed
  - admin: any user root allowed
  - response: lazy-expand child node list with direct/total counts

### Admin

- `GET /api/admin/export`
  - admin only
  - returns xlsx file

## Route Design

- `/`
  - landing page and signup CTA
- `/signup`
  - optional `?ref=CODE`
  - if `ref` exists, referral locked in UI
- `/login`
  - username/password login
- `/mypage`
  - authenticated user summary, referral URL, copy, Kakao share, tree
- `/admin`
  - admin dashboard, stats, member search, tree root selection, Excel export

## Security Notes

- password hashed with `bcryptjs`
- session token stored as SHA-256 hash in DB, raw token only in cookie
- cookie uses `httpOnly`, `sameSite=lax`, `secure` in production
- referral relation is write-once at signup only
- admin routes re-check role server-side
- login brute-force limited by username + IP window
- recursive organization queries use `WITH RECURSIVE`
