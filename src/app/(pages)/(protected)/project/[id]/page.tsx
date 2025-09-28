'use client'

import { useEffect, useState, useCallback, use } from 'react'
import type { Edge, Node } from 'reactflow'

import { useProjectStore, type FeatureNodeState } from '@/lib/store/project-store'
import { PageLoader } from '@/components/loaders'
import { GraphCanvas } from '@/components/graph'

interface Project {
  id: string
  name: string
  description?: string | null
  graph: ProjectGraph | null
  created_at: string
  updated_at: string
}

type StoredNode = FeatureNodeState | (Partial<FeatureNodeState> & Node)

type ProjectGraph = {
  nodes?: StoredNode[]
  edges?: Edge[]
}

type ProjectResponse = {
  project: Project
}

type ErrorResponse = {
  error?: string
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const resetStore = useProjectStore((state) => state.reset)
  const upsertNode = useProjectStore((state) => state.upsertNode)
  const resetEdges = useProjectStore((state) => state.resetEdges)
  const addEdgeToStore = useProjectStore((state) => state.addEdge)
  const setCurrentProjectId = useProjectStore((state) => state.setCurrentProjectId)

  const fetchProjectData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/projects/${id}`)
      const data = (await res.json()) as ProjectResponse | ErrorResponse

      if (!res.ok || !('project' in data)) {
        const message = 'error' in data && data.error ? data.error : 'Failed to fetch project'
        setError(message)
        setLoading(false)
        return
      }

      const project = data.project

      setCurrentProjectId(project.id)
      resetStore()
      resetEdges()

      const graph = project.graph
      if (graph && Array.isArray(graph.nodes)) {
        graph.nodes.forEach((node) => {
          const nodeWithStatus: FeatureNodeState = {
            status: 'idle',
            ...node,
          }
          upsertNode(nodeWithStatus)
        })
      }
      if (graph && Array.isArray(graph.edges)) {
        graph.edges.forEach((edge) => addEdgeToStore(edge))
      }

      setLoading(false)
    } catch {
      setError('Failed to fetch project')
      setLoading(false)
    }
  }, [id, resetStore, resetEdges, upsertNode, addEdgeToStore, setCurrentProjectId])

  useEffect(() => {
    fetchProjectData()
    return () => {
      resetStore()
      resetEdges()
      setCurrentProjectId(null)
    }
  }, [fetchProjectData, resetStore, resetEdges, setCurrentProjectId])

  if (loading) return <PageLoader />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={fetchProjectData}
          className="px-4 py-2 rounded-lg bg-slate-800 text-slate-100 hover:bg-slate-700 transition"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-semibold mb-4">Project Graph</h1>
      <p className="text-slate-300 mb-6">Project ID: {id}</p>

      <div className="w-full h-[600px] rounded-xl border border-white/10 bg-white/5 p-4">
        <GraphCanvas />
      </div>
    </main>
  )
}
