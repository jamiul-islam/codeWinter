'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '@/components/ui/modal'
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { settingsSchema } from '@/lib/schemas/settings-schema'
import { useRouter } from 'next/navigation'
import { buttonClasses } from '@/components/ui/button.styles'
import { PageLoader } from '@/components/loaders'
import Link from 'next/link'

type FormValues = z.infer<typeof settingsSchema>

interface ApiKeySettings {
  maskedKey: string | null
}

export default function SettingsPage() {
  const { user, signOut, isLoading: authLoading } = useAuth()
  const [settings, setSettings] = useState<ApiKeySettings | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const router = useRouter()

  // Initialize React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      gemini_api_key: '',
    },
  })

  // Fetch current settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/key')
      if (response.ok) {
        const data = await response.json()
        setSettings({ maskedKey: data.data.maskedKey })
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
    try {
      const response = await fetch('/api/settings/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        form.reset()
        fetchSettings()
        toast.success('API key saved successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to save API key')
      }
    } catch (error) {
      console.error('Failed to save API key:', error)
      toast.error('Failed to save API key')
    }
  }

  const handleDeleteKey = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 4000))
      const response = await fetch('/api/settings/key', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('API key deleted successfully')
        setSettings({ maskedKey: null })
        setShowDeleteConfirm(false)
      } else {
        toast.error(data.message || 'Failed to delete API key')
      }
    } catch (error) {
      console.error('Failed to delete API key:', error)
      toast.error('Failed to delete API key')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Failed to sign out')
      return
    }
    // redirect to sign in page
    router.push('/signin')
  }

  if (authLoading || isFetching) {
    return <PageLoader />
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Settings</h1>
          <p className="text-slate-400">Manage your account and API keys</p>
        </div>
        <div className="flex items-center gap-4">
          <Link className={buttonClasses({ size: 'sm' })} href="/dashboard">
            <ArrowLeft className="size-4" /> Back to Dashboard
          </Link>
          <Button onClick={handleSignOut} variant="secondary" size="sm">
            Sign out
          </Button>
        </div>
      </header>

      <div className="space-y-8">
        {/* Account section */}
        <section className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
          <h2 className="mb-4 text-xl font-medium text-white">Account</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Email</Label>
              <Input
                value={user?.email || ''}
                readOnly
                className="mt-1 border-slate-600 bg-slate-700 text-slate-300"
              />
            </div>
          </div>
        </section>

        {/* API Keys section */}
        <section className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
          <h2 className="mb-4 text-xl font-medium text-white">API Keys</h2>

          {/* Gemini API Key */}
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-medium text-white">
                Gemini API Key
              </h3>
              <p className="mb-4 text-sm text-slate-400">
                Required for generating feature graphs and PRDs using
                Google&apos;s Gemini AI.
              </p>

              {settings?.maskedKey ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Current API Key</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        value={settings.maskedKey}
                        readOnly
                        className="mt-1 flex-1 border-slate-600 bg-slate-700 font-mono text-slate-300"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isLoading}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2">
                    <p className="text-sm text-amber-200">
                      <strong>Update API Key:</strong> Enter a new key below to
                      replace the current one.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-4 rounded-lg border border-blue-500/20 bg-blue-500/10 p-2">
                  <p className="text-sm text-blue-200">
                    <strong>No API key configured.</strong> You&apos;ll need to
                    add a Gemini API key to generate graphs and PRDs.
                  </p>
                </div>
              )}

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-4"
              >
                <div className="space-y-2">
                  <Label className="text-slate-300">
                    {settings?.maskedKey ? 'New API Key' : 'Gemini API Key'}
                  </Label>
                  <Input
                    type="password"
                    placeholder="Enter your Gemini API key"
                    disabled={form.formState.isSubmitting}
                    {...form.register('gemini_api_key')}
                    className="mt-1 border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                  />
                  {form.formState.errors.gemini_api_key && (
                    <p className="text-sm text-red-400">
                      {form.formState.errors.gemini_api_key.message}
                    </p>
                  )}
                  <p className="text-sm text-slate-400">
                    Your API key will be encrypted and stored securely.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  variant="primary"
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {settings?.maskedKey ? 'Updating...' : 'Saving...'}
                    </div>
                  ) : settings?.maskedKey ? (
                    'Update API Key'
                  ) : (
                    'Save API Key'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Delete confirmation dialog */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      >
        <ModalHeader>
          <ModalTitle>Delete API Key</ModalTitle>
          <ModalDescription>
            Are you sure you want to delete your Gemini API key? You won&apos;t
            be able to generate graphs or PRDs until you add a new key.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault()
              handleDeleteKey()
            }}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
