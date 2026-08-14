-- Sample data to sanity-check the storefront. Safe to delete once you add real products.
insert into categories (name, slug) values
  ('Earbuds', 'earbuds'),
  ('Headphones', 'headphones'),
  ('Accessories', 'accessories')
on conflict (slug) do nothing;

insert into products (
  title, slug, tagline, brand, price, compare_at_price, category_id, images, specs, includes, description, in_stock, stock, sku, status, featured
)
select
  'Sample Wireless Headphones',
  'sample-wireless-headphones',
  'Noise-cancelling, all day comfort',
  'SampleBrand',
  349,
  399,
  c.id,
  array['https://placehold.co/800x800?text=Product'],
  '[{"label":"Battery","value":"30 hours"},{"label":"Bluetooth","value":"5.3"},{"label":"Weight","value":"250g"}]'::jsonb,
  array['Headphones', 'USB-C cable', 'Carry case'],
  'Noise-cancelling over-ear headphones with 30-hour battery life.',
  true,
  25,
  'AUD-001',
  'active',
  true
from categories c
where c.slug = 'headphones'
on conflict (slug) do nothing;
