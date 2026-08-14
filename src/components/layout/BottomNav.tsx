import { NavLink } from 'react-router-dom'
import { Home, Search, ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'

const items = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/shop', label: 'Shop', icon: Search },
  { to: '/cart', label: 'Cart', icon: ShoppingBag },
  { to: '/account', label: 'Account', icon: User },
]

export function BottomNav() {
  const { count } = useCart()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-line bg-paper/95 backdrop-blur md:hidden">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium',
              isActive ? 'text-ink' : 'text-ink/50'
            )
          }
        >
          <Icon size={20} />
          {label}
          {to === '/cart' && count > 0 && (
            <span className="absolute right-1/2 top-1 translate-x-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
