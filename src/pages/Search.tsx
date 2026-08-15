import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Search as SearchIcon } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/product/ProductGrid'

export default function Search() {
  const [term, setTerm] = useState('')
  const { products, loading } = useProducts({ search: term || undefined })

  return (
    <div className="px-4 py-5">
      <Helmet>
        <title>Search — Store</title>
      </Helmet>
      <div className="mb-4 flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5">
        <SearchIcon size={18} className="text-muted" />
        <input
          autoFocus
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
      {term ? <ProductGrid products={products} loading={loading} /> : (
        <p className="py-10 text-center text-sm text-muted">Start typing to search the catalog.</p>
      )}
    </div>
  )
}
