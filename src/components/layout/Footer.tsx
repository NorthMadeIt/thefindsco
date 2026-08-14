import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-ink/60 sm:flex-row sm:px-6">
        <p>&copy; {new Date().getFullYear()} Store. All rights reserved.</p>
        <nav className="flex gap-6">
          <Link to="/about" className="hover:text-ink">About</Link>
          <Link to="/shop" className="hover:text-ink">Shop</Link>
          <Link to="/account" className="hover:text-ink">Account</Link>
        </nav>
      </div>
    </footer>
  )
}
