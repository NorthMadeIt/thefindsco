import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from './ProductGrid'
import type { Product } from '@/types/product'

export function RelatedProducts({ current }: { current: Product }) {
  const { products, loading } = useProducts({ categorySlug: undefined })
  const related = products.filter((p) => p.id !== current.id).slice(0, 4)

  if (!loading && related.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-base font-semibold">You might also like</h2>
      <ProductGrid products={related} loading={loading} />
    </div>
  )
}
