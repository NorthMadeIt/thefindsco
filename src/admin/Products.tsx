import AdminLayout from '../components/admin/AdminLayout'
import ProductManager from '../components/admin/ProductManager'

export default function Products() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <ProductManager />
    </AdminLayout>
  )
}
