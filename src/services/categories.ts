import { supabase } from '@/lib/supabase'
import type { Category, CategoryInput } from '@/types/category'

export async function listCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) throw error
  return data as unknown as Category[]
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single()
  if (error) throw error
  return data as unknown as Category
}

export async function createCategory(input: CategoryInput) {
  const { data, error } = await supabase.from('categories').insert(input).select().single()
  if (error) throw error
  return data as unknown as Category
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  const { data, error } = await supabase.from('categories').update(input).eq('id', id).select().single()
  if (error) throw error
  return data as unknown as Category
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}
