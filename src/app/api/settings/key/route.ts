import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase/server'
import { settingsSchema } from '@/lib/schemas/settings-schema'
import {
  encryptApiKey,
  decryptApiKey,
  maskApiKey,
  verifyGeminiAPIKey,
} from '@/lib/gemini'
import { Database } from '@/lib/supabase/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await getServerSupabaseClient()

    // Check authentication
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession()

    if (authError || !session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
          error: authError,
        },
        { status: 401 }
      )
    }

    // Validate request body
    const body = await request.json()
    const validation = settingsSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input',
          error: validation.error,
        },
        { status: 422 }
      )
    }

    // Verify the API key
    const isValid = await verifyGeminiAPIKey(validation.data.gemini_api_key)
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid API key',
        },
        { status: 422 }
      )
    }

    const { gemini_api_key } = validation.data

    // Encrypt the API key
    const encryptedKey = encryptApiKey(gemini_api_key)

    // Upsert user settings with proper typing
    type UserSettings = Database['public']['Tables']['user_settings']['Insert']
    const insertData: UserSettings = {
      user_id: session.user.id,
      gemini_api_key: encryptedKey,
      updated_at: new Date().toISOString(),
    }

    const { error: upsertError } = await supabase
      .from('user_settings')
      .upsert(insertData)

    if (upsertError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to save API key',
          error: upsertError,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'API key saved successfully',
      data: {
        apiKey: maskApiKey(gemini_api_key),
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await getServerSupabaseClient()

    // Check authentication
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession()

    if (authError || !session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
          error: authError,
        },
        { status: 401 }
      )
    }

    // Get user settings with proper typing
    const { data: settings, error: fetchError } = await supabase
      .from('user_settings')
      .select('gemini_api_key')
      .eq('user_id', session.user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is expected for new users
      console.error('Database error:', fetchError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch API key',
          error: fetchError,
        },
        { status: 500 }
      )
    }

    // Handle case when no settings exist yet (new user)
    if (!settings) {
      return NextResponse.json({
        success: true,
        message: 'No API key configured',
        data: {
          maskedKey: null,
        },
      })
    }

    let maskedKey: string | null = null

    if (settings?.gemini_api_key) {
      try {
        const decryptedKey = decryptApiKey(settings.gemini_api_key)
        maskedKey = maskApiKey(decryptedKey)
      } catch (error) {
        console.error('Failed to decrypt API key in route:', error)
        maskedKey = null
      }
    }

    return NextResponse.json({
      success: true,
      message: 'API key fetched successfully',
      data: {
        maskedKey: maskedKey,
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const supabase = await getServerSupabaseClient()

    // Check authentication
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession()

    if (authError || !session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
          error: authError,
        },
        { status: 401 }
      )
    }

    // Delete the API key with proper typing
    const deleteQuery = supabase
      .from('user_settings')
      .delete()
      .eq('user_id', session.user.id)

    const { error: deleteError } = await deleteQuery

    if (deleteError) {
      console.error('Database error:', deleteError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to delete API key',
          error: deleteError,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully',
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    )
  }
}
