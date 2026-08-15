import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/currency'
import { useCart } from '@/hooks/useCart'
import type { CartLine } from '@/store/cartStore'

export function CartItem({ line }: { line: CartLine }) {
  const { setQuantity, removeItem } = useCart()

  return (
    <div className="flex gap-3 py-3">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-line/40">
        {line.image && <img src={line.image} alt={line.name} className="h-full w-full object-cover" />}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug">{line.name}</p>
          <button onClick={() => removeItem(line.productId)} aria-label="Remove item" className="text-muted hover:text-ember">
            <Trash2 size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-full border border-line">
            <button
              onClick={() => setQuantity(line.productId, line.quantity - 1)}
              className="p-1.5"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-5 text-center text-xs font-medium">{line.quantity}</span>
            <button
              onClick={() => setQuantity(line.productId, line.quantity + 1)}
              className="p-1.5"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="text-sm font-semibold">{formatPrice(line.price * line.quantity)}</span>
        </div>
      </div>
    </div>
  )
}
