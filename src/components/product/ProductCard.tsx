import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/currency'
import type { Product } from '@/types/product'

export function ProductCard({ product }: { product: Product }) {
  const location = useLocation()
  const onSale = product.compare_at_price && product.compare_at_price > product.price
  return (
    <Link to={`/products/${product.slug}`} state={{ from: location.pathname }} className="block">
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="overflow-hidden rounded-card bg-surface shadow-card"
      >
        <div className="aspect-square overflow-hidden bg-line/40">
          {product.images[0] && (
            <motion.img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
        <div className="p-3">
          <h3 className="line-clamp-1 text-sm font-medium text-ink">{product.title}</h3>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="price-tag">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-xs text-muted line-through">{formatPrice(product.compare_at_price!)}</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
