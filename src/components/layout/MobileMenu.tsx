import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { Category } from '@/types/category'

export function MobileMenu({
  open,
  onClose,
  categories,
}: {
  open: boolean
  onClose: () => void
  categories: Category[]
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-y-0 left-0 z-50 w-72 bg-surface p-5"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <button onClick={onClose} className="mb-6 rounded-full p-1 hover:bg-ink/5">
              <X size={20} />
            </button>
            <nav className="flex flex-col gap-3">
              {categories.map((c) => (
                <Link key={c.id} to={`/category/${c.slug}`} onClick={onClose} className="text-base font-medium">
                  {c.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
