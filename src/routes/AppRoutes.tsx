import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminLayout } from '@/components/admin/AdminLayout'

import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import ProductPage from '@/pages/Product'
import ProductIncludes from '@/pages/ProductIncludes'
import Category from '@/pages/Category'
import Search from '@/pages/Search'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import OrderSuccess from '@/pages/OrderSuccess'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Account from '@/pages/Account'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'

import AdminDashboard from '@/admin/Dashboard'
import AdminOrders from '@/admin/Orders'
import AdminProducts from '@/admin/Products'
import AdminCategories from '@/admin/Categories'
import AdminCustomers from '@/admin/Customers'
import AdminAnalytics from '@/admin/Analytics'
import AdminSettings from '@/admin/Settings'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/products/:slug" element={<ProductPage />} />
      <Route path="/products/:slug/includes" element={<ProductIncludes />} />
      <Route path="/category/:slug" element={<Category />} />
      <Route path="/search" element={<Search />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={<Account />} />
      <Route path="/about" element={<About />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
