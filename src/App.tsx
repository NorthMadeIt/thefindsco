import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'

function App() {
  const init = useAuthStore((s) => s.init)
  useEffect(() => {
    init()
  }, [init])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
