export interface ProductStat {
  product_id: string
  views: number
  add_to_carts: number
  purchases: number
  revenue: number
}

export interface DashboardSummary {
  revenue_today: number
  revenue_total: number
  orders_total: number
  customers_total: number
  average_order_value: number
}
