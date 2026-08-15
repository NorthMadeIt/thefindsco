import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { getProductBySlug } from '@/services/products'
import { formatPrice } from '@/lib/currency'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/types/product'

function fallbackPositions(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    x: 20 + (i * 60) / Math.max(count - 1, 1),
    y: 50,
  }))
}

export default function ProductIncludes() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getProductBySlug(slug)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="px-4 py-5 sm:px-6">
        <Skeleton className="aspect-[16/10] w-full sm:aspect-[16/9]" />
      </div>
    )
  }

  if (!product || product.includes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
        <p className="font-medium">Nothing to show here yet.</p>
        <Link to="/shop" className="text-sm text-accent">Back to shop</Link>
      </div>
    )
  }

  const positions =
    product.includes_positions.length === product.includes.length
      ? product.includes_positions
      : fallbackPositions(product.includes.length)

  return (
    <div className="px-4 py-5 pb-10 sm:px-6">
      <Helmet>
        <title>{`What's included — ${product.title}`}</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="relative overflow-hidden rounded-card bg-surface shadow-card"
      >
        <button
          onClick={() => navigate(`/products/${slug}`)}
          className="absolute right-5 top-5 z-10 flex items-center gap-1 rounded-full border border-line bg-surface/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide backdrop-blur hover:bg-ink/5"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <h1 className="text-xl font-semibold">Set includes:</h1>
            <ol className="mt-5 space-y-4">
              {product.includes.map((item, i) => (
                <li
                  key={item}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className="flex gap-3 text-sm"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium transition-colors ${
                      active === i ? 'border-accent bg-accent text-white' : 'border-line text-muted'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
              <span className="price-tag text-base">{formatPrice(product.price)}</span>
              <Link
                to={`/products/${product.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-accent hover:text-accent-dark"
              >
                Buy now <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center bg-gradient-to-br from-accent-light to-paper p-8 sm:aspect-square">
            <img
              src={product.images[0] ?? 'https://placehold.co/800x800?text=Product'}
              alt={product.title}
              className="max-h-80 w-full object-contain"
            />
            {product.includes.map((item, i) => (
              <div
                key={item}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                style={{ left: `${positions[i]?.x ?? 50}%`, top: `${positions[i]?.y ?? 50}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  className={`flex h-7 w-7 cursor-default items-center justify-center rounded-full border text-xs font-medium shadow-card transition-colors ${
                    active === i ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-ink'
                  }`}
                >
                  {i + 1}
                </div>
                {active === i && (
                  <span className="absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-paper shadow-card">
                    {item}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
