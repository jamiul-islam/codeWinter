'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

import { env } from '@/lib/env'
import type { Database } from '@/lib/supabase/types'

let browserClient: SupabaseClient<Database> | undefined

export function getBrowserSupabaseClient() {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }

  return browserClient
}
