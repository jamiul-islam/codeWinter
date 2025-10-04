'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

import { env } from '@/lib/env'
import type { Database } from '@/lib/supabase/types'

export async function getServerSupabaseClient(): Promise<
  SupabaseClient<Database>
> {
  const cookieStore = await cookies()
  const mutableCookieStore = cookieStore as unknown as {
    set?: (options: { name: string; value: string } & CookieOptions) => void
    delete?: (name: string) => void
  }
  const canMutateCookies = typeof mutableCookieStore.set === 'function'
  const warnOnCookieMutation = (
    action: 'set' | 'remove',
    name: string,
    error: unknown
  ) => {
    if (!canMutateCookies && process.env.NODE_ENV === 'development') {
      console.warn(
        `Skipped cookie ${action} for "${name}" because the cookies API is read-only in this context.`,
        error
      )
    }
  }

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: canMutateCookies,
        persistSession: true,
      },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          if (!canMutateCookies || typeof mutableCookieStore.set !== 'function') {
            warnOnCookieMutation('set', name, new Error('read-only cookies'))
            return
          }

          try {
            mutableCookieStore.set({ name, value, ...options })
          } catch (error) {
            warnOnCookieMutation('set', name, error)
          }
        },
        remove(name: string, options: CookieOptions) {
          if (!canMutateCookies) {
            warnOnCookieMutation('remove', name, new Error('read-only cookies'))
            return
          }

          try {
            if (typeof mutableCookieStore.delete === 'function') {
              mutableCookieStore.delete(name)
              return
            }
            mutableCookieStore.set?.({ name, value: '', ...options, maxAge: 0 })
          } catch (error) {
            warnOnCookieMutation('remove', name, error)
          }
        },
      },
    }
  )
}
