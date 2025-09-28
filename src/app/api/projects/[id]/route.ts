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

    // Fetch the project
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error || !project) {
      return NextResponse.json({ error: error?.message || 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ project }) // wrap project in an object
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
