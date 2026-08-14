import { Helmet } from 'react-helmet-async'
import { useProducts } from '@/hooks/useProducts'
import ProductGrid from '@/components/product/ProductGrid'

export default function Shop() {
  const { products, loading } = useProducts()

  return (
    <div className="px-4 py-5">
      <Helmet>
        <title>Shop all — Store</title>
      </Helmet>
      <h1 className="mb-4 text-xl font-semibold">Shop all</h1>
      <ProductGrid products={products} loading={loading} />
    </div>
  )
}
