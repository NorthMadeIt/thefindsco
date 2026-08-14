export interface ProductSpec {
  label: string
  value: string
}

export interface IncludesPosition {
  x: number // % from left
  y: number // % from top
}

export interface Product {
  id: string
  slug: string
  title: string
  tagline: string | null
  brand: string | null
  price: number // decimal dollars, matches FINDSCO's numeric column
  compare_at_price: number | null
  category_id: string | null
  images: string[]
  specs: ProductSpec[]
  includes: string[]
  includes_positions: IncludesPosition[]
  description: string | null
  in_stock: boolean
  stock: number
  sku: string | null
  status: 'active' | 'draft' | 'archived'
  featured: boolean
  created_at: string
}

export type ProductInput = Omit<Product, 'id' | 'created_at'>
