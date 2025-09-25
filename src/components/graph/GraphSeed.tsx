'use client'

import { useEffect } from 'react'

import { useProjectStore } from '@/lib/store'

const demoNodes = [
  { id: 'project-intake', title: 'Project Intake', status: 'ready' as const },
  {
    id: 'graph-orchestrator',
    title: 'Graph Orchestrator',
    status: 'generating' as const,
  },
  { id: 'prd-writer', title: 'PRD Writer', status: 'idle' as const },
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
