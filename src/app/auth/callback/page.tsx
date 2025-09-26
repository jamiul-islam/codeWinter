'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = useSupabase()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          router.push('/?error=auth_failed')
          return
        }

        if (data.session) {
          // Successful authentication, redirect to dashboard
          router.push('/dashboard')
        } else {
          // No session found, redirect to home
          router.push('/')
        }
      } catch (error: any) {
        console.error('Unexpected error during auth callback:', error)
        router.push('/?error=unexpected')
      }
    }

    handleAuthCallback()
  }, [router, supabase.auth])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
        <p className="text-slate-300">Completing sign in...</p>
      </div>
    </div>
  )
}
