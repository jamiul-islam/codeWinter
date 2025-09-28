'use client'

import { useEffect } from 'react'

import { useProjectStore, type FeatureNodeState } from '@/lib/store'

const demoNodes: FeatureNodeState[] = [
  {
    id: 'project-intake',
    position: { x: 0, y: 0 },
    data: { label: 'Project Intake' },
    status: 'ready',
  },
  {
    id: 'graph-orchestrator',
    position: { x: 220, y: 60 },
    data: { label: 'Graph Orchestrator' },
    status: 'generating',
  },
  {
    id: 'prd-writer',
    position: { x: 440, y: 0 },
    data: { label: 'PRD Writer' },
    status: 'idle',
  },
]

export function GraphSeed() {
  const reset = useProjectStore((state) => state.reset)
  const upsertNode = useProjectStore((state) => state.upsertNode)

  useEffect(() => {
    reset()
    demoNodes.forEach((node) => upsertNode(node))
  }, [reset, upsertNode])

  return null
}
