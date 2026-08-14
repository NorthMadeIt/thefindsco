import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0)
  const list = images?.length ? images : []

  if (!list.length) {
    return (
      <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
        No images
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={list[active]}
            alt={`${name} ${active + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === active ? 'border-gray-900' : 'border-transparent'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
