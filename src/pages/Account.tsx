import { Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { LogOut, Package, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import { formatPrice } from '@/lib/currency'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

export default function Account() {
  const { user, isAdmin, loading, signOut } = useAuth()
  const { orders, loading: ordersLoading } = useOrders()

  if (loading) {
    return (
      <div className="px-4 py-5">
        <Skeleton className="h-6 w-1/2" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="px-4 py-5">
      <Helmet>
        <title>Your account — Store</title>
      </Helmet>
      <h1 className="mb-1 text-xl font-semibold">Your account</h1>
      <p className="mb-5 text-sm text-muted">{user.email}</p>

      {isAdmin && (
        <Link to="/admin" className="mb-5 flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-medium text-paper">
          <ShieldCheck size={18} /> Open admin dashboard
        </Link>
      )}

      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Package size={16} /> Order history
      </h2>
      {ordersLoading ? (
        <Skeleton className="h-16 w-full" />
      ) : orders.length === 0 ? (
        <p className="text-sm text-muted">No orders yet.</p>
      ) : (
        <div className="divide-y divide-line rounded-lg border border-line">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between p-3 text-sm">
              <div>
                <p className="font-medium">#{o.id.slice(0, 8)}</p>
                <p className="text-muted capitalize">{o.status}</p>
              </div>
              <span className="font-semibold">{formatPrice(o.total_amount)}</span>
            </div>
          ))}
        </div>
      )}

      <Button variant="secondary" onClick={signOut} className="mt-6 w-full">
        <LogOut size={16} className="mr-2" /> Log out
      </Button>
    </div>
  )
}
