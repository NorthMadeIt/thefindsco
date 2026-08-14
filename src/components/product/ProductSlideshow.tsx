import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/types/product'
import { formatPrice } from '@/lib/currency'

interface Props {
  products: Product[]
}

export default function ProductSlideshow({ products }: Props) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  if (!products.length) return null

  const current = products[index]
  const image = current.images?.[0] ?? ''

  const go = (dir: number) => {
    setDirection(dir)
    setIndex((i) => {
      const next = i + dir
      if (next < 0) return products.length - 1
      if (next >= products.length) return 0
      return next
    })
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '40%' : '-40%', scale: 0.92, opacity: 0 }),
    center: { x: 0, scale: 1, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-40%' : '40%', scale: 0.92, opacity: 0 }),
  }

  return (
    <div className="relative w-full h-[70vh] min-h-[420px] max-h-[720px] overflow-hidden bg-gray-900 group">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          {image && <img src={image} alt={current.title} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            <p className="text-sm uppercase tracking-widest opacity-80 mb-1">Featured</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-2">{current.title}</h2>
            <p className="text-lg opacity-90 mb-4">{formatPrice(current.price)}</p>
            <Link
              to={`/products/${current.slug}`}
              className="inline-flex items-center px-5 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-gray-100 transition"
            >
              View product
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
