'use client'

import { Handle, Position, type NodeProps } from 'reactflow'

import { cn } from '@/lib/utils'

type FeatureHubData = {
  kind: 'feature-hub'
  projectName: string
  featureCount: number
}

export function FeatureHubNode({ data }: NodeProps<FeatureHubData>) {
  return (
    <div
      className={cn(
        'min-w-[200px] rounded-3xl border border-white/10 bg-slate-900/90 p-5 shadow-inner shadow-black/40 backdrop-blur transition-colors duration-300',
        'hover:border-cyan-400/50 hover:bg-slate-900/95'
      )}
    >
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Features</p>
      <h3 className="mt-2 text-lg font-semibold text-white">Feature graph</h3>
      <p className="mt-2 text-xs text-slate-300">
        {data.featureCount} feature{data.featureCount === 1 ? '' : 's'} connected
      </p>

      <Handle
        type="target"
        position={Position.Left}
        className="!size-3 rounded-full border border-cyan-300/60 bg-cyan-200"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!size-3 rounded-full border border-cyan-300/60 bg-cyan-200"
      />
    </div>
  )
}
