'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'

import { cn } from '@/lib/utils'
import type { NodeStatus } from '@/lib/store/project-store'
import { PrdStatusBadge } from './PrdStatusBadge'

type FeatureNodeData = {
  kind: 'feature'
  featureId: string
  title: string
  note?: string | null
  status: NodeStatus
  order?: number
  prdStatus?: 'idle' | 'generating' | 'ready' | 'error'
  prdError?: string
  onRename?: (featureId: string, currentTitle: string) => void
  onDelete?: (featureId: string, currentTitle: string) => void
  onPrdClick?: (featureId: string, title: string) => void
}

const statusConfig: Record<
  NodeStatus,
  { color: string; label: string; glow: string }
> = {
  idle: {
    color: 'bg-slate-500/60',
    label: 'Idle',
    glow: 'shadow-slate-500/20',
  },
  generating: {
    color: 'bg-cyan-300',
    label: 'Generating',
    glow: 'shadow-cyan-300/30',
  },
  ready: {
    color: 'bg-emerald-400',
    label: 'Ready',
    glow: 'shadow-emerald-400/30',
  },
  error: {
    color: 'bg-rose-400',
    label: 'Error',
    glow: 'shadow-rose-400/30',
  },
}

export const FeatureNode = memo(({ data }: NodeProps<FeatureNodeData>) => {
  const status = statusConfig[data.status] ?? statusConfig.idle

  return (
    <div
      className={cn(
        'group min-w-[220px] max-w-[260px] rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-lg shadow-black/40 backdrop-blur transition duration-300',
        'hover:border-cyan-400/40 hover:shadow-cyan-500/20'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'flex size-2.5 items-center justify-center rounded-full shadow',
                status.color,
                status.glow
              )}
            />
            <span className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
              {status.label}
            </span>
          </div>
          <h3 className="text-base font-semibold leading-5 text-white">
            {data.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <IconButton
            aria-label="Rename feature"
            onClick={() => data.onRename?.(data.featureId, data.title)}
          >
            <PencilIcon />
          </IconButton>
          <IconButton
            aria-label="Delete feature"
            onClick={() => data.onDelete?.(data.featureId, data.title)}
          >
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      {data.note && (
        <p className="mt-3 line-clamp-4 text-xs leading-5 text-slate-300">
          {data.note}
        </p>
      )}

      {/* PRD Status Badge */}
      <div className="mt-3 flex items-center justify-between">
        <PrdStatusBadge 
          status={data.prdStatus || 'idle'} 
          error={data.prdError}
          showText={false}
          className="cursor-pointer"
          onClick={() => data.onPrdClick?.(data.featureId, data.title)}
        />
        <button
          onClick={() => data.onPrdClick?.(data.featureId, data.title)}
          className="text-xs text-slate-400 hover:text-cyan-300 transition-colors"
        >
          View PRD
        </button>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!size-3 rounded-full border border-cyan-300/60 bg-cyan-200"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!size-3 rounded-full border border-violet-400/60 bg-violet-300"
      />
    </div>
  )
})

FeatureNode.displayName = 'FeatureNode'

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

function IconButton({ className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex size-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition',
        'hover:border-cyan-300/50 hover:bg-cyan-400/10 hover:text-cyan-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300',
        className
      )}
      {...props}
    />
  )
}

function PencilIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M3 14.5v2.5h2.5l9-9-2.5-2.5-9 9Z" strokeLinejoin="round" />
      <path d="M12.5 5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M4 6h12" strokeLinecap="round" />
      <path d="M8.5 6.5v-2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2" strokeLinecap="round" />
      <path d="M6.5 6h7l-.5 9a1 1 0 0 1-1 .92h-3.5a1 1 0 0 1-1-.92L6.5 6Z" strokeLinejoin="round" />
    </svg>
  )
}
