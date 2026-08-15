import { Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { LogOut, Package, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useMyOrders } from '@/hooks/useOrders'
import { formatPrice } from '@/lib/currency'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

export default function Account() {
  const { user, isAdmin, loading, signOut } = useAuth()
  const { orders, loading: ordersLoading } = useMyOrders(user?.id ?? null)

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

      {isAdmin && import.meta.env.VITE_ADMIN_URL && (
        <a
          href={import.meta.env.VITE_ADMIN_URL}
          target="_blank"
          rel="noreferrer"
          className="mb-5 flex items-center gap-2 rounded-card bg-ink px-4 py-3 text-sm font-medium text-paper"
        >
          <ShieldCheck size={18} /> Open admin dashboard
        </a>
      )}

      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Package size={16} /> Order history
      </h2>
      {ordersLoading ? (
        <Skeleton className="h-16 w-full" />
      ) : orders.length === 0 ? (
        <p className="text-sm text-muted">No orders yet.</p>
      ) : (
        <div className="divide-y divide-line rounded-card border border-line">
          {orders.map((o: any) => (
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

      <Button variant="outline" onClick={signOut} className="mt-6 w-full">
        <LogOut size={16} /> Log out
      </Button>
    </div>
  )
}
