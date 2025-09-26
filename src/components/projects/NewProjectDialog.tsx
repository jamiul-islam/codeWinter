'use client'

import React, { useState } from 'react'
import { useProjectStore } from '@/lib/store/project-store'

interface FeatureInput {
  id: string
  value: string
}

export const NewProjectDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const createProject = useProjectStore((state) => state.createProject)
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [features, setFeatures] = useState<FeatureInput[]>([
    { id: crypto.randomUUID(), value: '' },
  ])
  const [errors, setErrors] = useState<{ name?: string; features?: string }>({})
  const [loading, setLoading] = useState(false)

  // Validation
  const validate = (): boolean => {
    let valid = true
    const newErrors: { name?: string; features?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Project name is required'
      valid = false
    } else if (name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters'
      valid = false
    }

    const filledFeatures = features.map((f) => f.value.trim()).filter(Boolean)
    if (filledFeatures.length < 5) {
      newErrors.features = 'Add at least 5 features'
      valid = false
    } else if (filledFeatures.length > 10) {
      newErrors.features = 'Maximum 10 features allowed'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  // Handle form submit
  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    await createProject({
      name: name.trim(),
      description: description.trim(),
      features: features
        .map((f) => f.value.trim())
        .filter(Boolean)
        .map((value) => ({ id: crypto.randomUUID(), title: value })),
    })
    setLoading(false)
    onClose()
  }

  // Add new feature input
  const addFeature = () => {
    if (features.length >= 10) return
    setFeatures([...features, { id: crypto.randomUUID(), value: '' }])
  }

  // Remove a feature input
  const removeFeature = (id: string) => {
    setFeatures(features.filter((f) => f.id !== id))
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">New Project</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Project Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter project name"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Features</label>
        {features.map((f, idx) => (
          <div key={f.id} className="flex items-center mb-2 gap-2">
            <input
              type="text"
              value={f.value}
              onChange={(e) =>
                setFeatures(
                  features.map((feat) =>
                    feat.id === f.id ? { ...feat, value: e.target.value } : feat
                  )
                )
              }
              placeholder={`Feature ${idx + 1}`}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeFeature(f.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
        {features.length < 10 && (
          <button
            type="button"
            onClick={addFeature}
            className="px-3 py-1 text-sm border border-gray-400 rounded hover:bg-gray-100"
          >
            + Add Feature
          </button>
        )}
        {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </div>
  )
}
