import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { getProductBySlug } from '@/services/products'
import { trackEvent } from '@/services/analytics'
import AddToCart from '@/components/product/AddToCart'
import Skeleton from '@/components/ui/Skeleton'
import { formatPrice } from '@/lib/currency'
import type { Product as ProductType } from '@/types/product'

const SITE_URL = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')

export default function Product() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<ProductType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError(false)
    getProductBySlug(slug)
      .then((p) => {
        setProduct(p)
        trackEvent('product_view', { productId: p.id })
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="px-4 py-5 sm:px-6">
        <Skeleton className="aspect-[16/10] w-full sm:aspect-[16/9]" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
        <p className="font-medium">We couldn't find that product.</p>
        <Link to="/shop" className="text-sm text-accent">Back to shop</Link>
      </div>
    )
  }

  const productUrl = `${SITE_URL}/products/${product.slug}`
  const ogImage = product.images?.[0] ?? `${SITE_URL}/og-default.png`

  return (
    <div className="px-4 py-5 pb-24 sm:px-6">
      <Helmet>
        <title>{`${product.title} — Store`}</title>
        <meta name="description" content={product.description ?? product.title} />
        <link rel="canonical" href={productUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description ?? product.title} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={productUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.title} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">No image</div>
          )}
        </div>

        <div>
          {product.brand && <p className="text-xs font-semibold uppercase tracking-wide text-muted">{product.brand}</p>}
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{product.title}</h1>
          {product.tagline && <p className="mt-1 text-sm text-muted">{product.tagline}</p>}

          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-ink/80">{product.description}</p>
          )}

          {product.specs && product.specs.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-3">
              {product.specs.map((spec) => (
                <div key={spec.label}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{spec.label}</p>
                  <p className="mt-1 text-xs text-ink/80">{spec.value}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <span className="text-xl font-semibold">{formatPrice(product.price)}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-sm text-muted line-through">{formatPrice(product.compare_at_price)}</span>
            )}
          </div>

          <div className="mt-4">
            <AddToCart product={product} />
          </div>

          {product.includes && product.includes.length > 0 && (
            <Link
              to={`/products/${product.slug}/includes`}
              className="mt-6 inline-flex w-fit items-center gap-1 border-t border-line pt-4 text-xs font-semibold uppercase tracking-wide text-accent hover:text-accent-dark"
            >
              What&apos;s in the box <ArrowUpRight size={14} />
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  )
}
