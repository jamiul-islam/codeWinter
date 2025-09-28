'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

// Schema for client-side validation 
const projectSchema = z.object({
    name: z.string().min(3, 'Project name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    features: z
        .array(z.string().min(3, 'Feature must be at least 3 characters'))
        .min(5, 'At least 5 features are required')
        .max(10, 'No more than 10 features allowed'),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface NewProjectDialogProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: ProjectFormData) => void
}

export default function NewProjectDialog({ isOpen, onClose, onSubmit }: NewProjectDialogProps) {
    const { register, handleSubmit, control, formState: { errors } } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: { name: '', description: '', features: [''] },
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'features' })

    const submitHandler = (data: ProjectFormData) => {
        onSubmit(data)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalHeader>
                <ModalTitle>New Project</ModalTitle>
                <ModalDescription>Create a new project with features</ModalDescription>
            </ModalHeader>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                {/* Name */}
                <div>
                    <Label htmlFor="name">Project Name</Label>
                    <Input id="name" {...register('name')} />
                    {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" {...register('description')} />
                    {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}
                </div>

                {/* Features */}
                <div className="space-y-3">
                    <Label>Features</Label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                            <Input {...register(`features.${index}`)} placeholder={`Feature ${index + 1}`} />
                            <Button type="button" variant="secondary" onClick={() => remove(index)}>Remove</Button>
                        </div>
                    ))}
                    <div className="mt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => append('')}
                            disabled={fields.length >= 10}
                        >
                            Add Feature
                        </Button>
                    </div>
                    {errors.features && <p className="text-sm text-red-400">{errors.features.message}</p>}
                </div>
                <ModalFooter>
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Create Project</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}
