'use client'

import { cn } from '@/lib/utils'
import { Loader2, CheckCircle, AlertCircle, Circle } from 'lucide-react'

type PrdStatus = 'idle' | 'generating' | 'ready' | 'error'

interface PrdStatusBadgeProps {
  status: PrdStatus
  error?: string
  className?: string
  showText?: boolean
  onClick?: () => void
}

export function PrdStatusBadge({
  status,
  error,
  className,
  showText = true,
  onClick,
}: PrdStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'idle':
        return {
          icon: Circle,
          text: 'Generate PRD',
          className: 'bg-slate-800 text-slate-400 border-slate-600',
          iconClassName: 'text-slate-400',
        }
      case 'generating':
        return {
          icon: Loader2,
          text: 'Generating...',
          className: 'bg-cyan-900/30 text-cyan-300 border-cyan-500/30',
          iconClassName: 'text-cyan-400 animate-spin',
        }
      case 'ready':
        return {
          icon: CheckCircle,
          text: 'PRD Ready',
          className: 'bg-emerald-900/30 text-emerald-300 border-emerald-500/30',
          iconClassName: 'text-emerald-400',
        }
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Error',
          className: 'bg-red-900/30 text-red-300 border-red-500/30',
          iconClassName: 'text-red-400',
        }
      default:
        return {
          icon: Circle,
          text: 'Unknown',
          className: 'bg-slate-800 text-slate-400 border-slate-600',
          iconClassName: 'text-slate-400',
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
        config.className,
        onClick && 'cursor-pointer transition-opacity hover:opacity-80',
        className
      )}
      title={error || config.text}
      onClick={onClick}
    >
      <Icon className={cn('h-3 w-3', config.iconClassName)} />
      {showText && (
        <span className="truncate">
          {status === 'error' && error ? 'Error' : config.text}
        </span>
      )}
    </div>
  )
}
