# Store

A mobile-first React + TypeScript storefront with Supabase as the backend (products, categories,
auth, orders, analytics). Built with Vite, Tailwind, Framer Motion, Zustand, React Hook Form + Zod.

The admin dashboard is a **separate app** (`store-admin/`, its own repo/deploy) — this repo is the
customer-facing storefront only, with no admin routes or admin UI baked in.

## What's included

- **Directional product slideshow** on the homepage — a full-bleed hero with left/right nav
  circles that fade in on hover; navigating right slides the incoming product in from the right
  while scaling up, navigating left mirrors that from the left, matching a reference site's motion
- **Product detail page** with a back button (top right), spec grid, and a link through to a
  dedicated **"What's included" page** — hover the numbered dots over the product image to see
  each included item's name, same idea as a "set includes" unboxing screen. Back navigation uses
  explicit route state rather than browser history, so it's always deterministic regardless of how
  many pages you've clicked through.
- Category navigation in the header, category chip filters on the homepage
- Shareable product pages at `/products/:slug` with Open Graph/Twitter metadata, so links unfurl
  with the product's own image, name, and price instead of a generic site preview
- Cart drawer, checkout, guest + authenticated orders, account/order history, search, cart + profile
  icons in the header
- If `VITE_ADMIN_URL` is set, signed-in admins see a "Dashboard" link in the header and account page
  that opens the separate admin app in a new tab — this repo has no admin functionality of its own
- Server-verified pricing at checkout — the client cart is a convenience UI only; `createOrder()`
  re-reads the live product price from Supabase before writing the order
- Row Level Security on every table — admin-only writes are enforced in Postgres, not just hidden
  buttons in the UI
- Funnel analytics (`page_view`, `product_view`, `add_to_cart`, `checkout_start`, `purchase`) tied to
  `product_id`, viewable per shared link (from the admin app)

## Data model notes

- **Specs** (shown on the product detail page) are stored as `[{"label": "...", "value": "..."}]` in
  the `specs` jsonb column — managed from the admin app.
- **Includes** ("what's in the box") are a plain text array in `includes`. Their hover-dot positions
  on the product image come from `includes_positions` — an array of `{"x": 0-100, "y": 0-100}`
  percentages, matched by index to `includes`. If you leave it empty, dots space themselves out
  evenly along the image automatically; set real coordinates later for pixel-accurate placement.

## Setup

1. **Create a Supabase project** at supabase.com.
2. **Run the schema**: open the SQL editor in your Supabase project and run the files in
   `supabase/migrations/` in order, then optionally `supabase/seed.sql` for sample data.
3. **Make yourself an admin**: sign up once through this app, then run this in the SQL editor:
   ```sql
   update profiles set is_admin = true where email = 'you@example.com';
   ```
   Then log into the separate `store-admin` app with that same account.
4. **Require email verification** (dashboard setting — there's no API for this, it has to be done by
   hand): go to **Authentication → Providers → Email** and turn on **Confirm email**. Once that's on,
   `signUp()` no longer returns a live session — Supabase emails a verification link immediately, and
   the account can't log in until that link is clicked. The app already handles this (see
   `src/pages/Register.tsx` / `Login.tsx`): after signing up you'll see a "check your email" screen,
   and trying to log in before verifying shows a "resend verification email" option instead of a
   generic error.
   - Also set **Authentication → URL Configuration → Site URL** to your real domain (or
     `http://localhost:5173` for local dev), and add it to **Redirect URLs** — this is the link
     target inside the verification email.
   - To make the one confirmation email double as a welcome message, edit its copy under
     **Authentication → Emails → Confirm signup** (add your welcome copy above the confirmation
     link — Supabase only sends one email on signup, so this is where "welcome + verify" lives).
   - **Important**: Supabase's built-in email sending is rate-limited and, per their recent policy
     change, restricted to your organization's own members unless you configure a custom SMTP
     provider. For a real store with real customers, set one up under **Project Settings →
     Authentication → SMTP Settings** (Resend, Postmark, and AWS SES all work well) — otherwise
     verification emails may simply never reach anyone outside your team.
5. **Env vars**: copy `.env.example` to `.env` and fill in your Supabase project URL and anon key
   (Project Settings → API in the Supabase dashboard). Also set `VITE_SITE_URL` to your deployed
   domain once you have one — it's used to build the canonical/OG URLs on product pages.
6. **Install & run**:
   ```bash
   npm install
   npm run dev
   ```
7. **Add your logo**: this repo already has a placeholder mark at
   `src/assets/logo/store-logo.svg`. Once you've cut the background off your real logo (any
   background-removal tool works — remove.bg, Photoshop, etc.), export it as a transparent PNG or
   SVG, drop it into `src/assets/logo/`, and update the `import logo from ...` line at the top of
   `src/components/layout/Header.tsx` to point at the new filename.

## Auth security notes

A few things are enforced at the database level (not just hidden in the UI), because RLS is the
real security boundary — anyone can call the Supabase REST API directly with the public anon key,
bypassing the app entirely:

- **Nobody can make themselves admin.** The obvious approach — letting a user update their own
  `profiles` row — would let them also flip `is_admin` to `true` on themselves via a raw API call.
  A trigger (`protect_is_admin`) silently keeps `is_admin` unchanged on any update unless the person
  making the change is already an admin.
- **Orders can't be forged.** `orders_insert_any` requires `user_id` to be either null (guest
  checkout) or equal to the caller's own `auth.uid()` — nobody can insert an order that impersonates
  another shopper. A second trigger (`validate_order_total`) recomputes the order total from the
  live product prices and rejects the insert if the submitted total doesn't match, so a tampered
  client-side cart total is rejected by Postgres itself, not just re-checked by app code that could
  be skipped.
- **Only admins can read other people's data.** Every `select` policy on `profiles` and `orders`
  checks `auth.uid() = <owner column> or is_admin()` — there's no path for one logged-in user to
  read another user's orders or profile.
- Trigger functions (`handle_new_user`, `protect_is_admin`, `validate_order_total`) have `EXECUTE`
  revoked from the API roles, so they're only reachable as triggers, never as a direct RPC call.

## Adding products & photos

All product/category/order management now happens in the separate `store-admin` app — this repo is
storefront-only. See `store-admin/README.md` for setup. In short: it has real photo upload (uploads
go straight to a `product-images` Supabase Storage bucket, public read / admin-only write via RLS),
specs, what's-in-the-box items, price, category, stock, and draft/active/archived status.

## Deploying — checklist if something looks wrong

If the live site is missing the header (logo, search, cart, profile icons) or the bottom nav, the
deployed code is out of sync with this repo — usually because an earlier version got pushed and
never fully replaced. When you (or a tool pushing on your behalf) update the repo, **replace the
whole `src/` directory** rather than merging file-by-file, then confirm on the live site that:
- a slim header bar with your logo, a search icon, a cart icon, and a profile icon appears at the
  very top of every page
- a bottom navigation bar (Home / Shop / Cart / Account) appears on mobile widths
- the required env vars are set in Vercel's project settings (Settings → Environment Variables) —
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL`, and optionally `VITE_ADMIN_URL` —
  and redeployed after being added, since env var changes don't apply to old builds

## Not included yet (by design, so you can choose your own provider)

- **Payments**: `src/components/checkout/Payment.tsx` is a placeholder. Orders are created with
  `payment_status = 'unpaid'`; wire in Stripe (or similar) and flip that status on successful
  payment.
- **Transactional email** (order confirmations, shipping updates): add a Supabase Edge Function
  triggered on order insert, or a provider like Resend/Postmark.

## Project structure

See the file tree — it mirrors the phases you'd build in: foundation → catalog → commerce → admin →
polish. Everything in `src/services/` is the only layer that talks to Supabase directly, so swapping
data sources later stays contained.
