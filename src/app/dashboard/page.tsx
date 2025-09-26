'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NewProjectDialog } from '@/components/projects/NewProjectDialog'
import { useProjectStore, Project } from '@/lib/store/project-store'

export default function Dashboard() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Zustand store state & actions
  const projects = useProjectStore((state) => state.projects)
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId)
  const loadProjects = useProjectStore((state) => state.loadProjects)
  const selectProject = useProjectStore((state) => state.selectProject)

  // Load projects on mount
  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  // Navigate to project page
  const handleProjectClick = (projectId: string) => {
    selectProject(projectId)
    router.push(`/project/${projectId}`)
  }

  return (
    <div className="p-6">
      {/* Dashboard header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          + New Project
        </button>
      </div>

      {/* Project list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <div className="text-gray-500 col-span-full">No projects yet.</div>
        ) : (
          projects.map((project: Project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className={`p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition ${
                selectedProjectId === project.id ? 'border-2 border-blue-500' : 'border border-gray-200'
              }`}
            >
              <h2 className="text-lg font-semibold">{project.name}</h2>
              {project.description && (
                <p className="text-sm text-gray-500 mb-2">{project.description}</p>
              )}
              <p className="text-sm text-gray-400">
                Features: {project.features.length} • Updated:{' '}
                {project.updatedAt
                  ? new Date(project.updatedAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Modal for New Project */}
      {isDialogOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsDialogOpen(false)}
          />

          {/* Centered dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <NewProjectDialog onClose={() => setIsDialogOpen(false)} />
          </div>
        </>
      )}
    </div>
  )
}
