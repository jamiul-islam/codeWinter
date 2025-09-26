import { z } from 'zod'

export const settingsSchema = z.object({
  gemini_api_key: z.string().min(1, 'API key is required'),
})

export type SettingsSchema = z.infer<typeof settingsSchema>
