'use client'

import { useMemo } from 'react'
import type { Edge, Node } from 'reactflow'
import { Background, Controls, MiniMap, ReactFlow } from 'reactflow'

import 'reactflow/dist/style.css'

import { useProjectStore } from '@/lib/store'

export function GraphCanvas() {
  const nodes = useProjectStore((state) => state.nodes)

  const reactFlowNodes = useMemo<Node[]>(
    () =>
      nodes.map((node, index) => ({
        id: node.id,
        position: { x: index * 180, y: (index % 2) * 120 },
        data: {
          label: node.title,
          status: node.status,
        },
        className:
          'rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 shadow-inner shadow-black/20',
      })),
    [nodes],
  )

  const reactFlowEdges = useMemo<Edge[]>(
    () =>
      nodes.slice(1).map((node, index) => ({
        id: `${nodes[index].id}-${node.id}`,
        source: nodes[index].id,
        target: node.id,
        animated: node.status === 'generating',
      })),
    [nodes],
  )

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/20">
      <ReactFlow nodes={reactFlowNodes} edges={reactFlowEdges} fitView>
        <Background color="rgba(148, 163, 184, 0.2)" gap={24} size={1} />
        <MiniMap pannable zoomable nodeColor={() => '#67e8f9'} />
        <Controls position="bottom-left" showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
