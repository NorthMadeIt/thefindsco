import AdminLayout from '../components/admin/AdminLayout'
import StatsCard from '../components/admin/StatsCard'

export default function Analytics() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Page Views" value="—" />
        <StatsCard title="Unique Visitors" value="—" />
        <StatsCard title="Conversion Rate" value="—" />
        <StatsCard title="Avg. Order Value" value="—" />
      </div>
    </AdminLayout>
  )
}
