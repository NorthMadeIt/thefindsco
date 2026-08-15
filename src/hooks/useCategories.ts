import { useEffect, useState } from 'react'
import { listCategories } from '@/services/categories'
import type { Category } from '@/types/category'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  return { categories, loading }
}
