'use client'

import { useAuth } from '@/components/providers'
import { SignInForm } from '@/components/auth'
import Link from 'next/link'

export default function SignInPage() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-white">
              code<span className="text-cyan-400">Winter</span>
            </h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email to receive a magic link
          </p>
        </div>

        {/* Sign-in form */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
