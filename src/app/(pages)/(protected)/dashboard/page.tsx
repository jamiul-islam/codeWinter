// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'

// import { useAuth } from '@/components/providers'
// import { Button } from '@/components/ui/button'
// import { buttonClasses } from '@/components/ui/button-classes'
// import { PageLoader } from '@/components/loaders'
// import NewProjectDialog from '@/components/dashboard/NewProjectDialog'

// type Project = {
//   id: string
//   name: string
//   updated_at: string
//   prdCount?: number
// }

// export default function DashboardPage() {
//   const { user, signOut, isLoading } = useAuth()
//   const [feedback, setFeedback] = useState<string | null>(null)
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [projects, setProjects] = useState<Project[]>([])
//   const [loadingProjects, setLoadingProjects] = useState(false)
//   const router = useRouter()

//   const handleSignOut = async () => {
//     const { error } = await signOut()
//     if (error) {
//       setFeedback('Unable to sign out right now. Please try again in a moment.')
//       return
//     }
//     router.push('/')
//   }

//   const handleNewProjectSubmit = async (data: any) => {
//     try {
//       const res = await fetch('/api/projects', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       })
//       const result = await res.json()

//       if (!res.ok) {
//         setFeedback(result.error || 'Failed to create project')
//         return
//       }

//       setFeedback('Project created successfully!')
//       console.log('Created Project:', result.project)

//       // Refresh projects list
//       fetchProjects()
//     } catch (err) {
//       console.error(err)
//       setFeedback('Something went wrong. Please try again.')
//     }
//   }

//   const fetchProjects = async () => {
//     if (!user) return
//     setLoadingProjects(true)
//     try {
//       const res = await fetch('/api/projects')
//       const data = await res.json()
//       if (res.ok) {
//         setProjects(data.projects || [])
//       } else {
//         setFeedback(data.error || 'Failed to load projects')
//       }
//     } catch (err) {
//       console.error(err)
//       setFeedback('Unable to load projects')
//     } finally {
//       setLoadingProjects(false)
//     }
//   }

//   useEffect(() => {
//     fetchProjects()
//   }, [user])

//   if (isLoading) return <PageLoader />

//   const friendlyName = user?.email?.split('@')[0] ?? 'there'

//   const cardClass =
//     'rounded-3xl border border-white/10 bg-white/5 shadow-inner shadow-black/30 backdrop-blur'

//   return (
//     <main className="relative isolate mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-16">
//       <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
//       <div className="pointer-events-none absolute left-10 top-24 -z-10 hidden h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl md:block" />
//       <div className="pointer-events-none absolute bottom-10 right-0 -z-10 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

//       <header
//         className={`${cardClass} flex flex-col gap-6 p-8 sm:flex-row sm:items-end sm:justify-between`}
//       >
//         <div className="space-y-3">
//           <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Overview</p>
//           <div>
//             <h1 className="text-3xl font-semibold text-white">Welcome back, {friendlyName}</h1>
//             <p className="mt-2 max-w-xl text-sm text-slate-300">
//               Capture your ideas, draft feature graphs, and publish calming PRDs without leaving this
//               focused space.
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <Link
//             className={buttonClasses({ variant: 'secondary', size: 'sm' })}
//             href="/settings"
//           >
//             Settings
//           </Link>
//           <Button onClick={handleSignOut} variant="ghost" size="sm">
//             Sign out
//           </Button>
//         </div>
//       </header>

//       {feedback && (
//         <div className={`${cardClass} border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100`}>
//           {feedback}
//         </div>
//       )}

//       <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
//         <div className={`${cardClass} p-10 text-center lg:text-left`}>
//           <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 lg:mx-0">
//             <svg
//               aria-hidden
//               viewBox="0 0 24 24"
//               className="h-8 w-8 text-cyan-200"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.5"
//             >
//               <path d="M12 5v14M5 12h14" strokeLinecap="round" />
//             </svg>
//           </div>
//           <h2 className="mt-6 text-2xl font-semibold text-white">Your workspace is ready</h2>
//           <p className="mt-3 max-w-xl text-sm text-slate-300">
//             Start by creating a project, then sketch the relationships in the graph canvas to keep
//             your PRDs consistent.
//           </p>
//           <div className="mt-8 flex flex-col items-center gap-3 lg:flex-row lg:justify-start">
//             <Button size="lg" className="min-w-[180px]" onClick={() => setIsDialogOpen(true)}>
//               New project
//             </Button>
//             <button
//               type="button"
//               className="text-sm text-slate-300 underline-offset-4 transition hover:text-slate-100 hover:underline"
//             >
//               View quick-start guide
//             </button>
//           </div>
//         </div>

//         <div className={`${cardClass} p-10`}>
//           <h2 className="text-xl font-semibold text-white">Next steps</h2>
//           <p className="mt-3 text-sm text-slate-300">
//             Invite collaborators, connect Supabase tables, and keep your Gemini key handy in settings
//             to unlock the agent features.
//           </p>
//           <ul className="mt-6 space-y-3 text-sm text-slate-200">
//             <li className="flex items-center gap-3">
//               <span className="flex size-6 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs text-cyan-200">
//                 1
//               </span>
//               Create your first project draft in the dashboard.
//             </li>
//             <li className="flex items-center gap-3">
//               <span className="flex size-6 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs text-cyan-200">
//                 2
//               </span>
//               Use the graph canvas to map dependencies before generating a PRD.
//             </li>
//             <li className="flex items-center gap-3">
//               <span className="flex size-6 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs text-cyan-200">
//                 3
//               </span>
//               Head to settings to store your Gemini API key securely.
//             </li>
//           </ul>
//         </div>
//       </section>

//       {/* Projects List */}
//       <section className="mt-10">
//         <h2 className="mb-6 text-xl font-semibold text-white">Your Projects</h2>
//         {loadingProjects ? (
//           <PageLoader />
//         ) : projects.length === 0 ? (
//           <p className="text-slate-300">No projects yet. Create one to get started!</p>
//         ) : (
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {projects.map((project) => (
//               <div
//                 key={project.id}
//                 onClick={() => router.push(`/project/${project.id}`)}
//                 className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-black/30 transition hover:scale-[1.02] hover:bg-white/10"
//               >
//                 <h3 className="text-lg font-semibold text-white">{project.name}</h3>
//                 <p className="mt-2 text-sm text-slate-300">
//                   Last updated: {new Date(project.updated_at).toLocaleDateString()}
//                 </p>
//                 {project.prdCount !== undefined && (
//                   <p className="mt-1 text-sm text-cyan-200">{project.prdCount} PRDs ready</p>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* New Project Dialog */}
//       <NewProjectDialog
//         isOpen={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//         onSubmit={handleNewProjectSubmit}
//       />
//     </main>
//   )
// }


'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { buttonClasses } from '@/components/ui/button-classes'
import { PageLoader } from '@/components/loaders'
import NewProjectDialog from '@/components/dashboard/NewProjectDialog'

type Project = {
  id: string
  name: string
  updated_at: string
  prdCount: number
}

export default function DashboardPage() {
  const { user, signOut, isLoading } = useAuth()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      setFeedback('Unable to sign out right now. Please try again in a moment.')
      return
    }
    router.push('/')
  }

  const handleNewProjectSubmit = async (data: any) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (!res.ok) {
        setFeedback(result.error || 'Failed to create project')
        return
      }

      setFeedback('Project created successfully!')
      console.log('Created Project:', result.project)

      // Refresh projects list
      fetchProjects()
    } catch (err) {
      console.error(err)
      setFeedback('Something went wrong. Please try again.')
    }
  }

  const fetchProjects = async () => {
    if (!user) return
    setLoadingProjects(true)
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()

      if (res.ok) {
        // Map each project to include PRD count
        const projectsWithPRD = await Promise.all(
          data.projects.map(async (project: any) => {
            const prdRes = await fetch(`/api/projects/${project.id}/prds`)
            const prdData = await prdRes.json()
            return {
              ...project,
              prdCount: prdRes.ok ? prdData.count || 0 : 0,
            }
          })
        )
        setProjects(projectsWithPRD)
      } else {
        setFeedback(data.error || 'Failed to load projects')
      }
    } catch (err) {
      console.error(err)
      setFeedback('Unable to load projects')
    } finally {
      setLoadingProjects(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [user])

  if (isLoading) return <PageLoader />

  const friendlyName = user?.email?.split('@')[0] ?? 'there'

  const cardClass =
    'rounded-3xl border border-white/10 bg-white/5 shadow-inner shadow-black/30 backdrop-blur'

  return (
    <main className="relative isolate mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-16">
      {/* Background divs */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="pointer-events-none absolute left-10 top-24 -z-10 hidden h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl md:block" />
      <div className="pointer-events-none absolute bottom-10 right-0 -z-10 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Header */}
      <header
        className={`${cardClass} flex flex-col gap-6 p-8 sm:flex-row sm:items-end sm:justify-between`}
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Overview</p>
          <div>
            <h1 className="text-3xl font-semibold text-white">Welcome back, {friendlyName}</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Capture your ideas, draft feature graphs, and publish calming PRDs without leaving this
              focused space.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            className={buttonClasses({ variant: 'secondary', size: 'sm' })}
            href="/settings"
          >
            Settings
          </Link>
          <Button onClick={handleSignOut} variant="ghost" size="sm">
            Sign out
          </Button>
        </div>
      </header>

      {feedback && (
        <div className={`${cardClass} border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100`}>
          {feedback}
        </div>
      )}

      {/* Dashboard Sections */}
      <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Left card */}
        <div className={`${cardClass} p-10 text-center lg:text-left`}>
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 lg:mx-0">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-8 w-8 text-cyan-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-white">Your workspace is ready</h2>
          <p className="mt-3 max-w-xl text-sm text-slate-300">
            Start by creating a project, then sketch the relationships in the graph canvas to keep
            your PRDs consistent.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 lg:flex-row lg:justify-start">
            <Button size="lg" className="min-w-[180px]" onClick={() => setIsDialogOpen(true)}>
              New project
            </Button>
            <button
              type="button"
              className="text-sm text-slate-300 underline-offset-4 transition hover:text-slate-100 hover:underline"
            >
              View quick-start guide
            </button>
          </div>
        </div>

        {/* Right card */}
        <div className={`${cardClass} p-10`}>
          <h2 className="text-xl font-semibold text-white">Next steps</h2>
          <p className="mt-3 text-sm text-slate-300">
            Invite collaborators, connect Supabase tables, and keep your Gemini key handy in settings
            to unlock the agent features.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-200">
            <li className="flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs text-cyan-200">
                1
              </span>
              Create your first project draft in the dashboard.
            </li>
            <li className="flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs text-cyan-200">
                2
              </span>
              Use the graph canvas to map dependencies before generating a PRD.
            </li>
            <li className="flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs text-cyan-200">
                3
              </span>
              Head to settings to store your Gemini API key securely.
            </li>
          </ul>
        </div>
      </section>

      {/* Projects List */}
      <section className="mt-10">
        <h2 className="mb-6 text-xl font-semibold text-white">Your Projects</h2>
        {loadingProjects ? (
          <PageLoader />
        ) : projects.length === 0 ? (
          <p className="text-slate-300">No projects yet. Create one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => router.push(`/project/${project.id}`)}
                className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-black/30 transition hover:scale-[1.02] hover:bg-white/10"
              >
                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Last updated: {new Date(project.updated_at).toLocaleDateString()}
                </p>
                <p className="mt-1 text-sm text-cyan-200">{project.prdCount} PRDs ready</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* New Project Dialog */}
      <NewProjectDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleNewProjectSubmit}
      />
    </main>
  )
}
