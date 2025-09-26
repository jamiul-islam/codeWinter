'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { signInSchema } from '@/lib/schemas/auth-schema'

type FormValues = z.infer<typeof signInSchema>

interface SignInFormProps {
  onSuccess?: () => void
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const { signIn } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Initialize React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setError(null)

    try {
      const { error } = await signIn(values.email)

      if (error) {
        setError(error.message || 'Failed to send magic link')
      } else {
        setSuccess(true)
        onSuccess?.()
      }
    } catch {
      setError('An unexpected error occurred')
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-green-500/20 p-3">
            <svg
              className="h-6 w-6 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="mb-2 text-lg font-medium text-white">
          Check your email
        </h3>
        <p className="text-sm text-slate-300">
          We&apos;ve sent a magic link to{' '}
          <strong>{form.getValues('email')}</strong>. Click the link to sign in.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-slate-200">Email address</Label>
        <Input
          type="email"
          placeholder="Enter your email"
          disabled={form.formState.isSubmitting}
          {...form.register('email')}
          className="mt-1 border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-400">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        variant="primary"
        className="w-full"
      >
        {form.formState.isSubmitting ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Sending magic link...
          </div>
        ) : (
          'Send magic link'
        )}
      </Button>
    </form>
  )
}
