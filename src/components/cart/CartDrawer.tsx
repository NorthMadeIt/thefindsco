import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { Button } from '@/components/ui/Button'

export function CartDrawer() {
  const { isOpen, close, lines, subtotal } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-surface p-5"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.22 }}
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your cart</h2>
              <button onClick={close} aria-label="Close cart" className="rounded-full p-1 hover:bg-ink/5">
                <X size={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted">
                <p>Your cart is empty.</p>
                <Button variant="outline" onClick={close}>
                  <Link to="/shop">Continue shopping</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y divide-line overflow-y-auto">
                  {lines.map((line) => (
                    <CartItem key={line.productId} line={line} />
                  ))}
                </div>
                <CartSummary subtotal={subtotal} />
                <Link to="/checkout" onClick={close}>
                  <Button variant="secondary" size="lg" className="mt-4 w-full">
                    Checkout
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
