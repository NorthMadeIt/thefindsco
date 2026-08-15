import { Link, NavLink } from 'react-router-dom'
import { Search, ShoppingBag, User, LayoutDashboard } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useCategories } from '@/hooks/useCategories'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import logo from '@/assets/logo/store-logo.svg'

export function Header() {
  const { count, open } = useCart()
  const { categories } = useCategories()
  const { user, isAdmin } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur sm:px-6">
      <Link to="/" className="flex shrink-0 items-center gap-2">
        <img src={logo} alt="Store logo" className="h-7 w-7" />
        <span className="font-display text-lg font-semibold tracking-tight">Store</span>
      </Link>

      <nav className="hidden items-center gap-6 md:flex">
        {categories.map((c) => (
          <NavLink
            key={c.id}
            to={`/category/${c.slug}`}
            className={({ isActive }) =>
              cn('text-sm font-medium text-ink/70 hover:text-ink', isActive && 'text-ink')
            }
          >
            {c.name}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-1">
        {isAdmin && import.meta.env.VITE_ADMIN_URL && (
          <a
            href={import.meta.env.VITE_ADMIN_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Admin dashboard"
            className="hidden items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-ink/5 sm:flex"
          >
            <LayoutDashboard size={14} /> Dashboard
          </a>
        )}
        <Link to="/search" aria-label="Search" className="rounded-full p-2 hover:bg-ink/5">
          <Search size={20} />
        </Link>
        <Link
          to={user ? '/account' : '/login'}
          aria-label="Account"
          className="hidden rounded-full p-2 hover:bg-ink/5 sm:block"
        >
          <User size={20} />
        </Link>
        <button onClick={open} aria-label="Open cart" className="relative rounded-full p-2 hover:bg-ink/5">
          <ShoppingBag size={20} />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
