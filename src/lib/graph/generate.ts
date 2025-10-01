import { z } from 'zod'
import type { SupabaseClient } from '@supabase/supabase-js'

import {
  GeminiKeyMissingError,
  getDecryptedUserGeminiKey,
} from '@/lib/gemini/server'
import { GeminiService } from '@/lib/services/GeminiService'
import type {
  PersistedGraphEdge,
  PersistedGraphNode,
  PersistedGraphPayload,
  JsonRecord,
} from '@/lib/graph/types'
import type { Database, Tables, Json } from '@/lib/supabase/types'

// Model is now handled by GeminiService

const systemPrompt = `You are an expert software architect generating a minimal, coherent feature graph for an MVP product.
Respond with valid JSON only. Do not include markdown fences.
Use the feature IDs provided in the input without modification.`

const graphResponseSchema = z.object({
  nodes: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        note: z.string().optional(),
        group: z.string().optional(),
        rank: z.number().int().optional(),
      })
    )
    .default([]),
  edges: z
    .array(
      z.object({
        source: z.string().min(1),
        target: z.string().min(1),
        note: z.string().optional(),
        type: z.string().optional(),
      })
    )
    .default([]),
  layout: z
    .object({
      algorithm: z.string().optional(),
      hints: z
        .array(
          z.object({
            id: z.string(),
            rank: z.number().int().optional(),
            lane: z.number().int().optional(),
          })
        )
        .optional(),
    })
    .partial()
    .optional(),
})

type GraphResponse = z.infer<typeof graphResponseSchema>

type FeatureRow = Tables<'features'>
type ProjectRow = Tables<'projects'>

type NormalizedFeature = {
  id: string
  title: string
  note?: string
  rank?: number
}

type NormalizedEdge = {
  source: string
  target: string
  note?: string
}

type NormalizedGraph = {
  nodes: NormalizedFeature[]
  edges: NormalizedEdge[]
  droppedEdges: number
  usedFallback: boolean
  model: string | null
}

function buildUserPrompt(project: ProjectRow, features: FeatureRow[]) {
  const featureList = features
    .map(
      (feature) =>
        `- {"id":"${feature.id}","title":${JSON.stringify(feature.title)}}`
    )
    .join('\n')

  return `Project: ${project.name}\nDescription: ${project.description}\n\nFeatures (use the EXACT ids when returning nodes/edges):\n${featureList}\n\nTask:\n1) Group related features if useful.\n2) Suggest directed edges showing dependencies or data flow (source -> target).\n3) Provide concise labels.\n4) Add a short note describing each edge.\n\nReturn JSON: {"nodes":[{"id":"featureId","label":"...","note":"..."}],"edges":[{"source":"featureId","target":"featureId","note":"..."}],"layout":{"algorithm":"dagre","hints":[{"id":"featureId","rank":0}]}}`
}

async function callGeminiGraph(
  apiKey: string,
  project: ProjectRow,
  features: FeatureRow[]
  // signal?: AbortSignal
): Promise<GraphResponse> {
  // Create Gemini service instance
  const geminiService = new GeminiService(apiKey)

  // Add system instruction and user prompt
  geminiService.addSystemInstruction(systemPrompt)
  geminiService.addUserPrompt(buildUserPrompt(project, features))

  // Generate content
  const text = await geminiService.generateContent()

  if (!text) {
    throw new Error('Gemini response did not include text content')
  }

  return graphResponseSchema.parse(parseJsonText(text))
}

function parseJsonText(text: string): unknown {
  const trimmed = text.trim()

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fencedMatch) {
    return parseJsonText(fencedMatch[1])
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    const firstBrace = trimmed.indexOf('{')
    const lastBrace = trimmed.lastIndexOf('}')
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = trimmed.slice(firstBrace, lastBrace + 1)
      return JSON.parse(candidate)
    }
    throw new Error('Unable to parse JSON from Gemini response')
  }
}

function normalizeGraph(
  raw: GraphResponse,
  features: FeatureRow[],
  fallback = false
): NormalizedGraph {
  const featureMap = new Map(features.map((feature) => [feature.id, feature]))
  const titleMap = new Map(
    features.map((feature) => [feature.title.toLowerCase(), feature])
  )

  const nodes: NormalizedFeature[] = features.map((feature) => {
    const candidate = raw.nodes.find((node) => node.id === feature.id)
    const fallbackByLabel = raw.nodes.find(
      (node) => node.label?.toLowerCase() === feature.title.toLowerCase()
    )

    const chosen = candidate ?? fallbackByLabel

    return {
      id: feature.id,
      title: chosen?.label?.trim() || feature.title,
      note: chosen?.note,
      rank: chosen?.rank,
    }
  })

  let droppedEdges = 0

  const edges = raw.edges.reduce<NormalizedEdge[]>((acc, edge) => {
    const source = resolveFeatureId(edge.source, featureMap, titleMap)
    const target = resolveFeatureId(edge.target, featureMap, titleMap)

    if (!source || !target || source === target) {
      droppedEdges += 1
      return acc
    }

    acc.push({
      source,
      target,
      note: edge.note,
    })
    return acc
  }, [])

  return {
    nodes,
    edges,
    droppedEdges,
    usedFallback: fallback,
    model: fallback ? null : 'gemini-2.0-flash',
  }
}

function resolveFeatureId(
  key: string,
  featureMap: Map<string, FeatureRow>,
  titleMap: Map<string, FeatureRow>
): string | null {
  if (featureMap.has(key)) return key
  const keyTrimmed = key.trim().toLowerCase()
  const labelMatch = titleMap.get(keyTrimmed)
  if (labelMatch) return labelMatch.id
  return null
}

function computeFeaturePositions(count: number) {
  if (count === 0) return []
  const spacing = 160
  const startY = -((count - 1) * spacing) / 2
  const baseX = 240
  return Array.from({ length: count }, (_, index) => ({
    x: baseX,
    y: startY + index * spacing,
  }))
}

function buildPersistedGraph(
  project: ProjectRow,
  normalized: NormalizedGraph,
  features: FeatureRow[]
): {
  graph: PersistedGraphPayload
  featurePositions: Record<string, { x: number; y: number }>
} {
  const featurePositions = computeFeaturePositions(features.length)

  const appNodeId = `project:${project.id}`
  const hubNodeId = `feature-hub:${project.id}`

  const centerY =
    featurePositions.length > 0
      ? featurePositions[Math.floor(featurePositions.length / 2)].y
      : 0

  const appNode: PersistedGraphNode = {
    id: appNodeId,
    type: 'appCard',
    position: { x: -320, y: centerY - 40 },
    draggable: false,
    data: {
      kind: 'app',
      name: project.name,
      description: truncate(project.description, 240),
    },
  }

  const hubNode: PersistedGraphNode = {
    id: hubNodeId,
    type: 'featureHub',
    position: { x: -40, y: centerY - 20 },
    draggable: false,
    data: {
      kind: 'feature-hub',
      projectName: project.name,
      featureCount: features.length,
    },
  }

  const featureNodes: PersistedGraphNode[] = normalized.nodes.map(
    (node, index) => {
      const featureData: JsonRecord = {
        kind: 'feature',
        featureId: node.id,
        title: node.title,
        note: node.note ?? null,
        status: 'idle',
        order: index,
      }

      return {
        id: node.id,
        type: 'featureNode',
        position: featurePositions[index] ?? { x: 240, y: index * 160 },
        data: featureData,
      }
    }
  )

  const graphNodes = [appNode, hubNode, ...featureNodes]

  const baseEdges: PersistedGraphEdge[] = [
    {
      id: `${appNodeId}->${hubNodeId}`,
      source: appNodeId,
      target: hubNodeId,
      type: 'smoothstep',
      data: { kind: 'app-hub' },
      animated: false,
      label: 'Project overview',
    },
    ...featureNodes.map((node, index) => ({
      id: `${hubNodeId}->${node.id}`,
      source: hubNodeId,
      target: node.id,
      type: 'smoothstep',
      data: {
        kind: 'hub-feature',
        note: normalized.nodes[index]?.note ?? null,
      },
      label: normalized.nodes[index]?.note
        ? truncate(normalized.nodes[index]?.note ?? '', 48)
        : undefined,
    })),
  ]

  const dependencyEdges: PersistedGraphEdge[] = normalized.edges.map(
    (edge, index) => ({
      id: `dep-${edge.source}-${edge.target}-${index}`,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      data: {
        kind: 'dependency',
        note: edge.note ?? null,
      },
      label: edge.note ? truncate(edge.note, 56) : undefined,
    })
  )

  const graph: PersistedGraphPayload = {
    nodes: graphNodes,
    edges: [...baseEdges, ...dependencyEdges],
    meta: {
      version: 'e4.graph.v1',
      generatedAt: new Date().toISOString(),
      model: normalized.model,
      droppedEdges: normalized.droppedEdges,
      usedFallback: normalized.usedFallback,
    },
  }

  const featurePositionMap: Record<string, { x: number; y: number }> = {}
  featureNodes.forEach((node, index) => {
    featurePositionMap[node.id] = featurePositions[index] ?? node.position
  })

  return { graph, featurePositions: featurePositionMap }
}

export interface GenerateGraphOptions {
  supabase: SupabaseClient<Database>
  project: ProjectRow
  features: FeatureRow[]
  userId: string
  signal?: AbortSignal
}

export async function generateAndPersistProjectGraph({
  supabase,
  project,
  features,
  userId,
}: GenerateGraphOptions) {
  if (features.length === 0) {
    throw new Error('Cannot generate graph without features')
  }

  let normalized: NormalizedGraph

  try {
    const apiKey = await getDecryptedUserGeminiKey(supabase, userId)
    const geminiGraph = await callGeminiGraph(apiKey, project, features)
    normalized = normalizeGraph(geminiGraph, features)
  } catch (error) {
    if (!(error instanceof GeminiKeyMissingError)) {
      console.error('Gemini graph generation failed, falling back', error)
    }
    normalized = normalizeGraph({ nodes: [], edges: [] }, features, true)
  }

  const { graph, featurePositions } = buildPersistedGraph(
    project,
    normalized,
    features
  )

  const graphJson = graph as unknown as Json

  const { error: projectUpdateError } = await supabase
    .from('projects')
    .update({ graph: graphJson })
    .eq('id', project.id)
  if (projectUpdateError) {
    throw projectUpdateError
  }

  await persistFeaturePositions(supabase, featurePositions)
  await persistFeatureEdges(supabase, project.id, normalized.edges)

  await supabase.from('audit_logs').insert({
    user_id: userId,
    project_id: project.id,
    action: 'graph.generate',
    payload: {
      model: normalized.model,
      droppedEdges: normalized.droppedEdges,
      usedFallback: normalized.usedFallback,
      featureCount: features.length,
      edgeCount: normalized.edges.length,
    },
  })

  return { graph, normalized }
}

async function persistFeaturePositions(
  supabase: SupabaseClient<Database>,
  positions: Record<string, { x: number; y: number }>
) {
  const entries = Object.entries(positions)
  for (const [featureId, position] of entries) {
    const { error } = await supabase
      .from('features')
      .update({ position })
      .eq('id', featureId)
    if (error) {
      console.error('Failed to persist feature position', featureId, error)
      throw error
    }
  }
}

async function persistFeatureEdges(
  supabase: SupabaseClient<Database>,
  projectId: string,
  edges: NormalizedEdge[]
) {
  const { error: deleteError } = await supabase
    .from('feature_edges')
    .delete()
    .eq('project_id', projectId)
  if (deleteError) {
    throw deleteError
  }

  if (!edges.length) return

  const inserts = edges.map((edge) => ({
    project_id: projectId,
    source_feature_id: edge.source,
    target_feature_id: edge.target,
    metadata: edge.note ? { note: edge.note } : null,
  }))

  const { error: insertError } = await supabase
    .from('feature_edges')
    .insert(inserts)
  if (insertError) {
    throw insertError
  }
}

function truncate(value: string, length: number) {
  if (value.length <= length) return value
  const suffix = '...'
  if (length <= suffix.length) {
    return value.slice(0, length)
  }
  return `${value.slice(0, length - suffix.length)}${suffix}`
}
