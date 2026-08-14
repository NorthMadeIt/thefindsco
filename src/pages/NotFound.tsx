import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-20 text-center">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-sm text-gray-500">The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button variant="secondary" className="mt-2">Go home</Button>
      </Link>
    </div>
  )
}
