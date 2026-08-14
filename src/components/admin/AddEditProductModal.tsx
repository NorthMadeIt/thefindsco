import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import type { Product } from '../../types/product'

interface Props {
  open: boolean
  onClose: () => void
  product?: Product | null
  onSave: (data: Partial<Product>) => Promise<void>
}

export default function AddEditProductModal({ open, onClose, product, onSave }: Props) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    stock: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: String(product.price ?? ''),
        category_id: product.category_id || '',
        image_url: product.image_url || '',
        stock: String(product.stock ?? ''),
      })
    } else {
      setForm({ name: '', description: '', price: '', category_id: '', image_url: '', stock: '' })
    }
  }, [product, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price) || 0,
        category_id: form.category_id || null,
        image_url: form.image_url || null,
        stock: parseInt(form.stock, 10) || 0,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={product ? 'Edit Product' : 'Add Product'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Input label="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <Input label="Category ID" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} />
        <Input label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </div>
      </form>
    </Modal>
  )
}
