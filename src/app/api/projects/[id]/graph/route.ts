import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id

  try {
    const supabase = await getServerSupabaseClient()

    // Check user authentication
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const body = await req.json()
    const { nodes, edges } = body

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      return NextResponse.json({ error: 'Invalid nodes or edges format' }, { status: 400 })
    }

    // Update the project graph
    const { data, error } = await supabase
      .from('projects')
      .update({ graph: { nodes, edges } })
      .eq('id', projectId)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Failed to update graph' }, { status: 400 })
    }

    return NextResponse.json({ success: true, project: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
