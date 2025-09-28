'use client'

import { useForm, useFieldArray } from 'react-hook-form'
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

type ProjectFormData = z.infer<typeof projectSchema>

interface NewProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProjectFormData) => void
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
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: '', description: '', features: ['', '', '', '', ''] }, // start with 5 inputs
    mode: 'onChange', // validate on change
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  })

  const submitHandler = (data: ProjectFormData) => {
    onSubmit(data)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>New Project</ModalTitle>
        <ModalDescription>
          Fill in project details and list 5–10 key features
        </ModalDescription>
      </ModalHeader>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register('description')}
            className="w-full rounded-md border border-white/10 bg-slate-900/50 p-2 text-white"
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-red-400 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3">
          <Label>Features (5–10)</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
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
          <div className="flex justify-between items-center mt-2">
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
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Project</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
