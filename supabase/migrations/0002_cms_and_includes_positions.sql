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

drop policy if exists "posts_public_read_published" on posts;
create policy "posts_public_read_published" on posts
  for select using (published = true or public.is_admin());

drop policy if exists "posts_admin_write" on posts;
create policy "posts_admin_write" on posts
  for all using (public.is_admin()) with check (public.is_admin());
