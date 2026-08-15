import { supabase } from '@/lib/supabase'
import { getCategoryBySlug } from '@/services/categories'
import type { Product, ProductInput } from '@/types/product'

export async function listProducts(opts?: { categorySlug?: string; search?: string; featured?: boolean }) {
  let query = supabase.from('products').select('*').eq('status', 'active')

  if (opts?.categorySlug) {
    const category = await getCategoryBySlug(opts.categorySlug)
    query = query.eq('category_id', category.id)
  }
  if (opts?.search) {
    query = query.ilike('title', `%${opts.search}%`)
  }
  if (opts?.featured) {
    query = query.eq('featured', true)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as Product[]
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single()
  if (error) throw error
  return data as unknown as Product
}

// Admin-only writes; enforced server-side by RLS (public.is_admin()).
export async function createProduct(input: ProductInput) {
  const { data, error } = await supabase.from('products').insert(input).select().single()
  if (error) throw error
  return data as unknown as Product
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const { data, error } = await supabase.from('products').update(input).eq('id', id).select().single()
  if (error) throw error
  return data as unknown as Product
}

// Uploads a product photo to the public `product-images` Storage bucket
// (admin-only write, enforced by RLS on storage.objects) and returns its
// public URL, ready to drop straight into a product's `images` array.
export async function uploadProductImage(file: File) {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('product-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}
