'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Trash2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { settingsSchema } from '@/lib/schemas/settings-schema'
import { useRouter } from 'next/navigation'

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
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
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
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            Back to Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-600 hover:text-white"
          >
            Sign out
          </button>
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
                className="mt-2 border-slate-600 bg-slate-700 text-slate-300"
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
                        className="flex-1 border-slate-600 bg-slate-700 font-mono text-slate-300"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isLoading}
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

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-4 space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="gemini_api_key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">
                          {settings?.maskedKey
                            ? 'New API Key'
                            : 'Gemini API Key'}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your Gemini API key"
                            disabled={form.formState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-slate-400">
                          Your API key will be encrypted and stored securely.
                        </FormDescription>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={form.formState.isSubmitting}>
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
              </Form>
            </div>
          </div>
        </section>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your Gemini API key? You won't be
              able to generate graphs or PRDs until you add a new key.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
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
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
