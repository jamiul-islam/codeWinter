import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase/server'

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

    // Fetch all features for this project
    const { data: features, error: featuresError } = await supabase
      .from('features')
      .select('id, title, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (featuresError) {
      return NextResponse.json(
        { error: featuresError.message },
        { status: 500 }
      )
    }

    if (!features || features.length === 0) {
      return NextResponse.json({ features: [] })
    }

    // Fetch PRDs for these features
    const featureIds = features.map((f) => f.id)
    const { data: prds, error: prdsError } = await supabase
      .from('feature_prds')
      .select('id, feature_id, status, summary, error, updated_at')
      .in('feature_id', featureIds)

    if (prdsError) {
      console.error('Error fetching PRDs:', prdsError)
      // Continue without PRDs rather than failing
    }

    // Create a map of PRDs by feature_id for quick lookup
    const prdsByFeatureId = new Map()
    if (prds) {
      prds.forEach((prd) => {
        prdsByFeatureId.set(prd.feature_id, prd)
      })
    }

    // Combine features with their PRDs
    const featuresWithPrds = features.map((feature) => ({
      id: feature.id,
      title: feature.title,
      prd: prdsByFeatureId.get(feature.id) || null,
    }))

    return NextResponse.json({ features: featuresWithPrds })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch PRD count'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
