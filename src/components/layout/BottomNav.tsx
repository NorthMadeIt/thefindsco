import { NavLink } from 'react-router-dom'
import { Home, Grid2x2, ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/shop', label: 'Shop', icon: Grid2x2 },
  { to: '/cart', label: 'Cart', icon: ShoppingBag },
  { to: '/account', label: 'Account', icon: User },
]

export function BottomNav() {
  const { count } = useCart()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-line bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)] sm:hidden">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'relative flex flex-col items-center gap-0.5 px-4 py-1 text-[11px] font-medium',
              isActive ? 'text-ink' : 'text-muted',
            )
          }
        >
          <Icon size={22} strokeWidth={2} />
          {label}
          {to === '/cart' && count > 0 && (
            <span className="absolute right-2 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 text-[9px] font-semibold text-white">
              {count}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
