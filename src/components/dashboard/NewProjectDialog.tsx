'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm, useFieldArray, type FieldArrayPath, type FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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

// Schema for client-side validation (PRD rules)
const featureFieldSchema = z.object({
  featureId: z.string().uuid().optional(),
  title: z.string().min(3, 'Each feature must be at least 3 characters'),
})

const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  features: z
    .array(featureFieldSchema)
    .min(5, 'At least 5 features are required')
    .max(10, 'No more than 10 features allowed'),
})

export interface ProjectFormData extends FieldValues {
  name: string
  description: string
  features: Array<{
    featureId?: string
    title: string
  }>
}

interface ProjectDialogProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  onClose: () => void
  onSubmit: (data: ProjectFormData) => Promise<void> | void
  initialData?: ProjectFormData
}

const MIN_FEATURE_COUNT = 5

const emptyFeature = () => ({ featureId: undefined, title: '' })

function normalizeFeatures(
  features?: ProjectFormData['features'],
): ProjectFormData['features'] {
  const sanitized = (features ?? [])
    .filter((feature) => feature)
    .map((feature) => ({
      featureId: feature.featureId,
      title: feature.title ?? '',
    }))

  if (sanitized.length >= MIN_FEATURE_COUNT) return sanitized

  return [
    ...sanitized,
    ...Array.from({ length: MIN_FEATURE_COUNT - sanitized.length }, emptyFeature),
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
    [],
  )

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues,
    mode: 'onChange', // validate on change
  })

  const featuresFieldName: FieldArrayPath<ProjectFormData> = 'features'

  const { fields, append, remove, replace } = useFieldArray<ProjectFormData>({
    control,
    name: featuresFieldName,
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
  }, [isOpen, initialData, defaultValues, reset, replace])

  const submitHandler = async (data: ProjectFormData) => {
    setFormError(null)

    const payload: ProjectFormData = {
      name: data.name.trim(),
      description: data.description.trim(),
      features: data.features.map((feature) => ({
        featureId: feature.featureId,
        title: feature.title.trim(),
      })),
    }

    try {
      await onSubmit(payload)
      onClose()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save project right now.'
      setFormError(message)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-xl">
      <ModalHeader>
        <ModalTitle>{mode === 'edit' ? 'Edit Project' : 'New Project'}</ModalTitle>
        <ModalDescription>
          Fill in project details and list 5–10 key features
        </ModalDescription>
      </ModalHeader>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register('description')}
            className="h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/80 focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
          />
          {errors.description && (
            <p className="text-sm text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3">
          <Label>Features (5–10)</Label>
          <div className="space-y-2">
            {fields.map((field, index) => {
              const featureId = (field as typeof field & { featureId?: string }).featureId ?? ''
              return (
                <div key={field.id} className="flex gap-2">
                  <input
                    type="hidden"
                    {...register(`features.${index}.featureId`)}
                    defaultValue={featureId}
                  />
                  <Input
                    {...register(`features.${index}.title`)}
                    placeholder={`Feature ${index + 1}`}
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
            {errors.features && (
              <p className="text-sm text-red-400">{errors.features.message}</p>
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
