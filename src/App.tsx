import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AppRoutes } from '@/routes/AppRoutes'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { trackEvent } from '@/services/analytics'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    trackEvent('page_view', { path: location.pathname })
  }, [location.pathname])

  return (
    <div className="mx-auto min-h-screen max-w-5xl bg-paper pb-16 sm:pb-0">
      <Header />
      <main>
        <AppRoutes />
      </main>
      <Footer />
      <BottomNav />
      <CartDrawer />
    </div>
  )
}
