import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars are missing. Copy .env.example to .env and fill in your project values.')
}

// Not typed against a generated Database schema by default -- the hand-written
// tables in supabase/migrations/0001_init.sql are the source of truth. Once your
// schema stabilizes, generate real types with the Supabase CLI (see README) and
// swap this back to createClient<Database>(url, anonKey).
export const supabase = createClient(url, anonKey)
