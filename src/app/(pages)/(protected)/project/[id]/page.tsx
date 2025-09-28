// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'

// import { PageLoader } from '@/components/loaders'
// import { useProjectStore } from '@/lib/store/project-store'

// type Project = {
//   id: string
//   name: string
//   updated_at: string
// }

// type Feature = {
//   id: string
//   title: string
//   description: string
// }

// type GraphData = {
//   nodes: any[]
//   edges: any[]
// }

// export default function ProjectPage() {
//   const { id } = useParams() // project ID from route
//   const router = useRouter()
//   const { setProject, setFeatures, setGraph } = useProjectStore()
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (!id) return

//     const fetchProjectData = async () => {
//       setLoading(true)
//       try {
//         // 1. Fetch project
//         const projectRes = await fetch(`/api/projects/${id}`)
//         if (!projectRes.ok) throw new Error('Failed to fetch project')
//         const projectData: Project = await projectRes.json()

//         // 2. Fetch features (PRDs)
//         const featuresRes = await fetch(`/api/projects/${id}/prds`)
//         if (!featuresRes.ok) throw new Error('Failed to fetch project features')
//         const featuresData: { features: Feature[] } = await featuresRes.json()

//         // 3. Fetch graph data
//         const graphRes = await fetch(`/api/projects/${id}/graph`)
//         if (!graphRes.ok) throw new Error('Failed to fetch graph')
//         const graphData: GraphData = await graphRes.json()

//         // 4. Update Zustand store
//         setProject(projectData)
//         setFeatures(featuresData.features || [])
//         setGraph(graphData || { nodes: [], edges: [] })

//       } catch (err: any) {
//         console.error(err)
//         setError(err.message || 'Something went wrong')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProjectData()
//   }, [id, setProject, setFeatures, setGraph])

//   if (loading) return <PageLoader />
//   if (error) return <p className="text-red-400 text-center mt-10">{error}</p>

//   return (
//     <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
//       <h1 className="text-3xl font-semibold text-white mb-6">
//         Project Dashboard
//       </h1>
//       <p className="text-slate-300">
//         Project data loaded successfully. Now the graph canvas and features are ready.
//       </p>
//       {/* render GraphCanvas component here */}
//     </main>
//   )
// }


'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/lib/store/project-store'
import { PageLoader } from '@/components/loaders'

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
  const upsertNodes = useProjectStore((state) => state.upsertNode)
  const resetStore = useProjectStore((state) => state.reset)

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

        // Reset Zustand store
        resetStore()

        // Populate nodes from project.graph
        project.graph?.nodes?.forEach((node) => upsertNodes(node))

        setLoading(false)
      } catch (err) {
        setError('Failed to fetch project')
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [params.id, resetStore, upsertNodes])

  if (loading) return <PageLoader />
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <main className="p-8">
      <h1 className="text-3xl font-semibold mb-4">Project Details</h1>
      <p className="text-slate-300">Project ID: {params.id}</p>
      {/* Add Graph Canvas here */}
    </main>
  )
}
