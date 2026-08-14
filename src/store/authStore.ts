import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  isAdmin: boolean
  loading: boolean
  init: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  loading: true,
  init: async () => {
    const { data } = await supabase.auth.getSession()
    const user = data.session?.user ?? null
    let isAdmin = false
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      isAdmin = Boolean((profile as { is_admin?: boolean } | null)?.is_admin)
    }
    set({ user, isAdmin, loading: false })

    supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null
      let nextIsAdmin = false
      if (nextUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', nextUser.id)
          .single()
        nextIsAdmin = Boolean((profile as { is_admin?: boolean } | null)?.is_admin)
      }
      set({ user: nextUser, isAdmin: nextIsAdmin, loading: false })
    })
  },
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, isAdmin: false })
  },
}))
