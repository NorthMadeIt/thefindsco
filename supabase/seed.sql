-- Sample data to sanity-check the storefront. Safe to delete once you add real products.
insert into categories (name, slug) values
  ('Earbuds', 'earbuds'),
  ('Headphones', 'headphones'),
  ('Accessories', 'accessories')
on conflict (slug) do nothing;

insert into products (
  title, slug, tagline, description, price, compare_at_price, category_id, brand,
  images, specs, includes, includes_positions, stock, in_stock, sku, status, featured
)
select
  'EvoBuds M5',
  'evobuds-m5',
  'Logitech EvoBuds M5 use a completely wire-free design.',
  'Small as these earphones are, they pack a sound you''ll have to hear to believe. Crafted for a supremely comfortable fit and specially designed for travelling.',
  229.95, null,
  (select id from categories where slug = 'earbuds'),
  'Logi',
  array['https://placehold.co/800x800?text=EvoBuds+M5'],
  '[{"label":"Bluetooth Version","value":"Bluetooth 5.0 compliant, Class 1"},{"label":"Battery Specification","value":"Built-in Lithium rechargeable battery"},{"label":"Power Supply","value":"5V 650mA USB charging via USB-C socket"}]'::jsonb,
  array['EvoBuds M5', 'EvoCase', 'USB-C to USB-A Cable'],
  '[{"x":25,"y":75},{"x":60,"y":50},{"x":85,"y":25}]'::jsonb,
  25, true,
  'EAR-001',
  'active',
  true
where not exists (select 1 from products where slug = 'evobuds-m5');
