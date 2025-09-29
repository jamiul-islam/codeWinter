'use client'

import { useState, useEffect } from 'react'
import {
  X,
  FileText,
  Code,
  Settings,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PrdViewer } from '@/components/prd/PrdViewer'
import { PrdStatusBadge } from '@/components/graph/nodes/PrdStatusBadge'
import { prdToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

type TabType = 'summary' | 'prd' | 'json' | 'actions'
type PrdStatus = 'idle' | 'generating' | 'ready' | 'error'

interface PrdData {
  id?: string
  status: PrdStatus
  summary?: string
  prdMd?: string
  prdJson?: any
  error?: string
  lastGenerated?: string
}

interface NodeSidePanelProps {
  featureId: string | null
  featureTitle?: string
  projectId?: string
  isOpen: boolean
  onClose: () => void
}

export function NodeSidePanel({
  featureId,
  featureTitle = 'Feature',
  projectId,
  isOpen,
  onClose,
}: NodeSidePanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary')
  const [prdData, setPrdData] = useState<PrdData | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [wasGenerating, setWasGenerating] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  // Fetch PRD data when feature changes
  useEffect(() => {
    if (featureId && isOpen) {
      fetchPrdData()
    }
  }, [featureId, isOpen])

  // Poll for status updates when generating
  useEffect(() => {
    if (prdData?.status === 'generating') {
      setWasGenerating(true)
      const interval = setInterval(fetchPrdData, 2000)
      return () => clearInterval(interval)
    } else if (wasGenerating && prdData?.status === 'ready') {
      // Show success toast when generation completes
      if (isRegenerating) {
        prdToast.regenerateSuccess(featureTitle)
      } else {
        prdToast.generateSuccess(featureTitle)
      }
      setWasGenerating(false)
      setIsRegenerating(false)
    } else if (wasGenerating && prdData?.status === 'error') {
      // Show error toast when generation fails
      if (isRegenerating) {
        prdToast.regenerateError(featureTitle, prdData.error || 'Generation failed')
      } else {
        prdToast.generateError(featureTitle, prdData.error || 'Generation failed')
      }
      setWasGenerating(false)
      setIsRegenerating(false)
    }
  }, [prdData?.status, wasGenerating, isRegenerating, featureTitle])

  // Only show toast notifications for user-initiated actions
  // Remove automatic toast on status change

  const fetchPrdData = async () => {
    if (!featureId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/features/${featureId}/prd`)

      if (response.ok) {
        const data = await response.json()
        setPrdData(data)
      } else if (response.status === 404) {
        // No PRD exists yet
        setPrdData({
          id: '',
          status: 'idle',
        })
      }
    } catch (error) {
      console.error('Failed to fetch PRD data:', error)
      setPrdData({
        id: '',
        status: 'error',
        error: 'Failed to load PRD data',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGeneratePrd = async (regenerate = false) => {
    if (!featureId || !projectId) return

    try {
      setGenerating(true)
      setIsRegenerating(regenerate)

      // Show toast notification
      if (regenerate) {
        prdToast.regenerateStarted(featureTitle)
      } else {
        prdToast.generateStarted(featureTitle)
      }

      const response = await fetch('/api/prd/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureId,
          projectId,
          regenerate,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setPrdData((prev) => ({
          ...prev,
          id: result.prdId,
          status: result.status,
        }))

        // Switch to PRD tab when generation starts
        if (result.status === 'generating') {
          setActiveTab('prd')
        }
      } else {
        setPrdData((prev) => ({
          ...prev,
          status: 'error',
          error: result.error || 'Generation failed',
        }))

        // Show error toast
        if (result.error?.includes('API key')) {
          prdToast.apiKeyMissing()
        } else {
          prdToast.generateError(
            featureTitle,
            result.error || 'Generation failed'
          )
        }
      }
    } catch (error) {
      console.error('PRD generation failed:', error)
      setPrdData((prev) => ({
        ...prev,
        status: 'error',
        error: 'Network error',
      }))
      if (isRegenerating) {
        prdToast.regenerateError(featureTitle, 'Network error')
      } else {
        prdToast.generateError(featureTitle, 'Network error')
      }
    } finally {
      setGenerating(false)
      setIsRegenerating(false)
    }
  }

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'prd', label: 'PRD', icon: FileText },
    { id: 'json', label: 'JSON', icon: Code },
    { id: 'actions', label: 'Actions', icon: Settings },
  ] as const

  if (!isOpen || !featureId) return null

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-[600px] flex-col border-l border-slate-700 bg-slate-900 shadow-xl">
      {/* Header */}
      <div className="border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-medium text-white">
              Feature: {featureTitle}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2">
            <X className="size-4" />
          </button>
        </div>
        {loading ? (
          <div className="mt-1">
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-700" />
          </div>
        ) : (
          prdData && (
            <div className="mt-1">
              <PrdStatusBadge status={prdData.status} error={prdData.error} />
            </div>
          )
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-b-2 border-cyan-400 bg-slate-800/50 text-cyan-400'
                  : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-300'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          </div>
        ) : (
          <>
            {activeTab === 'summary' && (
              <div className="p-4">
                <h3 className="mb-2 text-sm font-medium text-slate-200">
                  Summary
                </h3>
                {prdData?.summary ? (
                  <p className="text-sm leading-relaxed text-slate-300">
                    {prdData.summary}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 italic">
                    No summary available. Generate a PRD to see the summary.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'prd' && (
              <div className="flex flex-1 flex-col overflow-hidden">
                {prdData?.prdMd && prdData.id ? (
                  <PrdViewer
                    markdown={prdData.prdMd}
                    prdId={prdData.id}
                    featureTitle={featureTitle}
                    hideTitle={true}
                    className="flex-1"
                  />
                ) : prdData?.status === 'generating' ? (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                    <p className="text-slate-300">Generating PRD...</p>
                    <p className="mt-1 text-sm text-slate-500">
                      This may take up to 3 minutes
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-center text-center">
                    <p className="text-sm text-slate-500">
                      No PRD available. Generate one to see the content.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'json' && (
              <div className="flex flex-1 flex-col overflow-hidden">
                {prdData?.prdJson ? (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-700 p-4">
                      <h3 className="text-sm font-medium text-slate-200">
                        Structured Data
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              JSON.stringify(prdData.prdJson, null, 4)
                            )
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                          } catch (error) {
                            console.error('Failed to copy JSON:', error)
                          }
                        }}
                        disabled={copied}
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span className="ml-2">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span className="ml-2">Copy JSON</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                      <pre className="rounded-lg bg-slate-800 p-4 font-mono text-sm leading-relaxed break-words whitespace-pre-wrap text-slate-300">
                        {JSON.stringify(prdData.prdJson, null, 4)}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center text-center">
                    <p className="text-sm text-slate-500 italic">
                      No structured data available.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="space-y-4 p-4">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-slate-200">
                    PRD Actions
                  </h3>

                  {prdData?.status === 'idle' || prdData?.status === 'error' ? (
                    <Button
                      onClick={() => handleGeneratePrd(false)}
                      disabled={generating}
                      variant="primary"
                      className="w-full"
                    >
                      {generating ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Generating...
                        </>
                      ) : (
                        'Generate PRD'
                      )}
                    </Button>
                  ) : prdData?.status === 'ready' ? (
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleGeneratePrd(true)}
                        disabled={generating}
                        variant="secondary"
                        className="w-full"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate PRD
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-sm text-slate-500">
                      PRD is currently being generated...
                    </div>
                  )}
                </div>

                {prdData?.lastGenerated && (
                  <div className="text-xs text-slate-500">
                    Last generated:{' '}
                    {new Date(prdData.lastGenerated).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
