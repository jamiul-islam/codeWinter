import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_URL is required'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_PROJECT_REF: z.string().optional(),
  NEXT_PUBLIC_GEMINI_API_KEY: z.string().optional(),
  ENCRYPTION_KEY: z.string().optional(),
  NEXT_PUBLIC_CRON_SECRET: z.string().optional(),
  RATE_LIMIT_REDIS_URL: z.string().optional(),
})

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_SUPABASE_PROJECT_REF:
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF,
  NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  NEXT_PUBLIC_CRON_SECRET: process.env.NEXT_PUBLIC_CRON_SECRET,
  RATE_LIMIT_REDIS_URL: process.env.RATE_LIMIT_REDIS_URL,
})

if (!parsed.success) {
  console.error(
    'Environment validation failed',
    parsed.error.flatten().fieldErrors
  )
  throw new Error('Invalid environment configuration')
}

export const env = parsed.data
