import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { getProductBySlug } from '@/services/products'
import { formatPrice } from '@/lib/currency'
import Skeleton from '@/components/ui/Skeleton'
import type { Product as ProductType } from '@/types/product'

export default function ProductIncludes() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<ProductType | null>(null)
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    if (!slug) return
    getProductBySlug(slug)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="px-4 py-5">
        <Skeleton className="aspect-video w-full" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="px-4 py-16 text-center">
        <p>Product not found.</p>
        <Link to="/shop" className="text-accent">Back to shop</Link>
      </div>
    )
  }

  const positions = product.includes_positions ?? []

  return (
    <div className="px-4 py-5 pb-24 sm:px-6">
      <Helmet>
        <title>{`What's included — ${product.title}`}</title>
      </Helmet>

      <Link to={`/products/${product.slug}`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft size={16} /> Back to product
      </Link>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-2xl border border-line">
        <div className="grid lg:grid-cols-2">
          <div className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">What's included</p>
            <h1 className="mt-1 text-xl font-bold">{product.title}</h1>
            <ol className="mt-6 space-y-3">
              {(product.includes ?? []).map((item, i) => (
                <li
                  key={item}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className="flex items-center gap-3 text-sm"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium ${
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
              <span className="text-base font-semibold">{formatPrice(product.price)}</span>
              <Link
                to={`/products/${product.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-accent"
              >
                Buy now <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center bg-gray-50 p-8">
            <img
              src={product.images?.[0] ?? 'https://placehold.co/800x800?text=Product'}
              alt={product.title}
              className="max-h-80 w-full object-contain"
            />
            {(product.includes ?? []).map((item, i) => (
              <div
                key={item}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                style={{
                  left: `${positions[i]?.x ?? 50}%`,
                  top: `${positions[i]?.y ?? 50}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  className={`flex h-7 w-7 cursor-default items-center justify-center rounded-full border text-xs font-medium shadow ${
                    active === i ? 'border-accent bg-accent text-white' : 'border-line bg-white text-ink'
                  }`}
                >
                  {i + 1}
                </div>
                {active === i && (
                  <span className="absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-paper">
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
