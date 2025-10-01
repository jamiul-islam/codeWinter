import { NextRequest, NextResponse } from 'next/server'

import { generateAndPersistProjectGraph } from '@/lib/graph/generate'
import { getServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await context.params

  try {
    const supabase = await getServerSupabaseClient()

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: projectError?.message || 'Project not found' },
        { status: 404 }
      )
    }

    const { data: features, error: featuresError } = await supabase
      .from('features')
      .select('*')
      .eq('project_id', projectId)

    if (featuresError) {
      return NextResponse.json(
        { error: featuresError.message },
        { status: 500 }
      )
    }

    if (!features?.length) {
      return NextResponse.json(
        { error: 'No features found for this project' },
        { status: 400 }
      )
    }

    const { graph, normalized } = await generateAndPersistProjectGraph({
      supabase,
      project,
      features,
      userId,
    })

    return NextResponse.json({ graph, summary: normalized })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to generate graph'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
