import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
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

    // Get PRD with project and feature info
    const { data: prd, error: prdError } = await supabase
      .from('feature_prds')
      .select(`
        *,
        features!inner(
          id,
          title,
          project_id,
          projects!inner(
            id,
            name,
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
    const feature = prd.features as any
    const project = feature.projects
    if (project.user_id !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if PRD is ready
    if (prd.status !== 'ready' || !prd.prd_md) {
      return NextResponse.json({ 
        error: 'PRD is not ready for download' 
      }, { status: 400 })
    }

    // Generate deterministic filename: {project_name}__{feature_title}.md
    const sanitizeFilename = (str: string) => 
      str.replace(/[^a-zA-Z0-9\-_]/g, '_').replace(/_+/g, '_')
    
    const filename = `${sanitizeFilename(project.name)}__${sanitizeFilename(feature.title)}.md`

    // Log download action
    await supabase.from('audit_logs').insert({
      user_id: userId,
      project_id: project.id,
      feature_id: feature.id,
      action: 'prd_downloaded',
      payload: { prdId, filename },
    })

    // Return file with proper headers
    return new NextResponse(prd.prd_md, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('PRD download failed:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}