import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'

interface Props {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: Props) {
  const { categories } = useCategories()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-72 bg-paper p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-display text-lg font-semibold">Menu</span>
          <button onClick={onClose} aria-label="Close menu" className="rounded-full p-1 hover:bg-ink/5">
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          <Link to="/" onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink/5">
            Home
          </Link>
          <Link to="/shop" onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink/5">
            Shop
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.slug}`}
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink/5"
            >
              {c.name}
            </Link>
          ))}
          <Link to="/about" onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink/5">
            About
          </Link>
        </nav>
      </div>
    </div>
  )
}
