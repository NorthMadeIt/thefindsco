import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { getProductBySlug } from '@/services/products'
import { trackEvent } from '@/services/analytics'
import { AddToCart } from '@/components/product/AddToCart'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatPrice } from '@/lib/currency'
import type { Product as ProductType } from '@/types/product'

const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin

export default function Product() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const location = useLocation()
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
  const ogImage = product.images[0] ?? `${SITE_URL}/og-default.png`

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
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="USD" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.title} />
        <meta name="twitter:description" content={`${formatPrice(product.price)} — ${product.title}`} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="relative overflow-hidden rounded-card bg-surface shadow-card"
      >
        <button
          onClick={() => navigate((location.state as { from?: string } | null)?.from ?? '/')}
          className="absolute right-5 top-5 z-10 flex items-center gap-1 rounded-full border border-line bg-surface/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide backdrop-blur hover:bg-ink/5"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="flex items-center justify-center bg-gradient-to-br from-accent-light to-paper p-8 sm:aspect-square">
            <img
              src={product.images[0] ?? 'https://placehold.co/800x800?text=Product'}
              alt={product.title}
              className="max-h-80 w-full object-contain"
            />
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            {product.brand && (
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">{product.brand}</p>
            )}
            <h1 className="mt-1 font-display text-2xl font-semibold">{product.title}</h1>
            {product.description && (
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{product.description}</p>
            )}

            {product.specs.length > 0 && (
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
              <span className="price-tag text-base">{formatPrice(product.price)}</span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-sm text-muted line-through">{formatPrice(product.compare_at_price)}</span>
              )}
            </div>

            <div className="mt-4">
              <AddToCart product={product} />
            </div>

            {product.includes.length > 0 && (
              <Link
                to={`/products/${product.slug}/includes`}
                state={{ from: location.pathname }}
                className="mt-6 inline-flex w-fit items-center gap-1 border-t border-line pt-4 text-xs font-semibold uppercase tracking-wide text-accent hover:text-accent-dark"
              >
                What's in the box <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
