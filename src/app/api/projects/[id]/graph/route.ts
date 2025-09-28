import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase/server'

type GraphUpdatePayload = {
  nodes: unknown
  edges: unknown
}

type SanitizedNode = {
  id: string
  type?: string
  position?: { x: number; y: number }
  data?: unknown
  draggable?: boolean
}

type SanitizedEdge = {
  id: string
  source: string
  target: string
  type?: string
  label?: string
  data?: unknown
  animated?: boolean
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: projectId } = await context.params

  try {
    const supabase = await getServerSupabaseClient()

    // Check user authentication
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const body: GraphUpdatePayload = await req.json()
    const { nodes, edges } = body

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      return NextResponse.json({ error: 'Invalid nodes or edges format' }, { status: 400 })
    }

    const sanitizedNodes = nodes.map(sanitizeNode)
    const sanitizedEdges = edges.map(sanitizeEdge)

    await supabase
      .from('projects')
      .update({ graph: { nodes: sanitizedNodes, edges: sanitizedEdges } })
      .eq('id', projectId)

    const featureUpdates = sanitizedNodes
      .map((node) => {
        if (!node?.data || typeof node.data !== 'object') return null
        const data = node.data as Record<string, unknown>
        if (data.kind !== 'feature') return null
        const featureId = typeof data.featureId === 'string' ? data.featureId : node.id
        if (!featureId || typeof featureId !== 'string') return null
        if (!node.position) return null
        return { id: featureId, position: node.position }
      })
      .filter((entry): entry is { id: string; position: { x: number; y: number } } => Boolean(entry))

    for (const update of featureUpdates) {
      const { error: updateError } = await supabase
        .from('features')
        .update({ position: update.position })
        .eq('id', update.id)
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update project graph'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function sanitizeNode(node: unknown): SanitizedNode {
  if (!node || typeof node !== 'object') {
    return { id: '' }
  }
  const raw = node as Record<string, unknown>
  const idValue = raw.id
  return {
    id: typeof idValue === 'string' ? idValue : String(idValue ?? ''),
    type: typeof raw.type === 'string' ? raw.type : undefined,
    position: sanitizePosition(raw.position),
    data: sanitizeData(raw.data),
    draggable: typeof raw.draggable === 'boolean' ? raw.draggable : undefined,
  }
}

function sanitizeEdge(edge: unknown): SanitizedEdge {
  if (!edge || typeof edge !== 'object') {
    return { id: '', source: '', target: '' }
  }
  const raw = edge as Record<string, unknown>
  const idValue = raw.id
  return {
    id: typeof idValue === 'string' ? idValue : String(idValue ?? ''),
    source: String(raw.source ?? ''),
    target: String(raw.target ?? ''),
    type: typeof raw.type === 'string' ? raw.type : undefined,
    label: typeof raw.label === 'string' ? raw.label : undefined,
    data: sanitizeData(raw.data),
    animated: typeof raw.animated === 'boolean' ? raw.animated : undefined,
  }
}

function sanitizePosition(position: unknown) {
  if (!position || typeof position !== 'object') return undefined
  const raw = position as Record<string, unknown>
  const x = Number(raw.x)
  const y = Number(raw.y)
  if (Number.isNaN(x) || Number.isNaN(y)) return undefined
  return { x, y }
}

function sanitizeData(data: unknown): Record<string, unknown> | undefined {
  if (data == null || typeof data !== 'object') return undefined
  const result: Record<string, unknown> = {}
  Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
    if (typeof value === 'function') return
    if (value == null) {
      result[key] = value
      return
    }
    if (Array.isArray(value)) {
      result[key] = value
        .map((item) => (typeof item === 'function' ? null : item))
        .filter((item) => item !== undefined)
      return
    }
    if (typeof value === 'object') {
      const nested = sanitizeData(value)
      if (nested !== undefined) {
        result[key] = nested
      }
      return
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      result[key] = value
    }
  })
  return result
}
