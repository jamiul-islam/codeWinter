'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type NodeStatus = 'idle' | 'generating' | 'ready' | 'error'

export interface FeatureNodeState {
  id: string
  title: string
  status: NodeStatus
  graphPlaceholder?: any
}


export interface Feature {
  id: string
  title: string
}

export interface Project {
  id: string
  name: string
  description?: string
  features: Feature[]
  updatedAt: string
}

interface ProjectState {
  nodes: FeatureNodeState[]
  selectedNodeId: string | null
  upsertNode: (node: FeatureNodeState) => void
  setNodeStatus: (id: string, status: NodeStatus) => void
  deleteNode: (id: string) => void
  selectNode: (id: string | null) => void
  reset: () => void

  projects: Project[] // list of all projects
  selectedProjectId: string | null // currently active project
  loadProjects: () => Promise<void> // fetch all projects from backend
  createProject: (project: { name: string; description?: string; features: Feature[] }) => Promise<void> // create project
  selectProject: (id: string | null) => void // set active project
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    persist(
      (set, get) => ({
        nodes: [],
        selectedNodeId: null,
        upsertNode: (node) => {
          set(
            (state) => {
              const existingIndex = state.nodes.findIndex(
                (n) => n.id === node.id
              )
              if (existingIndex === -1) {
                return { nodes: [...state.nodes, node] }
              }

              const nextNodes = [...state.nodes]
              nextNodes[existingIndex] = {
                ...nextNodes[existingIndex],
                ...node,
              }
              return { nodes: nextNodes }
            },
            false,
            `upsert-node:${node.id}`
          )
        },
        setNodeStatus: (id, status) => {
          set(
            (state) => ({
              nodes: state.nodes.map((node) =>
                node.id === id ? { ...node, status } : node
              ),
            }),
            false,
            `set-status:${id}`
          )
        },
        deleteNode: (id) => {
          set(
            (state) => ({
              nodes: state.nodes.filter((node) => node.id !== id),
              selectedNodeId:
                state.selectedNodeId === id ? null : state.selectedNodeId,
            }),
            false,
            `delete-node:${id}`
          )
        },
        selectNode: (id) => {
          const { nodes } = get()
          if (id && !nodes.some((node) => node.id === id)) return
          set({ selectedNodeId: id }, false, `select-node:${id ?? 'none'}`)
        },
        reset: () =>
          set({ nodes: [], selectedNodeId: null }, false, 'reset-store'),

        // ---------- Project state (new) ----------
        projects: [],
        selectedProjectId: null,

        // Fetch all projects from /api/projects
        loadProjects: async () => {
          try {
            const res = await fetch('/api/projects')
            if (!res.ok) throw new Error('Failed to load projects')
            const data: Project[] = await res.json()
            set({ projects: data })
          } catch (err: any) {
            console.error('loadProjects error:', err.message)
          }
        },

        // Create a new project, then reload projects list
        createProject: async (project) => {
          try {
            const res = await fetch('/api/projects', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(project),
            })
            if (!res.ok) throw new Error('Failed to create project')
            // reload projects after creation
            await get().loadProjects()
          } catch (err: any) {
            console.error('createProject error:', err.message)
          }
        },

        // Set the currently active project
        selectProject: (id) => {
          const { projects } = get()
          if (id && !projects.some((p) => p.id === id)) return
          set({ selectedProjectId: id })
        },
      }),
      {
        name: 'cw-project-store',
        version: 1,
      }
    ),
    {
      name: 'project-store',
      enabled: process.env.NODE_ENV !== 'production',
    }
  )
)
