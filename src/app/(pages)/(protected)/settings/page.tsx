'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAuth } from '@/components/providers'
import { Button, buttonClasses } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Modal,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import { PageLoader } from '@/components/loaders'
import { settingsSchema } from '@/lib/schemas/settings-schema'

type FormValues = z.infer<typeof settingsSchema>

interface ApiKeySettings {
  maskedKey: string | null
}

type FeedbackState = {
  type: 'success' | 'error'
  message: string
}

export default function SettingsPage() {
  const { user, signOut, isLoading: authLoading } = useAuth()
  const [settings, setSettings] = useState<ApiKeySettings | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      gemini_api_key: '',
    },
  })

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/key')
      if (response.ok) {
        const data = await response.json()
        setSettings({ maskedKey: data.data.maskedKey })
      } else {
        setSettings({ maskedKey: null })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchSettings()
    }
  }, [user])

  const onSubmit = async (values: FormValues) => {
    setFeedback(null)
    try {
      const response = await fetch('/api/settings/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (response.ok) {
        form.reset()
        fetchSettings()
        setFeedback({ type: 'success', message: 'API key saved successfully.' })
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Failed to save API key.',
        })
      }
    } catch (error) {
      console.error('Failed to save API key:', error)
      setFeedback({ type: 'error', message: 'Unable to save API key right now.' })
    }
  }

  const handleDeleteKey = async () => {
    setIsDeleting(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/settings/key', {
        method: 'DELETE',
      })
      const data = await response.json()

      if (response.ok) {
        setSettings({ maskedKey: null })
        setShowDeleteConfirm(false)
        setFeedback({ type: 'success', message: 'API key deleted.' })
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'Failed to delete API key.',
        })
      }
    } catch (error) {
      console.error('Failed to delete API key:', error)
      setFeedback({ type: 'error', message: 'Unable to delete API key right now.' })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      setFeedback({ type: 'error', message: 'Failed to sign out.' })
      return
    }
    router.push('/signin')
  }

  if (authLoading || isFetching) {
    return <PageLoader />
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/30 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Account</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Settings</h1>
          <p className="mt-3 max-w-xl text-sm text-slate-300">
            Manage your access and keep your Gemini credentials secure. Everything stays encrypted at rest.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link className={buttonClasses({ variant: 'secondary', size: 'sm' })} href="/dashboard">
            Back to dashboard
          </Link>
          <Button onClick={handleSignOut} variant="ghost" size="sm">
            Sign out
          </Button>
        </div>
      </header>

      {feedback && (
        <div
          className={`mb-8 rounded-2xl border p-4 text-sm ${
            feedback.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-100'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="space-y-10">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-semibold text-white">Profile</h2>
          <p className="mt-2 text-sm text-slate-300">
            These details help us personalise your workspace.
          </p>
          <div className="mt-6 space-y-3">
            <Label>Email address</Label>
            <Input value={user?.email || ''} readOnly />
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Gemini API key</h2>
              <p className="mt-2 text-sm text-slate-300">
                Add your own Gemini API key to generate architecture graphs and PRDs.
              </p>
            </div>
            {settings?.maskedKey && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm text-rose-300 underline-offset-4 hover:text-rose-200 hover:underline"
              >
                Remove current key
              </button>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {settings?.maskedKey ? (
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-left">
                <Label className="text-slate-200">Stored key</Label>
                <Input value={settings.maskedKey} readOnly className="mt-2 font-mono" />
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-500/20 bg-slate-500/10 p-4 text-sm text-slate-200">
                No key saved yet. Paste your Gemini API key below to enable generation.
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>{settings?.maskedKey ? 'Replace with new key' : 'Gemini API key'}</Label>
                <Input
                  type="password"
                  placeholder="Paste your key"
                  disabled={form.formState.isSubmitting}
                  {...form.register('gemini_api_key')}
                />
                {form.formState.errors.gemini_api_key && (
                  <p className="text-sm text-rose-200">
                    {form.formState.errors.gemini_api_key.message}
                  </p>
                )}
                <p className="text-xs text-slate-400">
                  We encrypt keys using your project&apos;s secret before storing them in Supabase.
                </p>
              </div>

              <Button
                type="submit"
                size="md"
                disabled={form.formState.isSubmitting}
                className="px-6"
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/20 border-t-slate-900" />
                    Saving…
                  </span>
                ) : settings?.maskedKey ? (
                  'Update key'
                ) : (
                  'Save key'
                )}
              </Button>
            </form>
          </div>
        </section>
      </div>

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <ModalHeader>
          <ModalTitle>Delete API key</ModalTitle>
          <ModalDescription>
            Removing the key will stop PRD generation until a new one is added.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDeleteKey}
            disabled={isDeleting}
            className="bg-rose-500 hover:bg-rose-400"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-rose-900/20 border-t-rose-100" />
                Deleting…
              </span>
            ) : (
              'Delete key'
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
