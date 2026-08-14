import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const loading = useAuthStore((s) => s.loading)
  const signOut = useAuthStore((s) => s.signOut)
  const init = useAuthStore((s) => s.init)

  return { user, isAdmin, loading, signOut, init }
}
