'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/components/providers'
import { Button, buttonClasses } from '@/components/ui/button'
import { PageLoader } from '@/components/loaders'

export default function DashboardPage() {
  const { user, signOut, isLoading } = useAuth()
  const [feedback, setFeedback] = useState<string | null>(null)
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      setFeedback('Unable to sign out right now. Please try again in a moment.')
      return
    }
    router.push('/signin')
  }

  if (isLoading) {
    return <PageLoader />
  }

  const friendlyName = user?.email?.split('@')[0] ?? 'there'

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/30 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Overview</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Welcome back, {friendlyName}</h1>
          <p className="mt-3 max-w-xl text-sm text-slate-300">
            Create projects, map your feature graph, and generate interconnected PRDs without leaving this calm little workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link className={buttonClasses({ variant: 'secondary', size: 'sm' })} href="/settings">
            Settings
          </Link>
          <Button onClick={handleSignOut} variant="ghost" size="sm">
            Sign out
          </Button>
        </div>
      </header>

      {feedback && (
        <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
          {feedback}
        </div>
      )}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-lg shadow-black/20">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-cyan-500/10">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-10 w-10 text-cyan-200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-white">Your workspace is ready</h2>
        <p className="mt-3 text-sm text-slate-300">
          Kick things off by describing the project and the features you want your agent to deliver.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="min-w-[200px]">
            New project
          </Button>
          <button
            type="button"
            className="text-sm text-slate-300 underline-offset-4 hover:text-slate-100 hover:underline"
          >
            View quick-start guide
          </button>
        </div>
      </section>
    </div>
  )
}
