'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/components/providers'
import { SignInForm } from '@/components/auth'
import { PageLoader } from '@/components/loaders'

export default function SignInPage() {
  const { isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard')
    }
  }, [isLoading, user, router])

  if (isLoading || user) {
    return <PageLoader />
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center px-6 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="pointer-events-none absolute top-12 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-20 -z-10 hidden h-48 w-48 rounded-full bg-purple-500/10 blur-3xl sm:block" />

      <div className="w-full max-w-lg space-y-10 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-inner shadow-black/30 backdrop-blur">
        <header className="space-y-3 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center text-2xl font-semibold text-white transition hover:text-cyan-200"
          >
            code<span className="text-cyan-300">Winter </span> ❄️
          </Link>
          <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
          <p className="text-sm text-slate-300">
            We send a one-time magic link to sign you in. It works on desktop
            and mobile.
          </p>
        </header>

        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-inner shadow-black/40">
          <SignInForm />
        </div>

        <footer className="text-center text-xs text-slate-400">
          By continuing you agree to the{' '}
          <Link
            href="/"
            className="text-cyan-300 transition hover:text-cyan-200"
          >
            terms
          </Link>{' '}
          of codeWinter.
        </footer>
      </div>
    </main>
  )
}
