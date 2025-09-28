export type ProjectNodeType = 'appCard' | 'featureHub' | 'featureNode'

export type PersistedGraphNode = {
  id: string
  type: ProjectNodeType
  position: { x: number; y: number }
  data: Record<string, unknown>
  draggable?: boolean
}

export type PersistedGraphEdge = {
  id: string
  source: string
  target: string
  type?: string
  label?: string
  data?: Record<string, unknown>
  animated?: boolean
}

export type ProjectGraphMeta = {
  version: string
  generatedAt: string
  model: string | null
  droppedEdges: number
  usedFallback: boolean
}

export type PersistedGraphPayload = {
  nodes: PersistedGraphNode[]
  edges: PersistedGraphEdge[]
  meta: ProjectGraphMeta
}
