import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import ProductSlideshow from '@/components/product/ProductSlideshow'
import ProductGrid from '@/components/product/ProductGrid'
import Skeleton from '@/components/ui/Skeleton'

export default function Home() {
  const { products, loading } = useProducts()
  const { categories, loading: catsLoading } = useCategories()

  return (
    <div className="px-4 py-5 sm:px-6">
      <Helmet>
        <title>Store — Shop the latest</title>
      </Helmet>

      <ProductSlideshow products={products} />

      {categories.length > 0 && (
        <section className="mt-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {catsLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-full" />)
              : categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/category/${c.slug}`}
                    className="shrink-0 rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium hover:bg-gray-50"
                  >
                    {c.name}
                  </Link>
                ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <h2 className="mb-3 text-base font-semibold">All products</h2>
        <ProductGrid products={products} loading={loading} />
      </section>
    </div>
  )
}
