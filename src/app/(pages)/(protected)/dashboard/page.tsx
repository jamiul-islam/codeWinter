'use client'

import { useAuth } from '@/components/providers'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { buttonClasses } from '@/components/ui/button.styles'
import { FolderOpen, Plus } from 'lucide-react'
import { PageLoader } from '@/components/loaders'

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
    return <PageLoader />
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
          <Link className={buttonClasses({ size: 'sm' })} href="/settings">
            Settings
          </Link>
          <Button onClick={handleSignOut} variant="secondary" size="sm">
            Sign out
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="space-y-8">
        {/* Projects section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-medium text-white">Projects</h2>
            <Button variant="primary" size="sm">
              New Project
            </Button>
          </div>

          {/* Empty state */}
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-slate-700 p-3">
                <FolderOpen className="size-10 text-slate-400" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-medium text-white">
              No projects yet
            </h3>
            <p className="mb-6 text-slate-400">
              Create your first project to start building feature graphs and
              generating PRDs.
            </p>

            <Button variant="primary" size="md">
              {/* it should open a modal */}
              <Plus className="size-4" /> Create your first project
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
