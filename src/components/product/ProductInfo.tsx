import { formatPrice } from '@/lib/currency'
import type { Product } from '@/types/product'

export function ProductInfo({ product }: { product: Product }) {
  const onSale = product.compare_at_price && product.compare_at_price > product.price
  return (
    <div>
      {product.brand && <p className="text-xs font-medium uppercase tracking-wide text-accent">{product.brand}</p>}
      <h1 className="mt-1 text-xl font-semibold">{product.title}</h1>
      {product.tagline && <p className="mt-0.5 text-sm text-muted">{product.tagline}</p>}
      <div className="mt-2 flex items-center gap-2">
        <span className="price-tag text-base">{formatPrice(product.price)}</span>
        {onSale && <span className="text-sm text-muted line-through">{formatPrice(product.compare_at_price!)}</span>}
      </div>
      {product.stock <= 5 && product.stock > 0 && (
        <p className="mt-2 text-xs font-medium text-ember">Only {product.stock} left in stock</p>
      )}
      {(product.stock === 0 || !product.in_stock) && (
        <p className="mt-2 text-xs font-medium text-ember">Out of stock</p>
      )}
      {product.description && <p className="mt-4 text-sm leading-relaxed text-ink/80">{product.description}</p>}
      {Array.isArray(product.includes) && product.includes.length > 0 && (
        <div className="mt-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">In the box</p>
          <ul className="list-inside list-disc text-sm text-ink/80">
            {product.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
