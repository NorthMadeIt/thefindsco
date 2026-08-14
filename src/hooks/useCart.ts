import { useCartStore } from '@/store/cartStore'

export function useCart() {
  const lines = useCartStore((s) => s.lines)
  const isOpen = useCartStore((s) => s.isOpen)
  const open = useCartStore((s) => s.open)
  const close = useCartStore((s) => s.close)
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const clear = useCartStore((s) => s.clear)
  const subtotal = useCartStore((s) => s.subtotal)()
  const count = useCartStore((s) => s.count)()

  return {
    lines,
    items: lines,
    isOpen,
    open,
    close,
    addItem,
    removeItem,
    setQuantity,
    updateQuantity: setQuantity,
    clear,
    subtotal,
    total: subtotal,
    count,
  }
}
