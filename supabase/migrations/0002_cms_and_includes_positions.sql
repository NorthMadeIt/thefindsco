-- Mirrors the migration already applied directly to the FINDSCO Supabase
-- project via the Supabase MCP connector. Included here so it's versioned in
-- git and reproducible for a fresh project.

alter table products add column if not exists includes_positions jsonb not null default '[]';

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table posts enable row level security;

create policy "posts_select_published" on posts for select using (published = true or public.is_admin());
create policy "posts_insert_admin" on posts for insert with check (public.is_admin());
create policy "posts_update_admin" on posts for update using (public.is_admin());
create policy "posts_delete_admin" on posts for delete using (public.is_admin());
