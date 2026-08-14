import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import Button from '../ui/Button'

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lines = useCartStore((s) => s.lines)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Cart ({lines.length})</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {lines.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your cart is empty</p>
          ) : (
            lines.map((line) => (
              <CartItem
                key={line.productId}
                item={{
                  id: line.productId,
                  name: line.name,
                  price: line.price,
                  image_url: line.image,
                  quantity: line.quantity,
                } as any}
              />
            ))
          )}
        </div>
        {lines.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <CartSummary />
            <Link to="/checkout" onClick={onClose}>
              <Button className="w-full">Checkout</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
