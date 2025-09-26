import { z } from 'zod'

import { timestampSchema, uuidSchema } from './base'

export const apiKeyProviderSchema = z.enum(['gemini'])

export const apiKeyInsertSchema = z.object({
  user_id: uuidSchema,
  provider: apiKeyProviderSchema.default('gemini'),
  encrypted_value: z.string().min(1, 'Encrypted key is required'),
  key_checksum: z.string().min(16).max(128).nullable().optional(),
  last_four: z
    .string()
    .regex(/^[A-Z0-9]{4}$/i, 'Last four should be alphanumeric')
    .nullable()
    .optional(),
})

export const apiKeyRowSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  provider: apiKeyProviderSchema,
  encrypted_value: z.string(),
  key_checksum: z.string().nullable(),
  last_four: z.string().nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
})

export type ApiKeyInsert = z.infer<typeof apiKeyInsertSchema>
export type ApiKeyRow = z.infer<typeof apiKeyRowSchema>
