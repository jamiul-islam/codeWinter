'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'

import { getBrowserSupabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

const SupabaseContext = createContext<SupabaseClient<Database> | null>(null)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => getBrowserSupabaseClient())
  const value = useMemo(() => client, [client])

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
