import { useCartStore } from '@/store/cartStore'

export function useCart() {
  const store = useCartStore()
  return {
    ...store,
    subtotal: store.subtotal(),
    count: store.count(),
  }
}
