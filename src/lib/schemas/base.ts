import { z } from 'zod'

export const prdStatusSchema = z.enum(['idle', 'generating', 'ready', 'error'])

export const uuidSchema = z.string().uuid({ message: 'Expected a valid UUID' })

export const timestampSchema = z.string().datetime({ offset: true })

export const jsonSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonSchema),
    z.record(z.string(), jsonSchema),
  ])
)
