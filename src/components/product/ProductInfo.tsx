import { formatPrice } from '@/lib/currency'
import type { Product } from '@/types/product'
import { Link } from 'react-router-dom'

interface Props {
  product: Product
}

export default function ProductInfo({ product }: Props) {
  const specs = product.specs ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{product.name}</h1>
        <p className="text-xl mt-2 text-gray-800">{formatPrice(product.price)}</p>
      </div>

      {product.description && (
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      )}

      {specs.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Specs
          </h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {specs.map((s, i) => (
              <div key={i} className="contents">
                <dt className="text-gray-500">{s.label}</dt>
                <dd className="font-medium text-gray-900">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {product.includes && product.includes.length > 0 && (
        <div>
          <Link
            to={`/products/${product.slug}/includes`}
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            See what&apos;s included →
          </Link>
        </div>
      )}
    </div>
  )
}
