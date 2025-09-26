'use client'

import Link from 'next/link'
import { useAuth } from '@/components/providers'
import { SignInForm } from '@/components/auth'
import { PageLoader } from '@/components/loaders'

export default function SignInPage() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-y-16 inset-x-4 -z-10 rounded-3xl bg-cyan-500/5 blur-3xl" />

      <div className="w-full max-w-lg space-y-10 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/40 backdrop-blur">
        <header className="space-y-3 text-center">
          <Link href="/" className="inline-flex items-center justify-center text-2xl font-semibold text-white">
            code<span className="ml-1 text-cyan-300">Winter</span>
          </Link>
          <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
          <p className="text-sm text-slate-300">
            Use your email to receive a magic link. No passwords, just one click.
          </p>
        </header>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 shadow-inner shadow-cyan-500/5">
          <SignInForm />
        </div>

        <footer className="text-center text-sm text-slate-400">
          By continuing you agree to the{' '}
          <Link href="/" className="text-cyan-300 hover:text-cyan-200">
            terms
          </Link>{' '}
          of codeWinter.
        </footer>
      </div>
    </div>
  )
}
