import { NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { markdown, featureId } = await request.json()

    if (!markdown) {
      return NextResponse.json(
        { error: 'Markdown content is required' },
        { status: 400 }
      )
    }

    const supabase = await getServerSupabaseClient()

    // Get user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update PRD markdown
    const { data, error } = await supabase
      .from('feature_prds')
      .update({
        prd_md: markdown,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('feature_id', featureId)
      .select()
      .single()

    if (error) {
      console.error('Failed to update PRD:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log audit entry
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      feature_id: featureId,
      action: 'prd_updated',
      payload: { prdId: id },
    })

    return NextResponse.json({ prd: data })
  } catch (error) {
    console.error('PRD update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
