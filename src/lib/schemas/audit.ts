import { z } from 'zod'

import { jsonSchema, timestampSchema, uuidSchema } from './base'

export const auditActionSchema = z.enum([
  'prd.generate.start',
  'prd.generate.success',
  'prd.generate.error',
  'prd.status.changed',
  'prd.content.updated',
  'prd.deleted',
  'prd.record.created',
])

export const auditLogRowSchema = z.object({
  id: z.number().int(),
  user_id: uuidSchema,
  project_id: uuidSchema.nullable(),
  feature_id: uuidSchema.nullable(),
  action: auditActionSchema,
  payload: jsonSchema,
  created_at: timestampSchema,
})

export type AuditLogRow = z.infer<typeof auditLogRowSchema>
