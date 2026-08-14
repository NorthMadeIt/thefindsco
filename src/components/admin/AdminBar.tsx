import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function AdminBar() {
  const { user, signOut } = useAuthStore()

  if (!user) return null

  return (
    <div className="bg-gray-900 text-white text-sm px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="font-medium">Admin</span>
        <Link to="/admin" className="hover:underline">Dashboard</Link>
        <Link to="/admin/products" className="hover:underline">Products</Link>
        <Link to="/admin/orders" className="hover:underline">Orders</Link>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-400">{user.email}</span>
        <button onClick={() => signOut()} className="text-red-300 hover:text-red-200">Sign out</button>
      </div>
    </div>
  )
}
