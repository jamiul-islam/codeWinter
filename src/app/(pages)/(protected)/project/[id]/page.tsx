// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useProjectStore } from '@/lib/store/project-store'
// import { PageLoader } from '@/components/loaders'
// import { GraphCanvas } from '@/components/graph'

// interface Project {
//   id: string
//   name: string
//   description?: string
//   graph: { nodes: any[]; edges: any[] }
//   created_at: string
//   updated_at: string
// }

// export default function ProjectPage({ params }: { params: { id: string } }) {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   // Zustand methods
//   const resetStore = useProjectStore((state) => state.reset)
//   const upsertNode = useProjectStore((state) => state.upsertNode)
//   const resetEdges = useProjectStore((state) => state.resetEdges)
//   const addEdgeToStore = useProjectStore((state) => state.addEdge)

//   useEffect(() => {
//     const fetchProjectData = async () => {
//       setLoading(true)
//       try {
//         const res = await fetch(`/api/projects/${params.id}`)
//         const data = await res.json()

//         if (!res.ok) {
//           setError(data.error || 'Failed to fetch project')
//           setLoading(false)
//           return
//         }

//         const project: Project = data.project

//         // Reset Zustand store
//         resetStore()
//         resetEdges()

//         // Populate nodes
//         project.graph?.nodes?.forEach((node) => upsertNode(node))

//         // Populate edges
//         project.graph?.edges?.forEach((edge) => addEdgeToStore(edge))

//         setLoading(false)
//       } catch (err) {
//         setError('Failed to fetch project')
//         setLoading(false)
//       }
//     }

//     fetchProjectData()
//   }, [params.id, resetStore, resetEdges, upsertNode, addEdgeToStore])

//   if (loading) return <PageLoader />
//   if (error) return <div className="text-red-500">{error}</div>

//   return (
//     <main className="p-8">
//       <h1 className="text-3xl font-semibold mb-4">{params.id}</h1>
//       <p className="text-slate-300 mb-6">Project ID: {params.id}</p>

//       {/* Graph Canvas */}
//       <div className="w-full h-[600px] rounded-xl border border-white/10 bg-white/5 p-4">
//         <GraphCanvas />
//       </div>
//     </main>
//   )
// }


'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/lib/store/project-store'
import { PageLoader } from '@/components/loaders'
import { GraphCanvas } from '@/components/graph'

interface Project {
  id: string
  name: string
  description?: string
  graph: { nodes: any[]; edges: any[] }
  created_at: string
  updated_at: string
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Zustand methods
  const resetStore = useProjectStore((state) => state.reset)
  const upsertNode = useProjectStore((state) => state.upsertNode)
  const resetEdges = useProjectStore((state) => state.resetEdges)
  const addEdgeToStore = useProjectStore((state) => state.addEdge)

  // set current project ID in store
  const setCurrentProjectId = useProjectStore((state) => state.setCurrentProjectId)

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/projects/${params.id}`)
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Failed to fetch project')
          setLoading(false)
          return
        }

        const project: Project = data.project

        // Save projectId to Zustand (for persistence in GraphCanvas)
        setCurrentProjectId(project.id)

        // Reset Zustand store
        resetStore()
        resetEdges()

        // Populate nodes
        project.graph?.nodes?.forEach((node) => upsertNode(node))

        // Populate edges
        project.graph?.edges?.forEach((edge) => addEdgeToStore(edge))

        setLoading(false)
      } catch (err) {
        setError('Failed to fetch project')
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [params.id, resetStore, resetEdges, upsertNode, addEdgeToStore, setCurrentProjectId])

  if (loading) return <PageLoader />
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <main className="p-8">
      <h1 className="text-3xl font-semibold mb-4">Project Graph</h1>
      <p className="text-slate-300 mb-6">Project ID: {params.id}</p>

      {/* Graph Canvas */}
      <div className="w-full h-[600px] rounded-xl border border-white/10 bg-white/5 p-4">
        <GraphCanvas />
      </div>
    </main>
  )
}
