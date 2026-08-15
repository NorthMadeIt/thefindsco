import { supabase } from '@/lib/supabase'
import type { CartLine } from '@/store/cartStore'
import type { CheckoutFormValues } from '@/lib/validation'
import type { OrderItem } from '@/types/order'

// Creates an order. Prices are re-fetched from the products table server-side
// before insert, so a tampered client-side cart total can never be trusted --
// always re-verify price here rather than trusting CartLine.price directly.
export async function createOrder(lines: CartLine[], form: CheckoutFormValues, userId: string | null) {
  const productIds = lines.map((l) => l.productId)
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, price, title')
    .in('id', productIds)
  if (productsError) throw productsError

  const priceMap = new Map((products as { id: string; price: number; title: string }[]).map((p) => [p.id, p]))

  const items: OrderItem[] = lines.map((l) => {
    const product = priceMap.get(l.productId)
    if (!product) throw new Error(`Product ${l.productId} is no longer available`)
    return {
      product_id: l.productId,
      product_name: product.title,
      quantity: l.quantity,
      price: product.price, // verified server-side price, not the client snapshot
    }
  })

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 8.99
  const total = subtotal + shipping

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      customer_email: form.email,
      total_amount: total,
      items,
      shipping_address: {
        fullName: form.fullName,
        phone: form.phone,
        address1: form.address1,
        address2: form.address2 ?? '',
        city: form.city,
        region: form.region,
        postalCode: form.postalCode,
        country: form.country,
      },
    })
    .select()
    .single()
  if (orderError) throw orderError

  return order as { id: string }
}

export async function listMyOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function listAllOrders() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw error
}
