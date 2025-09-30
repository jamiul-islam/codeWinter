'use client'

import { FileText, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyPrdsStateProps {
  onGoToCanvas: () => void
}

export function EmptyPrdsState({ onGoToCanvas }: EmptyPrdsStateProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-12 text-center shadow-inner shadow-black/30">
      <div className="mx-auto flex size-16 items-center justify-center rounded-3xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-sm shadow-cyan-500/30">
        <FileText className="h-8 w-8" />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">No PRDs Yet</h2>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-300">
          Generate your first PRD from a feature node in the graph canvas. PRDs
          are automatically created with detailed requirements based on your
          feature context.
        </p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Button onClick={onGoToCanvas} className="group gap-2" size="lg">
          Go to Canvas
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  )
}
