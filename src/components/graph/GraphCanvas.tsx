'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Edge,
  type Node,
  type NodeChange,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import debounce from 'lodash.debounce'

import { AppCardNode, FeatureHubNode, FeatureNode } from '@/components/graph/nodes'
import { NodeSidePanel } from '@/components/graph/NodeSidePanel'
import {
  Modal,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProjectStore, type FeatureNodeState } from '@/lib/store/project-store'

type RenameState = { id: string; title: string }
type DeleteState = { id: string; title: string }

const nodeTypes = {
  appCard: AppCardNode,
  featureHub: FeatureHubNode,
  featureNode: FeatureNode,
}

export const GraphCanvas: React.FC = () => (
  <ReactFlowProvider>
    <GraphCanvasInner />
  </ReactFlowProvider>
)

function GraphCanvasInner() {
  const nodes = useProjectStore((state) => state.nodes)
  const edges = useProjectStore((state) => state.edges)
  const upsertNode = useProjectStore((state) => state.upsertNode)
  const deleteNode = useProjectStore((state) => state.deleteNode)
  const currentProjectId = useProjectStore((state) => state.currentProjectId)
  
  // PRD state
  const selectedFeatureId = useProjectStore((state) => state.selectedFeatureId)
  const sidePanelOpen = useProjectStore((state) => state.sidePanelOpen)
  const prdStatuses = useProjectStore((state) => state.prdStatuses)
  const setSelectedFeature = useProjectStore((state) => state.setSelectedFeature)
  const setSidePanelOpen = useProjectStore((state) => state.setSidePanelOpen)

  const [renameTarget, setRenameTarget] = useState<RenameState | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [renameError, setRenameError] = useState<string | null>(null)
  const [isRenaming, setIsRenaming] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<DeleteState | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { fitView } = useReactFlow()

  const refreshFeatureHubCount = useCallback(() => {
    const currentNodes = useProjectStore.getState().nodes
    const featureCount = currentNodes.filter((node) => {
      const payload = node.data as Record<string, unknown> | undefined
      return payload?.kind === 'feature'
    }).length

    const hubNode = currentNodes.find((node) => {
      const payload = node.data as Record<string, unknown> | undefined
      return payload?.kind === 'feature-hub'
    }) as FeatureNodeState | undefined

    if (!hubNode) return

    upsertNode({
      ...hubNode,
      data: {
        ...(hubNode.data as Record<string, unknown>),
        featureCount,
      },
    })
  }, [upsertNode])

  const persistGraph = useMemo(
    () =>
      debounce(async (nodesToPersist: Node[], edgesToPersist: Edge[]) => {
        if (!currentProjectId) return
        try {
          await fetch(`/api/projects/${currentProjectId}/graph`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nodes: nodesToPersist, edges: edgesToPersist }),
          })
        } catch (error) {
          console.error('Failed to persist graph', error)
        }
      }, 500),
    [currentProjectId]
  )

  useEffect(() => () => persistGraph.cancel(), [persistGraph])

  useEffect(() => {
    if (!nodes.length) return
    const raf = requestAnimationFrame(() => {
      try {
        fitView({ padding: 0.2, duration: 400 })
      } catch (error) {
        console.error('Failed to fit view', error)
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [nodes.length, fitView])

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      let updatedNodes: FeatureNodeState[] = [...nodes]

      changes.forEach((change) => {
        if (change.type === 'position') {
          const node = updatedNodes.find((item) => item.id === change.id)
          if (!node) return
          const nextNode = { ...node, position: change.position ?? node.position }
          upsertNode(nextNode)
          updatedNodes = updatedNodes.map((item) =>
            item.id === node.id ? nextNode : item
          )
        }
      })

      persistGraph(updatedNodes, edges)
    },
    [nodes, edges, upsertNode, persistGraph]
  )

  const handlePrdClick = useCallback((featureId: string, title: string) => {
    setSelectedFeature(featureId)
    setSidePanelOpen(true)
  }, [setSelectedFeature, setSidePanelOpen])

  const handleCloseSidePanel = useCallback(() => {
    setSidePanelOpen(false)
    setSelectedFeature(null)
  }, [setSidePanelOpen, setSelectedFeature])

  const interactiveNodes = useMemo(
    () =>
      nodes.map((node) => {
        const payload = (node.data ?? {}) as Record<string, unknown>
        if (payload.kind === 'feature') {
          const featureId = payload.featureId as string
          const prdStatus = prdStatuses[featureId]
          
          return {
            ...node,
            draggable: true,
            data: {
              ...payload,
              prdStatus: prdStatus?.status || 'idle',
              prdError: prdStatus?.error,
              onRename: (id: string, title: string) => {
                setRenameTarget({ id, title })
                setRenameValue(title)
                setRenameError(null)
              },
              onDelete: (id: string, title: string) => {
                setDeleteTarget({ id, title })
                setDeleteError(null)
              },
              onPrdClick: handlePrdClick,
            },
          }
        }

        return {
          ...node,
          draggable: false,
        }
      }),
    [nodes, prdStatuses, handlePrdClick]
  )

  const closeRename = () => {
    setRenameTarget(null)
    setRenameValue('')
    setRenameError(null)
  }

  const submitRename = async () => {
    if (!renameTarget) return
    const nextTitle = renameValue.trim()
    if (!nextTitle || nextTitle.length < 2) {
      setRenameError('Title must be at least 2 characters long.')
      return
    }

    if (nextTitle === renameTarget.title) {
      closeRename()
      return
    }

    const existingNode = nodes.find((node) => node.id === renameTarget.id)
    if (!existingNode) {
      closeRename()
      return
    }

    const fallbackNode = existingNode
    const updatedNode: FeatureNodeState = {
      ...existingNode,
      data: {
        ...(existingNode.data as Record<string, unknown>),
        title: nextTitle,
      },
    }

    upsertNode(updatedNode)
    setIsRenaming(true)

    try {
      const response = await fetch(`/api/features/${renameTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: nextTitle }),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        const message = errorBody?.error || 'Failed to rename feature'
        throw new Error(message)
      }

      persistGraph(
        useProjectStore.getState().nodes,
        useProjectStore.getState().edges
      )
      closeRename()
    } catch (error) {
      console.error(error)
      setRenameError(error instanceof Error ? error.message : 'Unable to rename feature')
      upsertNode(fallbackNode)
    } finally {
      setIsRenaming(false)
    }
  }

  const closeDelete = () => {
    setDeleteTarget(null)
    setDeleteError(null)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/features/${deleteTarget.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        const message = errorBody?.error || 'Failed to delete feature'
        throw new Error(message)
      }

      deleteNode(deleteTarget.id)
      refreshFeatureHubCount()
      persistGraph(
        useProjectStore.getState().nodes,
        useProjectStore.getState().edges
      )
      closeDelete()
    } catch (error) {
      console.error(error)
      setDeleteError(error instanceof Error ? error.message : 'Unable to delete feature')
    } finally {
      setIsDeleting(false)
    }
  }

  // Get selected feature data
  const selectedFeature = selectedFeatureId 
    ? nodes.find(node => {
        const payload = (node.data ?? {}) as Record<string, unknown>
        return payload.featureId === selectedFeatureId
      })
    : null
  
  const selectedFeatureTitle = selectedFeature 
    ? ((selectedFeature.data as any)?.title || 'Feature')
    : undefined

  return (
    <>
      <div className="relative h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/20">
        <ReactFlow
          nodes={interactiveNodes as Node[]}
          edges={edges}
          onNodesChange={handleNodesChange}
          fitView
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          panOnScroll
          selectionOnDrag
          style={{ width: '100%', height: '100%' }}
        >
          <MiniMap
            nodeStrokeColor={(node) =>
              node.type === 'featureNode' ? '#6EE7F9' : '#A78BFA'
            }
            nodeColor={(node) =>
              node.type === 'featureNode' ? '#0f172a' : '#1e293b'
            }
          />
          <Controls className="rounded-full border border-white/10 bg-slate-900/80 text-slate-100" />
          <Background gap={24} color="rgba(148, 163, 184, 0.12)" />
        </ReactFlow>

        <RenameModal
          isOpen={Boolean(renameTarget)}
          currentTitle={renameTarget?.title ?? ''}
          value={renameValue}
          error={renameError}
          isSaving={isRenaming}
          onChange={setRenameValue}
          onClose={closeRename}
          onSubmit={submitRename}
        />

        <DeleteModal
          isOpen={Boolean(deleteTarget)}
          featureTitle={deleteTarget?.title ?? ''}
          isDeleting={isDeleting}
          error={deleteError}
          onClose={closeDelete}
          onConfirm={confirmDelete}
        />
      </div>

      {/* PRD Side Panel */}
      <NodeSidePanel
        featureId={selectedFeatureId}
        featureTitle={selectedFeatureTitle}
        projectId={currentProjectId || undefined}
        isOpen={sidePanelOpen}
        onClose={handleCloseSidePanel}
      />
    </>
  )
}

interface RenameModalProps {
  isOpen: boolean
  currentTitle: string
  value: string
  error: string | null
  isSaving: boolean
  onChange: (value: string) => void
  onSubmit: () => void
  onClose: () => void
}

function RenameModal({
  isOpen,
  currentTitle,
  value,
  error,
  isSaving,
  onChange,
  onSubmit,
  onClose,
}: RenameModalProps) {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>Rename feature</ModalTitle>
        <ModalDescription>
          Give <span className="font-semibold text-white">{currentTitle}</span> a new label.
        </ModalDescription>
      </ModalHeader>

      <Input
        value={value}
        autoFocus
        placeholder="Feature title"
        onChange={(event) => onChange(event.target.value)}
        className="mt-2"
      />

      {error && (
        <p className="mt-3 text-sm text-rose-300">{error}</p>
      )}

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

interface DeleteModalProps {
  isOpen: boolean
  featureTitle: string
  isDeleting: boolean
  error: string | null
  onConfirm: () => void
  onClose: () => void
}

function DeleteModal({
  isOpen,
  featureTitle,
  isDeleting,
  error,
  onConfirm,
  onClose,
}: DeleteModalProps) {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>Delete feature</ModalTitle>
        <ModalDescription>
          This removes <span className="font-semibold text-white">{featureTitle}</span> and any generated PRDs.
        </ModalDescription>
      </ModalHeader>

      <p className="text-sm text-slate-300">
        This action cannot be undone. The node, its edges, and stored PRDs will be deleted.
      </p>

      {error && (
        <p className="mt-3 text-sm text-rose-300">{error}</p>
      )}

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isDeleting}
          className="bg-rose-500 text-white shadow shadow-rose-500/30 hover:bg-rose-400"
        >
          {isDeleting ? 'Deleting...' : 'Delete node'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
