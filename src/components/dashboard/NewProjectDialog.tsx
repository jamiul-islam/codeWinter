'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'

import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

// Define the type for form data
export interface ProjectFormData {
  name: string
  description: string
  features: Array<{
    featureId?: string
    title: string
  }>
}

// Manual validation function
const validateProjectForm = (data: ProjectFormData): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Project name must be at least 3 characters'
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters'
  }

  if (!data.features || data.features.length < 5) {
    errors.features = 'At least 5 features are required'
  } else if (data.features.length > 10) {
    errors.features = 'No more than 10 features allowed'
  }

  data.features.forEach((feature, index) => {
    if (!feature.title || feature.title.trim().length < 3) {
      errors[`features.${index}.title`] =
        'Each feature must be at least 3 characters'
    }
  })

  return errors
}

interface ProjectDialogProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  onClose: () => void
  onSubmit: (data: ProjectFormData) => Promise<void> | void
  initialData?: ProjectFormData
}

const MIN_FEATURE_COUNT = 5

const emptyFeature = () => ({ title: '' })

function normalizeFeatures(
  features?: ProjectFormData['features']
): ProjectFormData['features'] {
  const sanitized = (features ?? [])
    .filter((feature): feature is NonNullable<typeof feature> =>
      Boolean(feature)
    )
    .map((feature) => ({
      ...(feature.featureId ? { featureId: feature.featureId } : {}),
      title: feature.title ?? '',
    }))

  if (sanitized.length >= MIN_FEATURE_COUNT) return sanitized

  return [
    ...sanitized,
    ...Array.from(
      { length: MIN_FEATURE_COUNT - sanitized.length },
      emptyFeature
    ),
  ]
}

export default function ProjectDialog({
  isOpen,
  mode,
  onClose,
  onSubmit,
  initialData,
}: ProjectDialogProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const defaultValues = useMemo<ProjectFormData>(
    () => ({
      name: '',
      description: '',
      features: normalizeFeatures(),
    }),
    []
  )

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  const { register, handleSubmit, control, reset } = useForm<ProjectFormData>({
    defaultValues,
    mode: 'onChange',
  })

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'features',
  })

  useEffect(() => {
    if (!isOpen) return

    const normalized = initialData
      ? {
          ...initialData,
          features: normalizeFeatures(initialData.features),
        }
      : defaultValues

    reset(normalized)
    replace(normalized.features)
    setFormError(null)
    setValidationErrors({})
  }, [isOpen, initialData, defaultValues, reset, replace])

  const submitHandler = async (data: ProjectFormData) => {
    setFormError(null)
    setValidationErrors({})

    const payload: ProjectFormData = {
      name: data.name.trim(),
      description: data.description.trim(),
      features: data.features.map((feature) => ({
        ...(feature.featureId ? { featureId: feature.featureId } : {}),
        title: feature.title.trim(),
      })),
    }

    // Validate the form
    const errors = validateProjectForm(payload)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      await onSubmit(payload)
      onClose()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to save project right now.'
      setFormError(message)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-xl">
      <ModalHeader>
        <ModalTitle>
          {mode === 'edit' ? 'Edit Project' : 'New Project'}
        </ModalTitle>
        <ModalDescription>
          Fill in project details and list 5–10 key features
        </ModalDescription>
      </ModalHeader>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input id="name" {...register('name')} />
          {validationErrors.name && (
            <p className="text-sm text-red-400">{validationErrors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register('description')}
            className="h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/60 focus:outline-none"
          />
          {validationErrors.description && (
            <p className="text-sm text-red-400">
              {validationErrors.description}
            </p>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3">
          <Label>Features (5–10)</Label>
          <div className="space-y-2">
            {fields.map((field, index) => {
              const featureId =
                (field as { featureId?: string }).featureId ?? ''
              const featureError = validationErrors[`features.${index}.title`]

              return (
                <div key={field.id} className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <input
                      type="hidden"
                      {...register(`features.${index}.featureId` as const)}
                      defaultValue={featureId}
                    />
                    <Input
                      {...register(`features.${index}.title` as const)}
                      placeholder={`Feature ${index + 1}`}
                      autoComplete="off"
                      aria-invalid={Boolean(featureError)}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => remove(index)}
                      disabled={fields.length <= MIN_FEATURE_COUNT} // enforce min count visually
                    >
                      Remove
                    </Button>
                  </div>
                  {featureError && (
                    <p className="text-xs text-rose-300">{featureError}</p>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => append(emptyFeature())}
              disabled={fields.length >= 10}
            >
              Add Feature
            </Button>
            {validationErrors.features && (
              <p className="text-sm text-red-400">
                {validationErrors.features}
              </p>
            )}
          </div>
        </div>

        {formError && <p className="text-sm text-rose-300">{formError}</p>}

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === 'edit' ? 'Save changes' : 'Create project'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
