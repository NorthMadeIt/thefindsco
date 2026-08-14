import { useProducts } from '@/hooks/useProducts'
import ProductGrid from './ProductGrid'

interface Props {
  excludeId?: string
  categoryId?: string | null
  limit?: number
}

export default function RelatedProducts({ excludeId, categoryId, limit = 4 }: Props) {
  const { products, loading } = useProducts({ categoryId, limit: limit + 1 })
  const filtered = products.filter((p) => p.id !== excludeId).slice(0, limit)

  if (!loading && !filtered.length) return null

  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold mb-6">You may also like</h2>
      <ProductGrid products={filtered} loading={loading} />
    </section>
  )
}
