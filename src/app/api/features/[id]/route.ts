import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { featureTitleSchema } from '@/lib/schemas/feature'
import type { PersistedGraphPayload } from '@/lib/graph/types'
import type { Json } from '@/lib/supabase/types'
import { getServerSupabaseClient } from '@/lib/supabase/server'

const renameSchema = z.object({ title: featureTitleSchema })

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: featureId } = await context.params

  try {
    const payload = await req.json()
    const body = renameSchema.parse(payload)

    const supabase = await getServerSupabaseClient()
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { data: feature, error: featureError } = await supabase
      .from('features')
      .select('id, project_id, title')
      .eq('id', featureId)
      .single()

    if (featureError || !feature) {
      return NextResponse.json({ error: featureError?.message || 'Feature not found' }, { status: 404 })
    }

    const { data: updatedFeature, error: updateError } = await supabase
      .from('features')
      .update({ title: body.title })
      .eq('id', featureId)
      .select('id, project_id, title')
      .single()

    if (updateError || !updatedFeature) {
      return NextResponse.json({ error: updateError?.message || 'Unable to update feature' }, { status: 400 })
    }

    await updateProjectGraphTitle(supabase, feature.project_id, featureId, body.title)

    await supabase.from('audit_logs').insert({
      user_id: userData.user.id,
      project_id: feature.project_id,
      feature_id: featureId,
      action: 'feature.rename',
      payload: {
        previousTitle: feature.title,
        nextTitle: body.title,
      },
    })

    return NextResponse.json({ feature: updatedFeature })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }

    const message = error instanceof Error ? error.message : 'Failed to rename feature'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: featureId } = await context.params

  try {
    const supabase = await getServerSupabaseClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { data: feature, error: featureError } = await supabase
      .from('features')
      .select('id, project_id, title')
      .eq('id', featureId)
      .single()

    if (featureError || !feature) {
      return NextResponse.json({ error: featureError?.message || 'Feature not found' }, { status: 404 })
    }

    const { error: deleteError } = await supabase
      .from('features')
      .delete()
      .eq('id', featureId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    await pruneProjectGraphAfterDeletion(supabase, feature.project_id, featureId)

    await supabase.from('audit_logs').insert({
      user_id: userData.user.id,
      project_id: feature.project_id,
      feature_id: featureId,
      action: 'feature.delete',
      payload: { title: feature.title },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete feature'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

async function updateProjectGraphTitle(
  supabase: Awaited<ReturnType<typeof getServerSupabaseClient>>,
  projectId: string,
  featureId: string,
  title: string,
) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('graph')
    .eq('id', projectId)
    .single()

  if (error || !project?.graph) return

  if (!project.graph) return

  const graph = structuredClone(project.graph) as PersistedGraphPayload
  if (!Array.isArray(graph.nodes)) return

  const updatedNodes = graph.nodes.map((node) => {
    if (node.id !== featureId) return node
    const nextData = {
      ...(node.data ?? {}),
      title,
    }
    return { ...node, data: nextData }
  })

  const nextGraph: PersistedGraphPayload = {
    ...graph,
    nodes: updatedNodes,
  }

  await supabase
    .from('projects')
    .update({ graph: nextGraph as unknown as Json })
    .eq('id', projectId)
}

async function pruneProjectGraphAfterDeletion(
  supabase: Awaited<ReturnType<typeof getServerSupabaseClient>>,
  projectId: string,
  featureId: string,
) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('graph')
    .eq('id', projectId)
    .single()

  if (error || !project?.graph) return

  const graph = structuredClone(project.graph) as PersistedGraphPayload
  const nodes = Array.isArray(graph.nodes) ? graph.nodes : []
  const edges = Array.isArray(graph.edges) ? graph.edges : []

  const filteredNodes = nodes.filter((node) => node.id !== featureId)
  const filteredEdges = edges.filter(
    (edge) => edge.source !== featureId && edge.target !== featureId
  )

  const { count } = await supabase
    .from('features')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId)

  const adjustedNodes = filteredNodes.map((node) => {
    if ((node.data?.kind as string | undefined) !== 'feature-hub') return node
    const existingCount = Number((node.data as Record<string, unknown> | undefined)?.featureCount ?? 0)
    const nextData = {
      ...(node.data ?? {}),
      featureCount: typeof count === 'number' ? count : Math.max(0, existingCount - 1),
    }
    return { ...node, data: nextData }
  })

  const nextGraph: PersistedGraphPayload = {
    ...graph,
    nodes: adjustedNodes,
    edges: filteredEdges,
  }

  await supabase
    .from('projects')
    .update({ graph: nextGraph as unknown as Json })
    .eq('id', projectId)
}
