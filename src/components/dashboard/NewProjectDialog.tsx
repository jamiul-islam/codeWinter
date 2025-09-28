'use client'

import {
  useForm,
  useFieldArray,
  type FieldArrayPath,
  type FieldValues,
} from 'react-hook-form'
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
const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  features: z
    .array(z.string().min(3, 'Each feature must be at least 3 characters'))
    .min(5, 'At least 5 features are required')
    .max(10, 'No more than 10 features allowed'),
})

export interface ProjectFormData extends FieldValues {
  name: string
  description: string
  features: string[]
}

interface NewProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProjectFormData) => Promise<void>
}

export default function NewProjectDialog({
  isOpen,
  onClose,
  onSubmit,
}: NewProjectDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      features: ['', '', '', '', ''],
    }, // start with 5 inputs
    mode: 'onChange', // validate on change
  })

  const featuresFieldName: FieldArrayPath<ProjectFormData> = 'features'

  const { fields, append, remove } = useFieldArray<ProjectFormData>({
    control,
    name: featuresFieldName,
  })

  const submitHandler = async (data: ProjectFormData) => {
    try {
      await onSubmit(data)
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-xl">
      <ModalHeader>
        <ModalTitle>New Project</ModalTitle>
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
            className="h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/60 focus:outline-none"
          />
          {errors.description && (
            <p className="text-sm text-red-400">{errors.description.message}</p>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3">
          <Label>Features (5–10)</Label>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`features.${index}`)}
                  placeholder={`Feature ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 5} // enforce min count visually
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => append('')}
              disabled={fields.length >= 10}
            >
              Add Feature
            </Button>
            {errors.features && (
              <p className="text-sm text-red-400">{errors.features.message}</p>
            )}
          </div>
        </div>

        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/20 border-t-slate-900" />
                  Creating Project...
                </span>
              </>
            ) : (
              'Create Project'
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
