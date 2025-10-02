import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { generateAndPersistProjectGraph } from '@/lib/graph/generate'
import { getServerSupabaseClient } from '@/lib/supabase/server'

const featureInputSchema = z.object({
  featureId: z.string().uuid().optional(),
  title: z.string().min(3, 'Each feature must be at least 3 characters'),
})

const projectUpdateSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  features: z
    .array(featureInputSchema)
    .min(5, 'At least 5 features are required')
    .max(10, 'No more than 10 features allowed'),
})

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await context.params

  try {
    const supabase = await getServerSupabaseClient()

    // Ensure user is authenticated
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user?.id) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error || !project) {
      return NextResponse.json(
        { error: error?.message || 'Project not found' },
        { status: 404 }
      )
    }

    const { data: features, error: featuresError } = await supabase
      .from('features')
      .select('id, title, notes, position, feature_prds ( status )')
      .eq('project_id', projectId)

    if (featuresError) {
      return NextResponse.json(
        { error: featuresError.message },
        { status: 500 }
      )
    }

    const { data: featureEdges, error: edgesError } = await supabase
      .from('feature_edges')
      .select('id, source_feature_id, target_feature_id, metadata')
      .eq('project_id', projectId)

    if (edgesError) {
      return NextResponse.json({ error: edgesError.message }, { status: 500 })
    }

    return NextResponse.json({
      project,
      features: features ?? [],
      edges: featureEdges ?? [],
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await context.params

  try {
    const payload = await req.json()
    const body = projectUpdateSchema.parse(payload)

    const supabase = await getServerSupabaseClient()
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user?.id) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .update({
        name: body.name.trim(),
        description: body.description.trim(),
      })
      .eq('id', projectId)
      .select('*')
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: projectError?.message || 'Project not found' },
        { status: 404 }
      )
    }

    const { data: existingFeatures, error: existingFeaturesError } =
      await supabase
        .from('features')
        .select('id, title')
        .eq('project_id', projectId)

    if (existingFeaturesError) {
      return NextResponse.json(
        { error: existingFeaturesError.message },
        { status: 500 }
      )
    }

    const existingMap = new Map(
      existingFeatures?.map((feature) => [feature.id, feature])
    )
    const seenIds = new Set<string>()

    const updates: Array<{ id: string; title: string }> = []
    const newFeatures: Array<{ project_id: string; title: string }> = []

    body.features.forEach((feature) => {
      const trimmedTitle = feature.title.trim()
      if (feature.featureId && existingMap.has(feature.featureId)) {
        const current = existingMap.get(feature.featureId)!
        seenIds.add(feature.featureId)
        if (current.title !== trimmedTitle) {
          updates.push({ id: feature.featureId, title: trimmedTitle })
        }
      } else {
        newFeatures.push({ project_id: projectId, title: trimmedTitle })
      }
    })

    const deletions =
      existingFeatures
        ?.filter((feature) => !seenIds.has(feature.id))
        .map((feature) => feature.id) ?? []

    if (updates.length) {
      for (const update of updates) {
        const { error } = await supabase
          .from('features')
          .update({ title: update.title })
          .eq('id', update.id)
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 })
        }
      }
    }

    if (newFeatures.length) {
      const { error } = await supabase.from('features').insert(newFeatures)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    if (deletions.length) {
      const { error } = await supabase
        .from('features')
        .delete()
        .in('id', deletions)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    const { data: updatedFeatures, error: refreshedFeaturesError } =
      await supabase.from('features').select('*').eq('project_id', projectId)

    if (refreshedFeaturesError || !updatedFeatures) {
      return NextResponse.json(
        {
          error:
            refreshedFeaturesError?.message || 'Failed to refresh features',
        },
        { status: 500 }
      )
    }

    await generateAndPersistProjectGraph({
      supabase,
      project: {
        ...project,
        description: project.description ?? body.description.trim(),
      },
      features: updatedFeatures,
      userId: userData.user.id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    const message =
      error instanceof Error ? error.message : 'Failed to update project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await context.params

  try {
    const supabase = await getServerSupabaseClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user?.id) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to delete project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
