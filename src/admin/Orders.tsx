import AdminLayout from '../components/admin/AdminLayout'
import OrdersTable from '../components/admin/OrdersTable'

export default function Orders() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <OrdersTable />
    </AdminLayout>
  )
}
