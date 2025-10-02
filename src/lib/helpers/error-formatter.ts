import { ZodError } from 'zod'

// Utility function to extract first error message from Zod validation errors
export function getFirstZodError(error: ZodError): string {
  if (error.issues && error.issues.length > 0) {
    return error.issues[0].message
  }
  return 'Validation failed'
}
