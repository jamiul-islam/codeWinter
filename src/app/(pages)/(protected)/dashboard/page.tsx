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

import {
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { buttonClasses } from '@/components/ui/button-classes'
import { PageLoader } from '@/components/loaders/PageLoader'
import ProjectsLoader from '@/components/loaders/ProjectsLoader'
import ProjectDialog, {
  type ProjectFormData,
} from '@/components/dashboard/NewProjectDialog'
import {
  Modal,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'

type Project = {
  id: string
  name: string
  updated_at: string
  prdCount: number
}

type ProjectsResponse = {
  projects: Array<{
    id: string
    name: string
    prdCount: number
    updated_at: string
  }>
}

type ProjectDetailsResponse = {
  project: {
    id: string
    name: string
    description: string
  }
  features: Array<{
    id: string
    title: string
  }>
}

type ErrorResponse = {
  error?: string
}

export default function DashboardPage() {
  const { user, signOut, isLoading } = useAuth()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [dialogInitialData, setDialogInitialData] = useState<
    ProjectFormData | undefined
  >(undefined)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [isDialogBusy, setIsDialogBusy] = useState(false)
  const [projectPendingDelete, setProjectPendingDelete] =
    useState<Project | null>(null)
  const [isDeletingProject, setIsDeletingProject] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      setFeedback('Unable to sign out right now. Please try again in a moment.')
      return
    }
    router.push('/')
  }

  // const fetchProjects = useCallback(async () => {
  //   if (!user) return
  //   setLoadingProjects(true)
  //   try {
  //     const res = await fetch('/api/projects')
  //     const data = (await res.json()) as ProjectsResponse | ErrorResponse

  //     if (res.ok && 'projects' in data && Array.isArray(data.projects)) {
  //       const projectsWithPRD = await Promise.all(
  //         data.projects.map(async (project) => {
  //           const prdRes = await fetch(`/api/projects/${project.id}/prds`)
  //           const prdData = (await prdRes.json()) as
  //             | PrdCountResponse
  //             | ErrorResponse
  //           return {
  //             ...project,
  //             prdCount:
  //               prdRes.ok && 'count' in prdData ? (prdData.count ?? 0) : 0,
  //           }
  //         })
  //       )
  //       setProjects(projectsWithPRD)
  //     } else {
  //       const message =
  //         'error' in data && data.error ? data.error : 'Failed to load projects'
  //       setFeedback(message)
  //     }
  //   } catch (err) {
  //     console.error(err)
  //     setFeedback('Unable to load projects')
  //   } finally {
  //     setLoadingProjects(false)
  //   }
  // }, [user])

  const fetchProjects = useCallback(async () => {
    if (!user) return
    setLoadingProjects(true)
    try {
      const res = await fetch('/api/projects')
      const data = (await res.json()) as ProjectsResponse | ErrorResponse

      if (res.ok && 'projects' in data && Array.isArray(data.projects)) {
        setProjects(data.projects)
      } else {
        const message =
          'error' in data && data.error ? data.error : 'Failed to load projects'
        setFeedback(message)
      }
    } catch (err) {
      console.error(err)
      setFeedback('Unable to load projects')
    } finally {
      setLoadingProjects(false)
    }
  }, [user])

  const openCreateDialog = () => {
    setDialogMode('create')
    setActiveProjectId(null)
    setDialogInitialData(undefined)
    setIsDialogOpen(true)
  }

  const handleEditProject = useCallback(async (projectId: string) => {
    try {
      setIsDialogBusy(true)
      const res = await fetch(`/api/projects/${projectId}`)
      const data = (await res.json()) as ProjectDetailsResponse | ErrorResponse

      if (!res.ok || !('project' in data)) {
        const message =
          'error' in data && data.error
            ? data.error
            : 'Failed to load project details'
        setFeedback(message)
        return
      }

      setDialogMode('edit')
      setActiveProjectId(projectId)
      setDialogInitialData({
        name: data.project.name,
        description: data.project.description,
        features: (data.features ?? []).map((feature) => ({
          featureId: feature.id,
          title: feature.title,
        })),
      })
      setIsDialogOpen(true)
    } catch (error) {
      console.error(error)
      setFeedback('Unable to load project details for editing.')
    } finally {
      setIsDialogBusy(false)
    }
  }, [])

  const handleProjectDialogSubmit = useCallback(
    async (data: ProjectFormData) => {
      if (dialogMode === 'edit') {
        if (!activeProjectId) {
          throw new Error('Missing project identifier for update')
        }

        const res = await fetch(`/api/projects/${activeProjectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            features: data.features.map((feature) => ({
              featureId: feature.featureId,
              title: feature.title,
            })),
          }),
        })
        const result = (await res.json()) as ErrorResponse

        if (!res.ok) {
          throw new Error(result.error || 'Failed to update project')
        }

        setFeedback('Project updated successfully!')
        setDialogInitialData(undefined)
        setActiveProjectId(null)
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            features: data.features.map((feature) => ({
              title: feature.title,
            })),
          }),
        })
        const result = (await res.json()) as ErrorResponse

        if (!res.ok) {
          throw new Error(result.error || 'Failed to create project')
        }

        setFeedback('Project created successfully!')
      }

      await fetchProjects()
    },
    [dialogMode, activeProjectId, fetchProjects]
  )

  const closeProjectDialog = useCallback(() => {
    setIsDialogOpen(false)
    setDialogInitialData(undefined)
    setActiveProjectId(null)
    setDialogMode('create')
  }, [])

  const confirmDeleteProject = async () => {
    if (!projectPendingDelete) return
    setIsDeletingProject(true)
    try {
      const res = await fetch(`/api/projects/${projectPendingDelete.id}`, {
        method: 'DELETE',
      })
      const result = (await res.json().catch(() => ({}))) as ErrorResponse

      if (!res.ok) {
        throw new Error(result.error || 'Failed to delete project')
      }

      setFeedback('Project deleted successfully.')
      setProjectPendingDelete(null)
      await fetchProjects()
    } catch (error) {
      console.error(error)
      setFeedback(
        error instanceof Error ? error.message : 'Unable to delete project'
      )
    } finally {
      setIsDeletingProject(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  if (isLoading) return <PageLoader />

  const friendlyName = user?.email?.split('@')[0] ?? 'there'

  const cardClass =
    'rounded-3xl border border-white/10 bg-white/5 shadow-inner shadow-black/30 backdrop-blur'

  return (
    <main className="relative isolate mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-16">
      {/* Background divs */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="pointer-events-none absolute top-24 left-10 -z-10 hidden h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl md:block" />
      <div className="pointer-events-none absolute right-0 bottom-10 -z-10 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Header */}
      <header
        className={`${cardClass} flex flex-col gap-6 p-8 sm:flex-row sm:items-end sm:justify-between`}
      >
        <div className="space-y-3">
          <p className="text-xs tracking-[0.35em] text-cyan-200/70 uppercase">
            Overview
          </p>
          <div>
            <h1 className="text-3xl font-semibold text-white">
              Welcome back, {friendlyName}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Capture your ideas, draft feature graphs, and publish calming PRDs
              without leaving this focused space.
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
        <div
          className={`${cardClass} border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100`}
        >
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
          <h2 className="mt-6 text-2xl font-semibold text-white">
            Your workspace is ready
          </h2>
          <p className="mt-3 max-w-xl text-sm text-slate-300">
            Start by creating a project, then sketch the relationships in the
            graph canvas to keep your PRDs consistent.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 lg:flex-row lg:justify-start">
            <Button
              size="lg"
              className="min-w-[180px]"
              onClick={openCreateDialog}
            >
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
            Invite collaborators, connect Supabase tables, and keep your Gemini
            key handy in settings to unlock the agent features.
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
      <section className="mt-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Your Projects</h2>
        {loadingProjects ? (
          <ProjectsLoader />
        ) : projects.length === 0 ? (
          <p className="text-sm text-slate-300">
            No projects yet. Create one to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => router.push(`/project/${project.id}`)}
                className="group relative cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-black/30 transition hover:scale-[1.02] hover:bg-white/10"
              >
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition group-hover:opacity-100">
                  <IconButton
                    ariaLabel="Edit project"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleEditProject(project.id)
                    }}
                    disabled={isDialogBusy}
                  >
                    <PencilIcon />
                  </IconButton>
                  <IconButton
                    ariaLabel="Delete project"
                    onClick={(event) => {
                      event.stopPropagation()
                      setProjectPendingDelete(project)
                    }}
                  >
                    <TrashIcon />
                  </IconButton>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Last updated:{' '}
                  {new Date(project.updated_at).toLocaleDateString()}
                </p>
                <p className="mt-1 text-sm text-cyan-200">
                  {project.prdCount} PRDs ready
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* New Project Dialog */}
      <ProjectDialog
        isOpen={isDialogOpen}
        mode={dialogMode}
        onClose={closeProjectDialog}
        onSubmit={handleProjectDialogSubmit}
        initialData={dialogMode === 'edit' ? dialogInitialData : undefined}
      />

      <Modal
        isOpen={Boolean(projectPendingDelete)}
        onClose={() => setProjectPendingDelete(null)}
      >
        <ModalHeader>
          <ModalTitle>Delete project?</ModalTitle>
          <ModalDescription>
            This will remove{' '}
            <span className="font-semibold text-white">
              {projectPendingDelete?.name}
            </span>{' '}
            and all related features, graphs, and PRDs.
          </ModalDescription>
        </ModalHeader>

        <p className="text-sm text-slate-300">
          This action cannot be undone. Make sure you have exported any required
          PRDs before deleting.
        </p>

        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setProjectPendingDelete(null)}
            disabled={isDeletingProject}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-rose-500 text-white shadow shadow-rose-500/30 hover:bg-rose-400"
            onClick={confirmDeleteProject}
            disabled={isDeletingProject}
          >
            {isDeletingProject ? 'Deleting...' : 'Delete project'}
          </Button>
        </ModalFooter>
      </Modal>
    </main>
  )
}

function IconButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: ReactNode
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-300/50 hover:bg-cyan-400/10 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  )
}

function PencilIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M3 14.5v2.5h2.5l9-9-2.5-2.5-9 9Z" strokeLinejoin="round" />
      <path d="M12.5 5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M4 6h12" strokeLinecap="round" />
      <path
        d="M8.5 6.5v-2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2"
        strokeLinecap="round"
      />
      <path
        d="M6.5 6h7l-.5 9a1 1 0 0 1-1 .92h-3.5a1 1 0 0 1-1-.92L6.5 6Z"
        strokeLinejoin="round"
      />
    </svg>
  )
}
