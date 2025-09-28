'use client'

import React, { useEffect, useCallback } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  addEdge,
  Connection,
  EdgeChange,
  NodeChange,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useProjectStore } from '@/lib/store/project-store'

// lodash.debounce is a small utility to debounce function calls
import debounce from 'lodash.debounce'

export const GraphCanvas: React.FC = () => {
  const nodes = useProjectStore((state) => state.nodes)
  const edges = useProjectStore((state) => state.edges)
  const upsertNode = useProjectStore((state) => state.upsertNode)
  const addEdgeToStore = useProjectStore((state) => state.addEdge)
  const deleteEdgeFromStore = useProjectStore((state) => state.deleteEdge)

  // currentProjectId from store so persistence knows which project to update
  const currentProjectId = useProjectStore((state) => state.currentProjectId)

  const [localEdges, setLocalEdges] = React.useState<Edge[]>([])

  // Initialize local edges from store
  useEffect(() => {
    setLocalEdges(edges)
  }, [edges])

  // debounced persist function to avoid spamming API
  const persistGraph = useCallback(
    debounce(async (nodes: Node[], edges: Edge[]) => {
      if (!currentProjectId) return
      try {
        await fetch(`/api/projects/${currentProjectId}/graph`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodes, edges }),
        })
      } catch (err) {
        console.error('Failed to persist graph:', err)
      }
    }, 500),
    [currentProjectId]
  )

  // Handle node position changes
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      let updatedNodes = [...nodes]
      changes.forEach((change) => {
        if (change.type === 'position') {
          const node = updatedNodes.find((n) => n.id === change.id)
          if (node) {
            const newNode = { ...node, position: change.position! }
            upsertNode(newNode)
            updatedNodes = updatedNodes.map((n) =>
              n.id === node.id ? newNode : n
            )
          }
        }
      })
      // persist with latest nodes + edges
      persistGraph(updatedNodes, localEdges)
    },
    [nodes, upsertNode, localEdges, persistGraph]
  )

  // Handle edge changes (remove)
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setLocalEdges((prev) => {
        let updated = [...prev]
        changes.forEach((change) => {
          if (change.type === 'remove') {
            updated = updated.filter((e) => e.id !== change.id)
            deleteEdgeFromStore(change.id!)
          }
        })
        // persist with latest nodes + edges
        persistGraph(nodes, updated)
        return updated
      })
    },
    [nodes, deleteEdgeFromStore, persistGraph]
  )

  // Add new edge
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdges = addEdge(connection, localEdges)
      setLocalEdges(newEdges)
      newEdges.forEach((e) => addEdgeToStore(e))
      // persist with latest nodes + edges
      persistGraph(nodes, newEdges)
    },
    [nodes, localEdges, addEdgeToStore, persistGraph]
  )

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/20">
      <ReactFlow
        nodes={nodes as Node[]}
        edges={localEdges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        style={{ width: '100%', height: '100%' }}
      >
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  )
}
