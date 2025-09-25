'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type NodeStatus = 'idle' | 'generating' | 'ready' | 'error'

export interface FeatureNodeState {
  id: string
  title: string
  status: NodeStatus
}

interface ProjectState {
  nodes: FeatureNodeState[]
  selectedNodeId: string | null
  upsertNode: (node: FeatureNodeState) => void
  setNodeStatus: (id: string, status: NodeStatus) => void
  deleteNode: (id: string) => void
  selectNode: (id: string | null) => void
  reset: () => void
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
                node.id === id
                  ? {
                      ...node,
                      status,
                    }
                  : node
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
          if (id && !nodes.some((node) => node.id === id)) {
            return
          }
          set({ selectedNodeId: id }, false, `select-node:${id ?? 'none'}`)
        },
        reset: () =>
          set({ nodes: [], selectedNodeId: null }, false, 'reset-store'),
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
