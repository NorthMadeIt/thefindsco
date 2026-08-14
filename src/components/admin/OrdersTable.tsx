import { useEffect, useState } from 'react'
import { getOrders } from '../../services/orders'
import type { Order } from '../../types/order'

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-500">Loading orders…</p>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="py-2 pr-4">ID</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Total</th>
            <th className="py-2 pr-4">Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b">
              <td className="py-2 pr-4 font-mono text-xs">{o.id.slice(0, 8)}…</td>
              <td className="py-2 pr-4">{o.status}</td>
              <td className="py-2 pr-4">${Number(o.total).toFixed(2)}</td>
              <td className="py-2 pr-4">{o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p className="text-gray-500 py-4">No orders yet.</p>}
    </div>
  )
}
