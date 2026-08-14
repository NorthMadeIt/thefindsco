export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number // decimal dollars, snapshot at time of order
}

export interface Order {
  id: string
  user_id: string | null
  customer_email: string
  status: OrderStatus
  payment_status: PaymentStatus
  total_amount: number
  shipping_address: Record<string, string>
  items: OrderItem[]
  created_at: string
}
