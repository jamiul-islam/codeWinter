'use client'

import { useEffect, useState, useCallback, use } from 'react'
import type { Edge, Node } from 'reactflow'

import { useProjectStore, type FeatureNodeState } from '@/lib/store/project-store'
import { PageLoader } from '@/components/loaders'
import { GraphCanvas } from '@/components/graph'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PrdCard } from '@/components/prd/PrdCard'
import { EmptyPrdsState } from '@/components/prd/EmptyPrdsState'
import { NodeSidePanel } from '@/components/graph/NodeSidePanel'

interface Project {
  id: string
  name: string
  description?: string | null
  graph: ProjectGraph | null
  created_at: string
  updated_at: string
}

type StoredNode = FeatureNodeState | (Partial<FeatureNodeState> & Node)

type ProjectGraph = {
  nodes?: StoredNode[]
  edges?: Edge[]
  meta?: {
    version?: string
    generatedAt?: string
    model?: string | null
    droppedEdges?: number
    usedFallback?: boolean
  }
}

type FeatureRecord = {
  id: string
  title: string
  notes?: string | null
  position?: { x: number; y: number } | null
  feature_prds?: Array<{ status: FeatureNodeState['status'] }>
}

type FeatureWithPrd = {
  id: string
  title: string
  prdStatus: 'idle' | 'generating' | 'ready' | 'error'
  prdId?: string
  prdPreview?: string
  prdError?: string
  lastUpdated?: string
}

type FeatureEdgeRecord = {
  id: string
  source_feature_id: string
  target_feature_id: string
  metadata?: { note?: string } | null
}

type ProjectResponse = {
  project: Project
  features: FeatureRecord[]
  edges: FeatureEdgeRecord[]
}

type ErrorResponse = {
  error?: string
}

type PanelKey = 'dashboard' | 'prds' | 'settings'

const PANEL_CONFIG: Array<{
  id: PanelKey
  label: string
  description: string
  copy: string
}> = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Organize the graph canvas for this project.',
    copy: 'Keep refining your feature graph so the downstream PRDs inherit the right context.',
  },
  {
    id: 'prds',
    label: 'PRDs',
    description: 'Review the drafts generated for each feature node.',
    copy: 'Soon you will be able to browse and export PRDs that were generated from the graph.',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Tune how the canvas behaves and renders.',
    copy: 'Fine-tune interaction defaults and visual options before teammates jump into the canvas.',
  },
]

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [activePanel, setActivePanel] = useState<PanelKey>('dashboard')
  const [featuresWithPrds, setFeaturesWithPrds] = useState<FeatureWithPrd[]>([])
  const [loadingPrds, setLoadingPrds] = useState(false)

  const resetStore = useProjectStore((state) => state.reset)
  const upsertNode = useProjectStore((state) => state.upsertNode)
  const addEdgeToStore = useProjectStore((state) => state.addEdge)
  const setCurrentProjectId = useProjectStore((state) => state.setCurrentProjectId)
  const setSelectedFeature = useProjectStore((state) => state.setSelectedFeature)
  const setSidePanelOpen = useProjectStore((state) => state.setSidePanelOpen)
  const selectedFeatureId = useProjectStore((state) => state.selectedFeatureId)
  const isSidePanelOpen = useProjectStore((state) => state.sidePanelOpen)

  const fetchProjectData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/projects/${id}`)
      const data = (await res.json()) as ProjectResponse | ErrorResponse

      if (!res.ok || !('project' in data)) {
        const message = 'error' in data && data.error ? data.error : 'Failed to fetch project'
        setError(message)
        setLoading(false)
        return
      }

      const project = data.project
      const features = Array.isArray(data.features) ? data.features : []

      resetStore()
      setCurrentProjectId(project.id)
      setProject(project)

      const statusByFeatureId = new Map<string, FeatureNodeState['status']>()
      features.forEach((feature) => {
        const status = feature.feature_prds?.[0]?.status ?? 'idle'
        statusByFeatureId.set(feature.id, status)
      })

      const graph = project.graph
      if (graph && Array.isArray(graph.nodes)) {
        graph.nodes.forEach((node) => {
          const clonedNode: FeatureNodeState = {
            ...(node as FeatureNodeState),
            data: typeof node?.data === 'object' && node?.data !== null ? { ...node.data } : {},
            status: 'idle',
          }

          if (
            clonedNode.data &&
            typeof clonedNode.data === 'object' &&
            (clonedNode.data as Record<string, unknown>).kind === 'feature'
          ) {
            const featureId = clonedNode.id
            clonedNode.status = statusByFeatureId.get(featureId) ?? 'idle'
          }

          if (
            clonedNode.data &&
            typeof clonedNode.data === 'object' &&
            (clonedNode.data as Record<string, unknown>).kind === 'feature-hub'
          ) {
            ;(clonedNode.data as Record<string, unknown>).featureCount = features.length
          }

          upsertNode(clonedNode)
        })
      }

      if (graph && Array.isArray(graph.edges)) {
        graph.edges.forEach((edge) => addEdgeToStore(edge))
      }

      setLoading(false)
    } catch {
      setError('Failed to fetch project')
      setLoading(false)
    }
  }, [id, resetStore, upsertNode, addEdgeToStore, setCurrentProjectId])

  const fetchFeaturesWithPrds = useCallback(async () => {
    if (!id) return

    setLoadingPrds(true)
    try {
      const res = await fetch(`/api/projects/${id}/prds`)
      const data = await res.json()

      if (res.ok && Array.isArray(data.features)) {
        const featuresWithPrdData: FeatureWithPrd[] = data.features.map((feature: {
          id: string
          title: string
          prd: { status: string; id: string; summary: string; error: string; updated_at: string } | null
        }) => ({
          id: feature.id,
          title: feature.title,
          prdStatus: feature.prd?.status || 'idle',
          prdId: feature.prd?.id,
          prdPreview: feature.prd?.summary?.slice(0, 150),
          prdError: feature.prd?.error,
          lastUpdated: feature.prd?.updated_at,
        }))
        setFeaturesWithPrds(featuresWithPrdData)
      }
    } catch (error) {
      console.error('Failed to fetch PRDs:', error)
    } finally {
      setLoadingPrds(false)
    }
  }, [id])

  const handlePrdCardClick = useCallback((featureId: string) => {
    setSelectedFeature(featureId)
    setSidePanelOpen(true)
  }, [setSelectedFeature, setSidePanelOpen])

  const handleGoToCanvas = useCallback(() => {
    setActivePanel('dashboard')
  }, [])

  useEffect(() => {
    fetchProjectData()
    return () => {
      resetStore()
      setCurrentProjectId(null)
      setProject(null)
    }
  }, [fetchProjectData, resetStore, setCurrentProjectId])

  useEffect(() => {
    if (activePanel === 'prds') {
      fetchFeaturesWithPrds()
    }
  }, [activePanel, fetchFeaturesWithPrds])

  if (loading) return <PageLoader />

  if (error) {
    return (
      <main className="relative isolate flex min-h-screen w-full justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-12 top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-16 right-10 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-5 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-10 text-center shadow-inner shadow-rose-900/30">
          <p className="text-base font-medium text-rose-100">{error}</p>
          <p className="text-sm text-rose-100/80">
            Something disrupted the project workspace. Try again in a moment to reload your canvas.
          </p>
          <Button onClick={fetchProjectData} variant="secondary" size="sm">
            Retry
          </Button>
        </div>
      </main>
    )
  }

  const activeConfig = PANEL_CONFIG.find((panel) => panel.id === activePanel) ?? PANEL_CONFIG[0]
  const formattedUpdatedAt = project?.updated_at
    ? new Date(project.updated_at).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null

  return (
    <main className="relative isolate flex min-h-screen w-full justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-12 top-24 hidden h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl md:block" />
        <div className="absolute bottom-16 right-4 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
        <aside className="hidden w-[260px] flex-shrink-0 flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-black/30 lg:flex">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Project</p>
            <h2 className="text-2xl font-semibold text-white">
              {project?.name ?? 'Project workspace'}
            </h2>
            <p className="text-xs text-slate-300">ID: {id}</p>
            {formattedUpdatedAt && (
              <p className="text-xs text-slate-400/80">Last updated {formattedUpdatedAt}</p>
            )}
          </div>

          <nav className="flex flex-col gap-3">
            {PANEL_CONFIG.map((panel) => (
              <button
                key={panel.id}
                type="button"
                onClick={() => setActivePanel(panel.id)}
                className={cn(
                  'w-full rounded-2xl border px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300',
                  activePanel === panel.id
                    ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200 shadow-lg shadow-cyan-500/20'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/40 hover:bg-cyan-400/5'
                )}
              >
                <span className="text-sm font-medium">{panel.label}</span>
                <p
                  className={cn(
                    'mt-1 text-xs',
                    activePanel === panel.id ? 'text-cyan-100/90' : 'text-slate-300'
                  )}
                >
                  {panel.description}
                </p>
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-black/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
                  {activeConfig.label}
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-white">
                  {project?.name ?? 'Project workspace'}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-300">{activeConfig.copy}</p>
              </div>
              {formattedUpdatedAt && (
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
                  Updated {formattedUpdatedAt}
                </div>
              )}
            </div>

            <nav className="mt-6 grid gap-3 sm:grid-cols-3 lg:hidden">
              {PANEL_CONFIG.map((panel) => (
                <button
                  key={panel.id}
                  type="button"
                  onClick={() => setActivePanel(panel.id)}
                  className={cn(
                    'rounded-2xl border px-4 py-3 text-left text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300',
                    activePanel === panel.id
                      ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200 shadow-lg shadow-cyan-500/20'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/40 hover:bg-cyan-400/5'
                  )}
                >
                  {panel.label}
                </button>
              ))}
            </nav>
          </div>

          {activePanel === 'dashboard' && (
            <section className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-black/30">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Graph canvas</h2>
                    <p className="text-sm text-slate-300">
                      Update nodes and edges. Changes auto-save to this project.
                    </p>
                  </div>
                  <div className="text-xs text-slate-400">
                    Canvas synced with project ID {id}
                  </div>
                </div>
                <div className="mt-6">
                  <GraphCanvas />
                </div>
              </div>
            </section>
          )}

          {activePanel === 'prds' && (
            <div className="space-y-6">
              {loadingPrds ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400" />
                    <p className="mt-4 text-sm text-slate-400">Loading PRDs...</p>
                  </div>
                </div>
              ) : featuresWithPrds.length === 0 ? (
                <EmptyPrdsState onGoToCanvas={handleGoToCanvas} />
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuresWithPrds.map((feature) => (
                    <PrdCard
                      key={feature.id}
                      featureId={feature.id}
                      featureTitle={feature.title}
                      prdStatus={feature.prdStatus}
                      prdPreview={feature.prdPreview}
                      lastUpdated={feature.lastUpdated}
                      prdError={feature.prdError}
                      onClick={() => handlePrdCardClick(feature.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activePanel === 'settings' && (
            <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-inner shadow-black/30">
              <div>
                <h2 className="text-xl font-semibold text-white">Canvas preferences</h2>
                <p className="mt-2 text-sm text-slate-300">
                  Configure how interactions behave. We will wire these controls in the next phase.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Snap to grid',
                    desc: 'Align nodes to a subtle grid to keep the graph tidy.',
                  },
                  {
                    title: 'Auto-layout suggestions',
                    desc: 'Let the agent propose node placement when a graph grows dense.',
                  },
                  {
                    title: 'Edge routing style',
                    desc: 'Choose the default curvature for new connections.',
                  },
                ].map((setting) => (
                  <div
                    key={setting.title}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/20 sm:flex-row sm:items-center"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-white">{setting.title}</h3>
                      <p className="mt-1 text-xs text-slate-300">{setting.desc}</p>
                    </div>
                    <Button variant="secondary" size="sm" disabled>
                      Configure soon
                    </Button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-5 text-left shadow-inner shadow-cyan-500/20">
                <h3 className="text-sm font-semibold text-cyan-100">
                  Coming later in E4 &amp; E5
                </h3>
                <p className="mt-2 text-xs text-cyan-50/80">
                  These controls will hook into project-level preferences so multi-tenant teams can
                  keep consistent graph behaviors across contributors.
                </p>
              </div>
            </section>
          )}
        </section>
      </div>

      {/* Node Side Panel for PRD viewing/editing */}
      <NodeSidePanel
        featureId={selectedFeatureId}
        featureTitle={
          featuresWithPrds.find(f => f.id === selectedFeatureId)?.title || 
          'Feature'
        }
        projectId={id}
        isOpen={isSidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
      />
    </main>
  )
}
