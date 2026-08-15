import { formatPrice } from '@/lib/currency'

export function CartSummary({ subtotal, shipping = 0 }: { subtotal: number; shipping?: number }) {
  return (
    <div className="space-y-2 border-t border-line pt-4 text-sm">
      <div className="flex justify-between text-ink/70">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-ink/70">
        <span>Shipping</span>
        <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
      </div>
      <div className="flex justify-between text-base font-semibold">
        <span>Total</span>
        <span>{formatPrice(subtotal + shipping)}</span>
      </div>
    </div>
  )
}
