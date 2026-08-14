import { useCartStore } from '../../store/cartStore'
import type { CartItem as CartItemType } from '../../store/cartStore'

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="flex gap-3 items-center">
      {item.image_url && (
        <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.name}</p>
        <p className="text-sm text-gray-500">${Number(item.price).toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            className="w-7 h-7 border rounded text-sm"
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
          >−</button>
          <span className="text-sm w-6 text-center">{item.quantity}</span>
          <button
            className="w-7 h-7 border rounded text-sm"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >+</button>
          <button className="text-red-500 text-xs ml-2" onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      </div>
    </div>
  )
}
