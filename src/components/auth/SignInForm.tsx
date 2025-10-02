'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInSchema } from '@/lib/schemas/auth-schema'

const successIcon = (
  <svg
    className="h-6 w-6 text-cyan-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
)

type FormValues = z.infer<typeof signInSchema>

interface SignInFormProps {
  onSuccess?: () => void
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const { signIn } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const emailFieldId = 'signin-email'

  const form = useForm<FormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setError(null)
    setSuccess(false)

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
      <div className="space-y-2 text-center text-sm text-slate-200">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10">
          {successIcon}
        </div>
        <h3 className="text-base font-semibold text-white">Check your inbox</h3>
        <p>
          We sent a magic link to{' '}
          <span className="font-medium text-cyan-100">
            {form.getValues('email')}
          </span>
          . Use it to hop back into the dashboard.
        </p>
      </div>
    )
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5 text-left"
    >
      <div className="space-y-2">
        <Label htmlFor={emailFieldId}>Work email</Label>
        <Input
          type="email"
          placeholder="name@example.com"
          disabled={isSubmitting}
          id={emailFieldId}
          autoComplete="email"
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-rose-300">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/20 border-t-slate-900" />
            Sending magic link…
          </span>
        ) : (
          'Send magic link'
        )}
      </Button>
    </form>
  )
}
