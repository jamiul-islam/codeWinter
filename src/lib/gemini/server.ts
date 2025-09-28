import type { SupabaseClient } from '@supabase/supabase-js'

import { decryptApiKey } from '@/lib/gemini'
import type { Database } from '@/lib/supabase/types'

export class GeminiKeyMissingError extends Error {
  constructor() {
    super('Gemini API key is not configured for this user.')
    this.name = 'GeminiKeyMissingError'
  }
}

export async function getDecryptedUserGeminiKey(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<string> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('gemini_api_key')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data?.gemini_api_key) {
    throw new GeminiKeyMissingError()
  }

  return decryptApiKey(data.gemini_api_key)
}
