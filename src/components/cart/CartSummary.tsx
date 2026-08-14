import { useCartStore } from '../../store/cartStore'

export default function CartSummary() {
  const { items } = useCartStore()
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="space-y-1 text-sm">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-gray-500">
        <span>Shipping</span>
        <span>Calculated at checkout</span>
      </div>
      <div className="flex justify-between font-semibold text-base pt-1 border-t">
        <span>Total</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
    </div>
  )
}
