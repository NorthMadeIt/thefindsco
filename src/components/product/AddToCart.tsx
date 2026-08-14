import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ShoppingBag, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types/product'
import { formatPrice } from '@/lib/currency'
import Button from '@/components/ui/Button'

interface Props {
  product: Product
}

export default function AddToCart({ product }: Props) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.images?.[0] ?? product.image_url ?? null,
      quantity: qty,
      slug: product.slug,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            type="button"
            className="p-2 hover:bg-gray-50"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center font-medium">{qty}</span>
          <button
            type="button"
            className="p-2 hover:bg-gray-50"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-lg font-semibold">{formatPrice(product.price * qty)}</span>
      </div>

      <Button
        className="w-full relative overflow-hidden"
        onClick={handleAdd}
        disabled={added}
      >
        <AnimatePresence mode="wait">
          {added ? (
            <motion.span
              key="check"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> Added
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" /> Add to cart
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </div>
  )
}
