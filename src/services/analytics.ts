import { supabase } from '@/lib/supabase'

export type AnalyticsEventType = 'page_view' | 'product_view' | 'add_to_cart' | 'checkout_start' | 'purchase'

function getSessionId() {
  const key = 'store-session-id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

// Writes into FINDSCO's `page_views` table, extended with event_type + session_id
// so it can carry the full funnel, not just page loads.
export async function trackEvent(eventType: AnalyticsEventType, opts?: { productId?: string; path?: string }) {
  try {
    await supabase.from('page_views').insert({
      event_type: eventType,
      product_id: opts?.productId ?? null,
      session_id: getSessionId(),
      page_path: opts?.path ?? window.location.pathname,
    })
  } catch {
    // analytics should never break the shopping experience
  }
}

export async function getDashboardSummary() {
  const { data: orders, error } = await supabase.from('orders').select('total_amount, created_at, user_id, customer_email')
  if (error) throw error
  const rows = orders as { total_amount: number; created_at: string; user_id: string | null; customer_email: string }[]

  const today = new Date().toDateString()
  const revenueToday = rows
    .filter((o) => new Date(o.created_at).toDateString() === today)
    .reduce((s, o) => s + o.total_amount, 0)
  const revenueTotal = rows.reduce((s, o) => s + o.total_amount, 0)
  const uniqueCustomers = new Set(rows.map((o) => o.user_id ?? o.customer_email)).size

  return {
    revenue_today: revenueToday,
    revenue_total: revenueTotal,
    orders_total: rows.length,
    customers_total: uniqueCustomers,
    average_order_value: rows.length ? revenueTotal / rows.length : 0,
  }
}

export async function getProductFunnel(productId: string) {
  const { data, error } = await supabase.from('page_views').select('event_type').eq('product_id', productId)
  if (error) throw error
  const rows = data as { event_type: string }[]
  return {
    views: rows.filter((r) => r.event_type === 'product_view').length,
    addToCarts: rows.filter((r) => r.event_type === 'add_to_cart').length,
    purchases: rows.filter((r) => r.event_type === 'purchase').length,
  }
}
