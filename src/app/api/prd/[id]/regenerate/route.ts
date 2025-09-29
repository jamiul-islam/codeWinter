import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: prdId } = await params
    const supabase = await getServerSupabaseClient()

    // Ensure user is authenticated
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = userData.user.id

    // Get PRD and verify ownership
    const { data: prd, error: prdError } = await supabase
      .from('feature_prds')
      .select(`
        *,
        features!inner(
          id,
          project_id,
          projects!inner(
            id,
            user_id
          )
        )
      `)
      .eq('id', prdId)
      .single()

    if (prdError || !prd) {
      return NextResponse.json({ error: 'PRD not found' }, { status: 404 })
    }

    // Verify user owns the project
    const project = (prd.features as any).projects
    if (project.user_id !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Call the generate API with regenerate flag
    const generateResponse = await fetch(
      new URL('/api/prd/generate', req.url),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.get('Authorization') || '',
          'Cookie': req.headers.get('Cookie') || '',
        },
        body: JSON.stringify({
          featureId: prd.feature_id,
          projectId: (prd.features as any).project_id,
          regenerate: true,
        }),
      }
    )

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json()
      return NextResponse.json(errorData, { status: generateResponse.status })
    }

    const result = await generateResponse.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('PRD regeneration failed:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}