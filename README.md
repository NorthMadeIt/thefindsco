# Store

A mobile-first React + TypeScript storefront with Supabase as the backend (products, categories,
auth, orders, analytics) and a separate admin dashboard. Built with Vite, Tailwind, Framer Motion,
Zustand, React Hook Form + Zod.

## What's included

- **Directional product slideshow** on the homepage — a full-bleed hero with left/right nav
  circles that fade in on hover; navigating right slides the incoming product in from the right
  while scaling up, navigating left mirrors that from the left, matching a reference site's motion
- **Product detail page** with a back button (top right), spec grid, and a link through to a
  dedicated **"What's included" page** — hover the numbered dots over the product image to see
  each included item's name, same idea as a "set includes" unboxing screen
- Category navigation in the header, category chip filters on the homepage
- Shareable product pages at `/products/:slug` with Open Graph/Twitter metadata, so links unfurl
  with the product's own image, name, and price instead of a generic site preview
- Cart drawer, checkout, guest + authenticated orders, account/order history, search, cart + profile
  icons in the header
- **Admin toolbar** — a floating pill bar that only renders for signed-in admins (checked against
  `profiles.is_admin`, enforced again by RLS server-side), with: add product, edit the product
  you're currently viewing, publish/unpublish it, a News/CMS panel for draft-or-published posts, and
  a safe "reset demo data" action that only adds the sample product back if it's missing — it never
  deletes anything
- A separate `/admin` dashboard (protected route) for bulk product/category CRUD, orders with status
  updates, customers, and revenue/traffic stats
- Server-verified pricing at checkout — the client cart is a convenience UI only; `createOrder()`
  re-reads the live product price from Supabase before writing the order
- Row Level Security on every table — admin-only writes are enforced in Postgres, not just hidden
  buttons in the UI
- Funnel analytics (`page_view`, `product_view`, `add_to_cart`, `checkout_start`, `purchase`) tied to
  `product_id`, viewable per shared link

## Data model notes

- **Specs** (shown on the product detail page) are stored as `[{"label": "...", "value": "..."}]` in
  the `specs` jsonb column. The admin form takes a shorthand: `Label:Value | Label:Value`.
- **Includes** ("what's in the box") are a plain text array in `includes`. Their hover-dot positions
  on the product image live in `includes_positions` (jsonb of `{x, y}` percentages).
- **Images** are a text array of URLs. First image is the primary.

## Security highlights

- `is_admin` on `profiles` is protected by a trigger that prevents non-admins from elevating
  themselves.
- Orders cannot be forged: insert policy requires `user_id` null or equal to the caller, and a
  trigger recomputes the total from live product prices.
- Only admins can read other users' data via RLS.

## Getting started

1. Copy `.env.example` → `.env` and set your Supabase URL + anon key.
2. `npm install`
3. Run the migrations in `supabase/migrations/` against your project (or use the SQL editor).
4. Optionally run `supabase/seed.sql` for demo data.
5. `npm run dev`

## Deploying

Push to GitHub, import in Vercel, set the same env vars. Static Vite build + Supabase.

## Project structure

See the file tree — foundation → catalog → commerce → admin → polish. `src/services/` is the only
layer that talks to Supabase.
