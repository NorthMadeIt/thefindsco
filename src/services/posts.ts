import { supabase } from '@/lib/supabase'
import type { Post, PostInput } from '@/types/post'

export async function listPosts() {
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as Post[]
}

export async function listPublishedPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
  if (error) throw error
  return data as unknown as Post[]
}

export async function createPost(input: PostInput) {
  const { data, error } = await supabase.from('posts').insert(input).select().single()
  if (error) throw error
  return data as unknown as Post
}

export async function updatePost(id: string, input: Partial<PostInput>) {
  const { data, error } = await supabase.from('posts').update(input).eq('id', id).select().single()
  if (error) throw error
  return data as unknown as Post
}

export async function deletePost(id: string) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}

export async function togglePublish(post: Post) {
  return updatePost(post.id, {
    published: !post.published,
    published_at: !post.published ? new Date().toISOString() : post.published_at,
  })
}
