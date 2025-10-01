'use client'

import { formatDistanceToNow } from 'date-fns'
import { FileText, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PrdCardProps {
  featureId: string
  featureTitle: string
  prdStatus: 'idle' | 'generating' | 'ready' | 'error'
  prdPreview?: string
  lastUpdated?: string
  prdError?: string
  onClick: () => void
}

const statusConfig = {
  idle: {
    label: 'No PRD',
    color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    icon: FileText,
  },
  generating: {
    label: 'Generating',
    color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    icon: Loader2,
  },
  ready: {
    label: 'Ready',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: FileText,
  },
  error: {
    label: 'Error',
    color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    icon: AlertCircle,
  },
}

export function PrdCard({
  featureTitle,
  prdStatus,
  prdPreview,
  lastUpdated,
  prdError,
  onClick,
}: PrdCardProps) {
  const config = statusConfig[prdStatus]
  const StatusIcon = config.icon

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex min-h-[180px] w-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-lg backdrop-blur transition-all duration-300',
        'hover:border-cyan-400/40 hover:bg-cyan-400/5 hover:shadow-cyan-500/20',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400',
        prdStatus === 'ready' && 'cursor-pointer',
        prdStatus === 'generating' && 'cursor-wait'
      )}
      disabled={prdStatus === 'idle' || prdStatus === 'error'}
    >
      {/* Content */}
      <div className="flex-1 space-y-3">
        {/* Title */}
        <h3
          className="text-lg font-semibold text-white group-hover:text-cyan-100"
          title={featureTitle}
        >
          {featureTitle.length > 25
            ? `${featureTitle.slice(0, 25)}...`
            : featureTitle}
        </h3>

        {/* Preview or Error Message */}
        {prdStatus === 'ready' && prdPreview && (
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-300">
            {prdPreview}
          </p>
        )}

        {prdStatus === 'error' && prdError && (
          <p className="text-sm text-rose-400">{prdError}</p>
        )}

        {prdStatus === 'generating' && (
          <p className="text-sm text-cyan-400">Generating PRD...</p>
        )}

        {/* Status Badge */}
        <div className="flex items-center">
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
              config.color
            )}
          >
            <StatusIcon
              className={cn(
                'h-3 w-3',
                prdStatus === 'generating' && 'animate-spin'
              )}
            />
            {config.label}
          </div>
        </div>

        {prdStatus === 'idle' && (
          <p className="text-sm text-slate-400">
            Generate a PRD from the graph canvas
          </p>
        )}
      </div>

      {/* Footer */}
      {lastUpdated && prdStatus === 'ready' && (
        <div className="mt-4 flex items-center gap-1.5 border-t border-white/5 pt-3 text-xs text-slate-400">
          <Clock className="h-3 w-3" />
          <span>
            Updated{' '}
            {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
          </span>
        </div>
      )}
    </button>
  )
}
