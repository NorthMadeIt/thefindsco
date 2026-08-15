import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCart } from '@/hooks/useCart'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { Button } from '@/components/ui/Button'

export default function Cart() {
  const { lines, subtotal } = useCart()

  return (
    <div className="px-4 py-5 pb-24">
      <Helmet>
        <title>Your cart — Store</title>
      </Helmet>
      <h1 className="mb-4 text-xl font-semibold">Your cart</h1>

      {lines.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted">
          <p>Your cart is empty.</p>
          <Link to="/shop">
            <Button variant="outline">Continue shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y divide-line">
            {lines.map((line) => (
              <CartItem key={line.productId} line={line} />
            ))}
          </div>
          <div className="mt-4">
            <CartSummary subtotal={subtotal} />
          </div>
          <Link to="/checkout">
            <Button variant="secondary" size="lg" className="mt-5 w-full">
              Checkout
            </Button>
          </Link>
        </>
      )}
    </div>
  )
}
