import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase/server'
import { prdGenerateSchema } from '@/lib/schemas/prd'
import {
  buildPrdContext,
  optimizeContextForTokenLimit,
} from '@/lib/graph/context-builder'
import { generatePrd } from '@/lib/gemini/prd-generator'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = prdGenerateSchema.parse(body)
    const { featureId, projectId, regenerate } = validatedData

    const supabase = await getServerSupabaseClient()

    // Ensure user is authenticated
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = userData.user.id

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Get user's Gemini API key
    const { data: userSettings, error: settingsError } = await supabase
      .from('user_settings')
      .select('gemini_api_key')
      .eq('user_id', userId)
      .single()

    if (settingsError || !userSettings?.gemini_api_key) {
      return NextResponse.json(
        {
          error:
            'Gemini API key not configured. Please add your API key in settings.',
        },
        { status: 400 }
      )
    }

    // Check if PRD already exists
    const { data: existingPrd, error: prdCheckError } = await supabase
      .from('feature_prds')
      .select('id, status')
      .eq('feature_id', featureId)
      .single()

    if (prdCheckError && prdCheckError.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Error checking existing PRD:', prdCheckError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    let prdId: string

    if (existingPrd) {
      if (existingPrd.status === 'generating') {
        return NextResponse.json({
          success: true,
          prdId: existingPrd.id,
          status: 'generating',
        })
      }

      if (!regenerate && existingPrd.status === 'ready') {
        return NextResponse.json({
          success: true,
          prdId: existingPrd.id,
          status: 'ready',
        })
      }

      // If regenerating, move existing PRD to versions table
      if (regenerate && existingPrd.status === 'ready') {
        await moveToVersionsTable(supabase, existingPrd.id, featureId)
      }

      prdId = existingPrd.id
    } else {
      // Create new PRD record
      const { data: newPrd, error: createError } = await supabase
        .from('feature_prds')
        .insert({
          feature_id: featureId,
          status: 'generating' as const,
        })
        .select('id')
        .single()

      if (createError || !newPrd) {
        console.error('Error creating PRD record:', createError)
        return NextResponse.json(
          { error: 'Failed to create PRD record' },
          { status: 500 }
        )
      }

      prdId = newPrd.id
    }

    // Start PRD generation in background
    generatePrdInBackground(
      prdId,
      featureId,
      projectId,
      userId,
      userSettings.gemini_api_key
    ).catch((error) => {
      console.error('Background PRD generation failed:', error)
    })

    // Log audit entry
    await supabase.from('audit_logs').insert({
      user_id: userId,
      project_id: projectId,
      feature_id: featureId,
      action: regenerate ? 'prd_regenerate_started' : 'prd_generate_started',
      payload: { prdId, regenerate },
    })

    return NextResponse.json({
      success: true,
      prdId,
      status: 'generating',
    })
  } catch (error) {
    console.error('PRD generation request failed:', error)

    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

async function moveToVersionsTable(
  supabase: Awaited<ReturnType<typeof getServerSupabaseClient>>,
  prdId: string,
  featureId: string
) {
  try {
    // Get current PRD data
    const { data: currentPrd, error: fetchError } = await supabase
      .from('feature_prds')
      .select('*')
      .eq('id', prdId)
      .single()

    if (fetchError || !currentPrd) {
      throw new Error('Failed to fetch current PRD for versioning')
    }

    // Insert into versions table with 7-day expiry
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await supabase.from('feature_prd_versions').insert({
      feature_id: featureId,
      prd_id: prdId,
      summary: currentPrd.summary,
      prd_md: currentPrd.prd_md,
      prd_json: currentPrd.prd_json,
      model_used: currentPrd.model_used,
      token_count: currentPrd.token_count,
      status: currentPrd.status,
      expires_at: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error('Failed to move PRD to versions table:', error)
    // Don't throw - this shouldn't block regeneration
  }
}

async function generatePrdInBackground(
  prdId: string,
  featureId: string,
  projectId: string,
  userId: string,
  encryptedApiKey: string
) {
  const supabase = await getServerSupabaseClient()

  try {
    // Build context for PRD generation
    const context = await buildPrdContext(featureId, projectId, userId)
    const optimizedContext = optimizeContextForTokenLimit(context)

    // Generate PRD using Gemini
    const result = await generatePrd(optimizedContext, encryptedApiKey)

    // Update PRD record with results
    const { error: updateError } = await supabase
      .from('feature_prds')
      .update({
        status: 'ready',
        summary: result.summary,
        prd_md: result.prdMarkdown,
        prd_json: result.prdJson,
        model_used: result.modelUsed,
        token_count: result.tokenCount,
        generated_at: new Date().toISOString(),
        error: null,
      })
      .eq('id', prdId)

    if (updateError) {
      throw new Error(`Failed to update PRD record: ${updateError.message}`)
    }

    // Log successful generation
    await supabase.from('audit_logs').insert({
      user_id: userId,
      project_id: projectId,
      feature_id: featureId,
      action: 'prd_generate_completed',
      payload: {
        prdId,
        tokenCount: result.tokenCount,
        modelUsed: result.modelUsed,
      },
    })
  } catch (error) {
    console.error('PRD generation failed:', error)

    // Update PRD record with error
    await supabase
      .from('feature_prds')
      .update({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('id', prdId)

    // Log error
    await supabase.from('audit_logs').insert({
      user_id: userId,
      project_id: projectId,
      feature_id: featureId,
      action: 'prd_generate_failed',
      payload: {
        prdId,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
}
