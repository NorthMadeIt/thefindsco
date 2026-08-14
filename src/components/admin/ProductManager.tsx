import { useEffect, useState } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/products'
import type { Product } from '../../types/product'
import Button from '../ui/Button'
import AddEditProductModal from './AddEditProductModal'

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const load = () => {
    setLoading(true)
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSave = async (data: Partial<Product>) => {
    if (editing) {
      await updateProduct(editing.id, data)
    } else {
      await createProduct(data)
    }
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await deleteProduct(id)
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">{products.length} products</p>
        <Button onClick={() => { setEditing(null); setModalOpen(true) }}>Add Product</Button>
      </div>
      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Stock</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-2 pr-4">{p.name}</td>
                  <td className="py-2 pr-4">${Number(p.price).toFixed(2)}</td>
                  <td className="py-2 pr-4">{p.stock}</td>
                  <td className="py-2 pr-4 space-x-2">
                    <button className="text-blue-600 hover:underline" onClick={() => { setEditing(p); setModalOpen(true) }}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AddEditProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editing}
        onSave={handleSave}
      />
    </div>
  )
}
