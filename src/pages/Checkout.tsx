import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import OrderSummary from '@/components/checkout/OrderSummary'
import { Payment } from '@/components/checkout/Payment'
import { createOrder } from '@/services/orders'
import { trackEvent } from '@/services/analytics'
import type { CheckoutFormValues } from '@/lib/validation'

export default function Checkout() {
  const { items, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(values: CheckoutFormValues) {
    setSubmitting(true)
    setError(null)
    trackEvent('checkout_start')
    try {
      const order = await createOrder(items, values, user?.id ?? null)
      trackEvent('purchase')
      clear()
      navigate(`/order-success?order=${order.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong placing your order.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return <p className="px-4 py-16 text-center text-muted">Your cart is empty.</p>
  }

  return (
    <div className="px-4 py-5 pb-10">
      <Helmet>
        <title>Checkout — Store</title>
      </Helmet>
      <h1 className="mb-4 text-xl font-semibold">Checkout</h1>
      <div className="mb-5">
        <OrderSummary />
      </div>
      <div className="mb-5">
        <Payment />
      </div>
      {error && <p className="mb-3 text-sm text-ember">{error}</p>}
      <CheckoutForm onSubmit={handleSubmit} loading={submitting} />
    </div>
  )
}
