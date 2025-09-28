import { z } from 'zod'

import { timestampSchema, uuidSchema } from './base'

export const settingsSchema = z.object({
  gemini_api_key: z.string().min(1, 'API key is required'),
})

export const userSettingsInsertSchema = z.object({
  user_id: uuidSchema,
  gemini_api_key: z.string().min(1, 'Encrypted key is required'),
})

export const userSettingsRowSchema = z.object({
  user_id: uuidSchema,
  gemini_api_key: z.string().nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
})

export type UserSettingsInsert = z.infer<typeof userSettingsInsertSchema>
export type UserSettingsRow = z.infer<typeof userSettingsRowSchema>
