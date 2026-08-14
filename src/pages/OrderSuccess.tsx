import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function OrderSuccess() {
  const [params] = useSearchParams()
  const orderId = params.get('order')

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-20 text-center">
      <Helmet>
        <title>Order confirmed — Store</title>
      </Helmet>
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <CheckCircle2 size={48} className="text-green-600" />
      </motion.div>
      <h1 className="text-xl font-semibold">Order confirmed</h1>
      <p className="max-w-xs text-sm text-gray-500">
        Thanks for your order{orderId ? ` #${orderId.slice(0, 8)}` : ''}. We'll email you when it ships.
      </p>
      <Link to="/shop">
        <Button variant="secondary" className="mt-3">Continue shopping</Button>
      </Link>
    </div>
  )
}
