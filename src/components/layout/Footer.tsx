import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="hidden border-t border-line px-4 py-8 text-sm text-muted sm:block">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} Store. All rights reserved.</span>
        <div className="flex gap-4">
          <Link to="/about" className="hover:text-ink">About</Link>
          <Link to="/shop" className="hover:text-ink">Shop</Link>
        </div>
      </div>
    </footer>
  )
}
