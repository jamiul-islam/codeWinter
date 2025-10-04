import { z } from 'zod'

import { jsonSchema, timestampSchema, uuidSchema } from './base'

export const projectNameSchema = z
  .string()
  .min(3, 'Project name must be at least 3 characters')
  .max(80, 'Project name must be at most 80 characters')

export const projectDescriptionSchema = z
  .string()
  .min(10, 'Project description must be at least 10 characters')
  .max(4000, 'Project description must be at most 4000 characters')

export const projectFeatureListSchema = z
  .array(z.string().min(1).max(120))
  .min(5, 'Provide at least 5 features')
  .max(10, 'Provide no more than 10 features')

export const projectInsertSchema = z.object({
  name: projectNameSchema,
  description: projectDescriptionSchema,
  features: projectFeatureListSchema,
})

export const projectFeatureAutofillSchema = z.object({
  name: projectNameSchema,
  description: projectDescriptionSchema,
  count: z
    .number()
    .int()
    .min(1)
    .max(10)
    .default(5),
})

export const projectRowSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  name: projectNameSchema,
  description: projectDescriptionSchema,
  graph: jsonSchema.nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
})

export type ProjectInsert = z.infer<typeof projectInsertSchema>
export type ProjectRow = z.infer<typeof projectRowSchema>
export type ProjectFeatureAutofill = z.infer<
  typeof projectFeatureAutofillSchema
>
