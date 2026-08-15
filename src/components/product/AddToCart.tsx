import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'
import { trackEvent } from '@/services/analytics'
import type { Product } from '@/types/product'

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product, qty)
    trackEvent('add_to_cart', { productId: product.id })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-full border border-line">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="p-2.5 disabled:opacity-40"
          disabled={qty <= 1}
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="w-6 text-center text-sm font-medium">{qty}</span>
        <button
          onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
          className="p-2.5 disabled:opacity-40"
          disabled={qty >= product.stock}
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
      <Button
        onClick={handleAdd}
        disabled={product.stock === 0 || !product.in_stock}
        variant="secondary"
        size="lg"
        className="flex-1"
      >
        <AnimatePresence mode="wait" initial={false}>
          {added ? (
            <motion.span
              key="added"
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <Check size={18} /> Added
            </motion.span>
          ) : (
            <motion.span key="add" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              {product.stock === 0 || !product.in_stock ? 'Out of stock' : 'Add to cart'}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </div>
  )
}
