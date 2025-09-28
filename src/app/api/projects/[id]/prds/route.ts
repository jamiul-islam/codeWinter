import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: projectId } = await context.params

  try {
    const supabase = await getServerSupabaseClient()

    // Ensure user is authenticated
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Count PRDs linked to features in this project
    const { count, error } = await supabase
      .from('feature_prds')
      .select('id, features!inner(project_id)', { count: 'exact', head: true })
      .eq('features.project_id', projectId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ count: count || 0 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch PRD count'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
