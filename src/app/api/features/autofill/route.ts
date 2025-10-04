import { NextRequest, NextResponse } from 'next/server'

import { getServerSupabaseClient } from '@/lib/supabase/server'
import {
  projectFeatureAutofillSchema,
  type ProjectFeatureAutofill,
} from '@/lib/schemas/project'
import { generateProjectFeatures } from '@/lib/gemini/feature-generator'

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as unknown

    const parseResult = projectFeatureAutofillSchema.safeParse(payload)

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input provided for feature generation',
          details: parseResult.error.flatten(),
        },
        { status: 422 }
      )
    }

  const input: ProjectFeatureAutofill = parseResult.data

    const supabase = await getServerSupabaseClient()

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('gemini_api_key')
      .eq('user_id', userId)
      .single()

    if (settingsError || !settings?.gemini_api_key) {
      return NextResponse.json(
        {
          error:
            'Gemini API key not configured. Please add your API key in settings.',
        },
        { status: 400 }
      )
    }

    const features = await generateProjectFeatures({
      projectName: input.name,
      projectDescription: input.description,
      encryptedApiKey: settings.gemini_api_key,
      count: input.count,
    })

    return NextResponse.json({ features })
  } catch (error) {
    console.error('Feature autofill failed:', error)

    const message =
      error instanceof Error ? error.message : 'Failed to generate features'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
