import { formatPrice } from '@/lib/currency'
import type { CartLine } from '@/store/cartStore'
import { CartSummary } from '@/components/cart/CartSummary'

export function OrderSummary({ lines, subtotal }: { lines: CartLine[]; subtotal: number }) {
  const shipping = subtotal > 100 ? 0 : 8.99
  return (
    <div className="rounded-card bg-surface p-4 shadow-card">
      <h2 className="mb-3 text-sm font-semibold">Order summary</h2>
      <div className="space-y-2">
        {lines.map((l) => (
          <div key={l.productId} className="flex justify-between text-sm">
            <span className="text-ink/70">
              {l.name} × {l.quantity}
            </span>
            <span>{formatPrice(l.price * l.quantity)}</span>
          </div>
        ))}
      </div>
      <CartSummary subtotal={subtotal} shipping={shipping} />
    </div>
  )
}
