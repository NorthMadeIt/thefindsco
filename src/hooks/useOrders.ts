import { useEffect, useState } from 'react'
import { getOrders } from '@/services/orders'
import type { Order } from '@/types/order'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getOrders()
      .then((data) => {
        if (!cancelled) setOrders(data)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { orders, loading, error, setOrders }
}
