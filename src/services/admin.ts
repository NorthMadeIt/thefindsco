import { supabase } from '@/lib/supabase'

export async function reseedDemoData() {
  const { data: existingCategory } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'audio')
    .maybeSingle()

  let categoryId = (existingCategory as { id: string } | null)?.id
  if (!categoryId) {
    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert({ name: 'Audio', slug: 'audio' })
      .select('id')
      .single()
    if (error) throw error
    categoryId = (newCategory as { id: string }).id
  }

  const { data: existingProduct } = await supabase
    .from('products')
    .select('id')
    .eq('slug', 'sample-wireless-headphones')
    .maybeSingle()

  if (!existingProduct) {
    const { error } = await supabase.from('products').insert({
      title: 'Sample Wireless Headphones',
      slug: 'sample-wireless-headphones',
      tagline: 'Noise-cancelling, all day comfort',
      description: 'Noise-cancelling over-ear headphones with 30-hour battery life.',
      price: 349,
      compare_at_price: 399,
      category_id: categoryId,
      brand: 'SampleBrand',
      images: ['https://placehold.co/800x800?text=Product'],
      specs: [
        { label: 'Battery', value: '30 hours' },
        { label: 'Bluetooth', value: '5.3' },
        { label: 'Weight', value: '250g' },
      ],
      includes: ['Headphones', 'USB-C cable', 'Carry case'],
      stock: 25,
      in_stock: true,
      sku: 'AUD-001',
      status: 'active',
      featured: true,
    })
    if (error) throw error
  }
}
