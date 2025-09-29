import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: featureId } = await params
    const supabase = await getServerSupabaseClient()

    // Ensure user is authenticated
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = userData.user.id

    // Verify feature exists and user has access
    const { data: feature, error: featureError } = await supabase
      .from('features')
      .select(`
        id,
        title,
        project_id,
        projects!inner(
          id,
          user_id
        )
      `)
      .eq('id', featureId)
      .single()

    if (featureError || !feature) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 })
    }

    // Verify user owns the project
    const project = (feature.projects as any)
    if (project.user_id !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get PRD for this feature
    const { data: prd, error: prdError } = await supabase
      .from('feature_prds')
      .select('*')
      .eq('feature_id', featureId)
      .single()

    if (prdError) {
      if (prdError.code === 'PGRST116') { // No rows returned
        return NextResponse.json({ error: 'PRD not found' }, { status: 404 })
      }
      throw prdError
    }

    // Return PRD data
    return NextResponse.json({
      id: prd.id,
      status: prd.status,
      summary: prd.summary,
      prdMd: prd.prd_md,
      prdJson: prd.prd_json,
      error: prd.error,
      lastGenerated: prd.generated_at,
    })

  } catch (error) {
    console.error('Failed to fetch PRD:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}