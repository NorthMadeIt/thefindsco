-- Mirrors the hardening migrations already applied directly to the FINDSCO
-- Supabase project via the Supabase MCP connector.

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

drop policy if exists "orders_insert_any" on orders;
create policy "orders_insert_any" on orders
  for insert
  with check (
    user_id is null or user_id = auth.uid()
  );

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

alter function public.is_admin() set search_path = public, pg_temp;
alter function public.handle_new_user() set search_path = public, pg_temp;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.protect_is_admin() from public, anon, authenticated;
revoke execute on function public.validate_order_total() from public, anon, authenticated;
