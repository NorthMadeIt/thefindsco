-- This mirrors the migration already applied directly to the FINDSCO Supabase
-- project (hhfclfwawligeutnxpqm) via the Supabase MCP connector. It's included
-- here so the schema is versioned in git and reproducible for a fresh project.
--
-- It EXTENDS the schema that already existed on FINDSCO (categories, products,
-- orders, page_views) rather than replacing it -- nothing is renamed or dropped.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$ language sql stable security definer;

alter table profiles enable row level security;

drop policy if exists "profiles_select_own_or_admin" on profiles;
create policy "profiles_select_own_or_admin" on profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

alter table products add column if not exists stock integer not null default 0;
alter table products add column if not exists compare_at_price numeric;
alter table products add column if not exists featured boolean not null default false;
alter table products add column if not exists status text not null default 'active'
  check (status in ('active','draft','archived'));
alter table products add column if not exists sku text;

drop policy if exists "products_admin_write" on products;
create policy "products_admin_write" on products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public Read Products" on products;
create policy "Public Read Products" on products
  for select using (status = 'active' or public.is_admin());

drop policy if exists "categories_admin_write" on categories;
create policy "categories_admin_write" on categories
  for all using (public.is_admin()) with check (public.is_admin());

alter table orders add column if not exists payment_status text not null default 'unpaid'
  check (payment_status in ('unpaid','paid','refunded'));

drop policy if exists "orders_select_own_or_admin" on orders;
create policy "orders_select_own_or_admin" on orders
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "orders_insert_any" on orders;
create policy "orders_insert_any" on orders
  for insert with check (true);

drop policy if exists "orders_admin_update" on orders;
create policy "orders_admin_update" on orders
  for update using (public.is_admin());

alter table page_views add column if not exists event_type text not null default 'page_view';
alter table page_views add column if not exists session_id text;

drop policy if exists "page_views_admin_read" on page_views;
create policy "page_views_admin_read" on page_views
  for select using (public.is_admin());
