import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types/product'

export interface CartLine {
  productId: string
  slug: string
  name: string
  price: number // cents, snapshot when added
  image: string | null
  quantity: number
}

interface CartState {
  lines: CartLine[]
  isOpen: boolean
  open: () => void
  close: () => void
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clear: () => void
  subtotal: () => number
  count: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === product.id)
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === product.id ? { ...l, quantity: l.quantity + quantity } : l,
              ),
              isOpen: true,
            }
          }
          return {
            lines: [
              ...state.lines,
              {
                productId: product.id,
                slug: product.slug,
                name: product.title,
                price: product.price,
                image: product.images[0] ?? null,
                quantity,
              },
            ],
            isOpen: true,
          }
        }),
      removeItem: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.productId === productId ? { ...l, quantity } : l))
            .filter((l) => l.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
      count: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: 'store-cart' },
  ),
)
