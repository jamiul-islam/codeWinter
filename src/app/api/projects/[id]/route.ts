import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
  }

  try {
    const supabase = await getServerSupabaseClient() // get server client

    // Fetch project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (projectError || !projectData) {
      return NextResponse.json(
        { error: projectError?.message || 'Project not found' },
        { status: 404 }
      )
    }

    // Fetch features
    const { data: featuresData, error: featuresError } = await supabase
      .from('features')
      .select('*')
      .eq('project_id', id)

    if (featuresError) {
      return NextResponse.json({ error: featuresError.message }, { status: 500 })
    }

    return NextResponse.json({
      ...projectData,
      features: featuresData || [],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
