import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useProducts } from '@/hooks/useProducts'
import ProductGrid from '@/components/product/ProductGrid'

export default function Category() {
  const { slug } = useParams<{ slug: string }>()
  const { products, loading } = useProducts({ categorySlug: slug })

  return (
    <div className="px-4 py-5">
      <Helmet>
        <title>{slug} — Store</title>
      </Helmet>
      <h1 className="mb-4 text-xl font-semibold capitalize">{slug?.replace(/-/g, ' ')}</h1>
      <ProductGrid products={products} loading={loading} />
    </div>
  )
}
