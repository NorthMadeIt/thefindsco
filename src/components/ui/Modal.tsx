import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
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
            className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 rounded-card bg-surface p-5 shadow-card sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-sm sm:-translate-x-1/2"
            initial={{ opacity: 0, scale: 0.96, y: '-45%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.96, y: '-45%' }}
            transition={{ duration: 0.18 }}
          >
            <div className="mb-3 flex items-center justify-between">
              {title && <h3 className="text-lg font-semibold">{title}</h3>}
              <button onClick={onClose} aria-label="Close" className="ml-auto rounded-full p-1 hover:bg-ink/5">
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
