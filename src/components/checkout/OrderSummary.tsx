import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/currency'

export default function OrderSummary() {
  const lines = useCartStore((s) => s.lines)
  const subtotal = useCartStore((s) => s.subtotal)()

  return (
    <div className="rounded-xl border border-line bg-paper p-4">
      <h2 className="mb-3 font-semibold">Order summary</h2>
      <ul className="space-y-2 text-sm">
        {lines.map((l) => (
          <li key={l.productId} className="flex justify-between gap-2">
            <span className="truncate">
              {l.name} × {l.quantity}
            </span>
            <span className="shrink-0">{formatPrice(l.price * l.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-between border-t border-line pt-3 font-semibold">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <p className="mt-1 text-xs text-ink/50">Shipping calculated at next step</p>
    </div>
  )
}
