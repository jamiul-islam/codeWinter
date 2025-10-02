import { z } from 'zod'
import { uuidSchema, timestampSchema, jsonSchema } from './base'

// PRD Generation Request Schema
export const prdGenerateSchema = z.object({
  featureId: z.string().uuid('Invalid feature ID'),
  projectId: z.string().uuid('Invalid project ID'),
  regenerate: z.boolean().optional().default(false),
})

// PRD Response Schema
export const prdResponseSchema = z.object({
  success: z.boolean(),
  prdId: z.string().uuid().optional(),
  status: z.enum(['idle', 'generating', 'ready', 'error']),
  error: z.string().optional(),
})

// PRD Row Schema (matches database)
export const prdRowSchema = z.object({
  id: uuidSchema,
  feature_id: uuidSchema,
  status: z.enum(['idle', 'generating', 'ready', 'error']),
  summary: z.string().nullable(),
  prd_md: z.string().nullable(),
  prd_json: jsonSchema.nullable(),
  model_used: z.string().nullable(),
  token_count: z.number().nullable(),
  error: z.string().nullable(),
  generated_at: timestampSchema.nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
})

// PRD Insert Schema
export const prdInsertSchema = z.object({
  feature_id: uuidSchema,
  status: z
    .enum(['idle', 'generating', 'ready', 'error'])
    .default('generating'),
  summary: z.string().nullable().optional(),
  prd_md: z.string().nullable().optional(),
  prd_json: jsonSchema.nullable().optional(),
  model_used: z.string().nullable().optional(),
  token_count: z.number().nullable().optional(),
  error: z.string().nullable().optional(),
  generated_at: timestampSchema.nullable().optional(),
})

// PRD Update Schema
export const prdUpdateSchema = z.object({
  status: z.enum(['idle', 'generating', 'ready', 'error']).optional(),
  summary: z.string().nullable().optional(),
  prd_md: z.string().nullable().optional(),
  prd_json: jsonSchema.nullable().optional(),
  model_used: z.string().nullable().optional(),
  token_count: z.number().nullable().optional(),
  error: z.string().nullable().optional(),
  generated_at: timestampSchema.nullable().optional(),
})

// Export types
export type PrdGenerateRequest = z.infer<typeof prdGenerateSchema>
export type PrdResponse = z.infer<typeof prdResponseSchema>
export type PrdRow = z.infer<typeof prdRowSchema>
export type PrdInsert = z.infer<typeof prdInsertSchema>
export type PrdUpdate = z.infer<typeof prdUpdateSchema>
