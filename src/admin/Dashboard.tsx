import AdminLayout from '../components/admin/AdminLayout'
import StatsCard from '../components/admin/StatsCard'

export default function Dashboard() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Orders" value="—" />
        <StatsCard title="Revenue" value="—" />
        <StatsCard title="Products" value="—" />
        <StatsCard title="Customers" value="—" />
      </div>
    </AdminLayout>
  )
}
