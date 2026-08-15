import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/types/product'

const imageVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '60%' : '-60%',
    scale: 0.75,
    opacity: 0,
  }),
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-60%' : '60%',
    scale: 0.75,
    opacity: 0,
  }),
}

const textVariants: Variants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

export function ProductSlideshow({ products, loading }: { products: Product[]; loading?: boolean }) {
  const location = useLocation()
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0])

  if (loading) {
    return <Skeleton className="aspect-[16/10] w-full sm:aspect-[16/9]" />
  }

  if (products.length === 0) {
    return (
      <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-1 rounded-card bg-surface text-center text-muted sm:aspect-[16/9]">
        <p className="font-medium text-ink">No products yet</p>
        <p className="text-sm">Add your first product from the admin bar.</p>
      </div>
    )
  }

  const safeIndex = ((index % products.length) + products.length) % products.length
  const product = products[safeIndex]

  function go(dir: number) {
    setIndex(([i]) => [i + dir, dir])
  }

  return (
    <div
      className="group relative aspect-[16/10] w-full overflow-hidden rounded-card bg-surface shadow-card sm:aspect-[16/9]"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
      tabIndex={0}
    >
      <div className="grid h-full grid-cols-1 sm:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-center gap-3 p-6 sm:p-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={product.id}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {product.brand && (
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">{product.brand}</p>
              )}
              <h1 className="mt-1 font-display text-2xl font-semibold leading-tight sm:text-3xl">
                {product.title}
              </h1>
              {product.tagline && <p className="mt-2 text-sm text-ink/70 sm:text-base">{product.tagline}</p>}
              <Link
                to={`/products/${product.slug}`}
                state={{ from: location.pathname }}
                className="mt-4 inline-flex w-fit items-center gap-1 text-xs font-semibold uppercase tracking-wide text-accent hover:text-accent-dark"
              >
                Explore product <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          </AnimatePresence>

          <span className="absolute bottom-5 left-6 font-mono text-xs text-muted sm:left-10">
            {String(safeIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
          </span>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-accent-light to-paper">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={product.id}
              src={product.images[0] ?? 'https://placehold.co/800x800?text=Product'}
              alt={product.title}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-contain p-8"
            />
          </AnimatePresence>

          {products.length > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                aria-label="Previous product"
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-line bg-surface/80 p-2 opacity-0 backdrop-blur transition-opacity duration-200 hover:bg-surface group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next product"
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-line bg-surface/80 p-2 opacity-0 backdrop-blur transition-opacity duration-200 hover:bg-surface group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
