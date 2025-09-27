'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useProjectStore, FeatureNodeState } from '@/lib/store/project-store'

interface Feature {
  id: string
  title: string
  graphPlaceholder?: any // ✅ made optional
}

interface Project {
  id: string
  name: string
  description?: string
  features: Feature[]
  updatedAt: string
}

export default function ProjectPage() {
  const { id } = useParams() // dynamic project ID
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectName, setProjectName] = useState<string>('')

  // Zustand store for nodes (features)
  const nodes = useProjectStore((state) => state.nodes)
  const resetNodes = useProjectStore((state) => state.reset)
  const upsertNode = useProjectStore((state) => state.upsertNode)
  const selectNode = useProjectStore((state) => state.selectNode)

  useEffect(() => {
    if (!id) return

    const fetchProject = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/projects/${id}`)
        if (!res.ok) throw new Error('Failed to fetch project')

        const data: Project = await res.json()

        // Reset nodes before populating
        resetNodes()

        // Populate nodes from features + graph placeholders
        data.features.forEach((feature) => {
          const node: FeatureNodeState = {
            id: feature.id,
            title: feature.title,
            status: 'idle',
            graphPlaceholder: feature.graphPlaceholder ?? null, // ✅ now valid
          }
          upsertNode(node)
        })

        // Optionally select the first node
        if (data.features.length > 0) selectNode(data.features[0].id)

        setProjectName(data.name)
        setLoading(false)
      } catch (err: any) {
        setError(err.message || 'Something went wrong')
        setLoading(false)
      }
    }

    fetchProject()
  }, [id, resetNodes, upsertNode, selectNode])

  if (loading) return <div className="p-6 text-gray-500">Loading project...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Project: {projectName}</h1>
      {nodes.length === 0 ? (
        <p className="text-gray-500">No features found for this project.</p>
      ) : (
        <div className="space-y-2">
          {nodes.map((node) => (
            <div key={node.id} className="p-3 border rounded shadow">
              <h2 className="font-semibold">{node.title}</h2>
              <p>Status: {node.status}</p>
              {/* ✅ Show placeholder info if available */}
              {node.graphPlaceholder && (
                <pre className="text-xs text-gray-400">
                  {JSON.stringify(node.graphPlaceholder, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
