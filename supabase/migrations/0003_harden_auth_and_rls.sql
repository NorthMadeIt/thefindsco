-- Mirrors the hardening migrations already applied directly to the FINDSCO
-- Supabase project via the Supabase MCP connector.

-- 1. Prevent self-promotion to admin. RLS alone can't compare OLD vs NEW
--    column values, so this is enforced with a trigger: any UPDATE to
--    profiles silently keeps is_admin unchanged unless the person making the
--    change is already an admin.
create or replace function public.protect_is_admin()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    new.is_admin := old.is_admin;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_is_admin on profiles;
create trigger profiles_protect_is_admin
  before update on profiles
  for each row execute procedure public.protect_is_admin();

-- 2. Orders: stop identity spoofing and forged totals on insert. Previously
--    `with check (true)` let anyone insert an order with any user_id
--    (impersonating another shopper) and any total_amount (bypassing the
--    app's server-side price check -- RLS is the real enforcement boundary,
--    since the app layer can always be skipped by calling the API directly).
drop policy if exists "orders_insert_any" on orders;
create policy "orders_insert_any" on orders
  for insert
  with check (
    user_id is null or user_id = auth.uid()
  );

-- Recompute total_amount from the order's own items + shipping rule
-- server-side. Mirrors the $8.99 flat / free-over-$100 logic in
-- src/services/orders.ts -- keep both in sync if you change pricing rules.
create or replace function public.validate_order_total()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  computed_subtotal numeric := 0;
  computed_shipping numeric := 0;
  item jsonb;
  product_price numeric;
begin
  for item in select * from jsonb_array_elements(new.items)
  loop
    select price into product_price from products where id = (item->>'product_id')::uuid;
    if product_price is null then
      raise exception 'Order references a product that no longer exists';
    end if;
    computed_subtotal := computed_subtotal + (product_price * (item->>'quantity')::integer);
  end loop;

  computed_shipping := case when computed_subtotal > 100 then 0 else 8.99 end;

  if new.total_amount is distinct from (computed_subtotal + computed_shipping) then
    raise exception 'Order total does not match verified product prices';
  end if;

  return new;
end;
$$;

drop trigger if exists orders_validate_total on orders;
create trigger orders_validate_total
  before insert on orders
  for each row execute procedure public.validate_order_total();

-- 3. Lock down search_path on SECURITY DEFINER functions (prevents
--    search_path hijacking against elevated-privilege functions).
alter function public.is_admin() set search_path = public, pg_temp;
alter function public.handle_new_user() set search_path = public, pg_temp;

-- 4. These three are trigger functions only -- revoke direct callability via
--    PostgREST's /rpc/ endpoint. Doesn't affect trigger firing.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.protect_is_admin() from public, anon, authenticated;
revoke execute on function public.validate_order_total() from public, anon, authenticated;
