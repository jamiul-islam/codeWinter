'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Node, Edge } from 'reactflow'

export type NodeStatus = 'idle' | 'generating' | 'ready' | 'error'
export type PrdStatus = 'idle' | 'generating' | 'ready' | 'error'

export interface FeatureNodeState extends Node {
  status: NodeStatus
}

export interface PrdState {
  status: PrdStatus
  prdId?: string
  error?: string
  lastGenerated?: string
}

interface ProjectState {
  currentProjectId: string | null

  nodes: FeatureNodeState[]
  edges: Edge[]
  selectedNodeId: string | null

  // PRD state management
  selectedFeatureId: string | null
  sidePanelOpen: boolean
  prdStatuses: Record<string, PrdState>

  // Node methods
  upsertNode: (node: FeatureNodeState) => void
  setNodeStatus: (id: string, status: NodeStatus) => void
  deleteNode: (id: string) => void
  selectNode: (id: string | null) => void

  // Edge methods
  addEdge: (edge: Edge) => void
  deleteEdge: (id: string) => void
  resetEdges: () => void

  // PRD methods
  setSelectedFeature: (id: string | null) => void
  toggleSidePanel: () => void
  setSidePanelOpen: (open: boolean) => void
  updatePrdStatus: (featureId: string, status: PrdState) => void
  generatePrd: (featureId: string, projectId: string) => Promise<void>

  // Project ID
  setCurrentProjectId: (id: string | null) => void

  // Reset entire store
  reset: () => void
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    persist(
      (set, get) => ({
        currentProjectId: null,
        nodes: [],
        edges: [],
        selectedNodeId: null,

        // PRD state
        selectedFeatureId: null,
        sidePanelOpen: false,
        prdStatuses: {},

        // Node methods
        upsertNode: (node) => {
          set(
            (state) => {
              const index = state.nodes.findIndex((n) => n.id === node.id)
              if (index === -1) return { nodes: [...state.nodes, node] }
              const nextNodes = [...state.nodes]
              nextNodes[index] = { ...nextNodes[index], ...node }
              return { nodes: nextNodes }
            },
            false,
            `upsert-node:${node.id}`
          )
        },

        setNodeStatus: (id, status) => {
          set(
            (state) => ({
              nodes: state.nodes.map((n) =>
                n.id === id ? { ...n, status } : n
              ),
            }),
            false,
            `set-status:${id}`
          )
        },

        deleteNode: (id) => {
          set(
            (state) => ({
              nodes: state.nodes.filter((n) => n.id !== id),
              edges: state.edges.filter(
                (e) => e.source !== id && e.target !== id
              ),
              selectedNodeId:
                state.selectedNodeId === id ? null : state.selectedNodeId,
            }),
            false,
            `delete-node:${id}`
          )
        },

        selectNode: (id) => {
          const { nodes } = get()
          if (id && !nodes.some((n) => n.id === id)) return
          set({ selectedNodeId: id }, false, `select-node:${id ?? 'none'}`)
        },

        // Edge methods
        addEdge: (edge) =>
          set(
            (state) => ({ edges: [...state.edges, edge] }),
            false,
            `add-edge:${edge.id}`
          ),
        deleteEdge: (id) =>
          set(
            (state) => ({ edges: state.edges.filter((e) => e.id !== id) }),
            false,
            `delete-edge:${id}`
          ),
        resetEdges: () => set({ edges: [] }, false, 'reset-edges'),

        // PRD methods
        setSelectedFeature: (id) => {
          set(
            { selectedFeatureId: id },
            false,
            `select-feature:${id ?? 'none'}`
          )
        },

        toggleSidePanel: () => {
          set(
            (state) => ({ sidePanelOpen: !state.sidePanelOpen }),
            false,
            'toggle-side-panel'
          )
        },

        setSidePanelOpen: (open) => {
          set({ sidePanelOpen: open }, false, `set-side-panel:${open}`)
        },

        updatePrdStatus: (featureId, status) => {
          set(
            (state) => ({
              prdStatuses: {
                ...state.prdStatuses,
                [featureId]: status,
              },
            }),
            false,
            `update-prd-status:${featureId}`
          )
        },

        generatePrd: async (featureId, projectId) => {
          const { updatePrdStatus } = get()

          try {
            // Set generating status
            updatePrdStatus(featureId, { status: 'generating' })

            const response = await fetch('/api/prd/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ featureId, projectId }),
            })

            const result = await response.json()

            if (response.ok) {
              updatePrdStatus(featureId, {
                status: result.status,
                prdId: result.prdId,
              })
            } else {
              updatePrdStatus(featureId, {
                status: 'error',
                error: result.error || 'Generation failed',
              })
            }
          } catch (error: unknown) {
            updatePrdStatus(featureId, {
              status: 'error',
              error: error instanceof Error ? error.message : 'Unknown error',
            })
          }
        },

        // Project ID
        setCurrentProjectId: (id) => set({ currentProjectId: id }),

        // Reset store
        reset: () =>
          set(
            {
              currentProjectId: null,
              nodes: [],
              edges: [],
              selectedNodeId: null,
              selectedFeatureId: null,
              sidePanelOpen: false,
              prdStatuses: {},
            },
            false,
            'reset-store'
          ),
      }),
      { name: 'cw-project-store', version: 3 }
    ),
    { name: 'project-store', enabled: process.env.NODE_ENV !== 'production' }
  )
)
