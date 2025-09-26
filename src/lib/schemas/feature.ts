import { z } from 'zod'

import { jsonSchema, prdStatusSchema, timestampSchema, uuidSchema } from './base'

export const featureTitleSchema = z
  .string()
  .min(2, 'Feature title must be at least 2 characters')
  .max(120, 'Feature title must be at most 120 characters')

export const featureNotesSchema = z.string().max(4000).nullable().optional()

export const featurePositionSchema = z
  .object({
    x: z.number(),
    y: z.number(),
    width: z.number().optional(),
    height: z.number().optional(),
  })
  .strict()
  .nullable()
  .optional()

export const featureInsertSchema = z.object({
  project_id: uuidSchema,
  title: featureTitleSchema,
  notes: featureNotesSchema,
  position: featurePositionSchema,
})

export const featureRowSchema = z.object({
  id: uuidSchema,
  project_id: uuidSchema,
  title: featureTitleSchema,
  notes: z.string().nullable(),
  position: jsonSchema.nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
})

export const featureEdgeSchema = z.object({
  id: uuidSchema.optional(),
  project_id: uuidSchema,
  source_feature_id: uuidSchema,
  target_feature_id: uuidSchema,
  metadata: jsonSchema.nullable().optional(),
})

export const featurePrdSchema = z.object({
  feature_id: uuidSchema,
  status: prdStatusSchema,
  summary: z.string().nullable().optional(),
  prd_md: z.string().nullable().optional(),
  prd_json: jsonSchema.nullable().optional(),
  model_used: z.string().nullable().optional(),
  token_count: z.number().int().nullable().optional(),
  error: z.string().nullable().optional(),
  generated_at: timestampSchema.nullable().optional(),
})

export type FeatureInsert = z.infer<typeof featureInsertSchema>
export type FeatureEdgeInput = z.infer<typeof featureEdgeSchema>
export type FeaturePrdPayload = z.infer<typeof featurePrdSchema>
