import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '@/types/product'
import { formatPrice } from '@/lib/currency'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const image = product.images?.[0] ?? ''

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-3">
          {image ? (
            <img
              src={image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
          )}
        </div>
        <h3 className="font-medium text-gray-900 group-hover:underline line-clamp-2">{product.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{formatPrice(product.price)}</p>
      </Link>
    </motion.div>
  )
}
