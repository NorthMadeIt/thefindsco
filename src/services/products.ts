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

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}
