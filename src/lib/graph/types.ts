import type { Json } from '@/lib/supabase/types'

export type ProjectNodeType = 'appCard' | 'featureHub' | 'featureNode'

export type JsonRecord = { [key: string]: Json | undefined }

export type PersistedGraphNode = {
  id: string
  type: ProjectNodeType
  position: { x: number; y: number }
  data?: JsonRecord
  draggable?: boolean
}

export type PersistedGraphEdge = {
  id: string
  source: string
  target: string
  type?: string
  label?: string
  data?: JsonRecord
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
