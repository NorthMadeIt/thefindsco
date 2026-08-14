export interface Post {
  id: string
  title: string
  slug: string
  body: string | null
  published: boolean
  published_at: string | null
  created_at: string
}

export type PostInput = Omit<Post, 'id' | 'created_at'>
