import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCart } from '@/hooks/useCart'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import Button from '@/components/ui/Button'

export default function Cart() {
  const { lines } = useCart()

  return (
    <div className="px-4 py-5 pb-24">
      <Helmet>
        <title>Your cart — Store</title>
      </Helmet>
      <h1 className="mb-4 text-xl font-semibold">Your cart</h1>

      {lines.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-500">
          <p>Your cart is empty.</p>
          <Link to="/shop">
            <Button variant="secondary">Continue shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {lines.map((line) => (
              <div key={line.productId} className="py-3">
                <CartItem item={{
                  id: line.productId,
                  name: line.name,
                  price: line.price,
                  image_url: line.image,
                  quantity: line.quantity,
                } as any} />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <CartSummary />
          </div>
          <Link to="/checkout">
            <Button className="mt-5 w-full" size="lg">
              Checkout
            </Button>
          </Link>
        </>
      )}
    </div>
  )
}
