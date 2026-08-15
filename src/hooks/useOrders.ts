import { useEffect, useState } from 'react'
import { listMyOrders } from '@/services/orders'

export function useMyOrders(userId: string | null) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    listMyOrders(userId)
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [userId])

  return { orders, loading }
}
