import { useEffect, useState } from 'react'
import { listProducts } from '@/services/products'
import type { Product } from '@/types/product'

export function useProducts(opts?: { categorySlug?: string; search?: string; featured?: boolean }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listProducts(opts)
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts?.categorySlug, opts?.search, opts?.featured])

  return { products, loading, error }
}
