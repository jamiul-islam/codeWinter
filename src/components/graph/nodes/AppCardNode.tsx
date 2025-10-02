'use client'

import { Handle, Position, type NodeProps } from 'reactflow'

import { cn } from '@/lib/utils'

type AppCardData = {
  kind: 'app'
  name: string
  description?: string
}

export function AppCardNode({ data }: NodeProps<AppCardData>) {
  return (
    <div
      title={data.description}
      className={cn(
        'group max-w-[260px] min-w-[220px] rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-black/30 backdrop-blur transition-all duration-300',
        'hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:shadow-cyan-500/20'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-200">
          <span className="text-base font-semibold">App</span>
        </div>
        <div>
          <p className="text-xs tracking-[0.35em] text-cyan-200/70 uppercase">
            Project
          </p>
          <h3 className="text-lg font-semibold text-white">{data.name}</h3>
        </div>
      </div>
      {data.description && (
        <p className="mt-4 line-clamp-4 text-xs leading-5 text-slate-300">
          {data.description}
        </p>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!size-3 rounded-full border border-cyan-300/80 bg-cyan-200 shadow shadow-cyan-400/40"
      />
    </div>
  )
}
