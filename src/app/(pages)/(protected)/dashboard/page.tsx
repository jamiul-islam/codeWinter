'use client'

import { useAuth } from '@/components/providers'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, signOut, isLoading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Failed to sign out')
      return
    }
    // redirect to sign in page
    router.push('/signin')
  }

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
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/settings"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-600 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="space-y-8">
        {/* Projects section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-medium text-white">Projects</h2>
            <button className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-cyan-400">
              New Project
            </button>
          </div>

          {/* Empty state */}
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-slate-700 p-3">
                <svg
                  className="h-6 w-6 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-lg font-medium text-white">
              No projects yet
            </h3>
            <p className="mb-6 text-slate-400">
              Create your first project to start building feature graphs and
              generating PRDs.
            </p>
            <button className="rounded-lg bg-cyan-500 px-6 py-3 font-medium text-slate-900 transition-colors hover:bg-cyan-400">
              Create your first project
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
