'use client'

import { GraphCanvas, GraphSeed } from '@/components/graph'
import { MarkdownPreview } from '@/components/prd'
import { useAuth } from '@/components/providers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const exampleMarkdown = `# Architecture Graph → PRD

## Goal & Rationale
Ensure every feature has a consistent narrative and references its dependencies.

## Scope
**In:** Feature outlines, graph relationships, Supabase metadata\
**Out:** Sprint tasks, burndown charts

## Acceptance Criteria
- [x] Users can see node statuses changing in real time
- [ ] Regenerating a PRD keeps historical copies for 7 days
- [ ] Downloaded markdown uses deterministic filenames
`

export default function Home() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, they'll be redirected by middleware
  // This page is for unauthenticated users
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 pt-16 pb-24">
      <section className="space-y-4">
        <p className="text-sm tracking-[0.35em] text-cyan-300/80 uppercase">
          codeWinter • Preview
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          Plan your feature graph, press generate, ship consistent PRDs.
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          This workspace scaffolds authentication, Supabase integration, graph
          rendering, and Markdown output so we can iterate quickly on the AI
          flows described in the PRD.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-medium text-white">
                Architecture graph
              </h2>
              <p className="text-sm text-slate-400">
                React Flow seeded via Zustand store
              </p>
            </div>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs tracking-wide text-cyan-200 uppercase">
              Live Preview
            </span>
          </div>
          <GraphSeed />
          <GraphCanvas />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-medium text-white">PRD renderer</h2>
            <p className="text-sm text-slate-400">
              Markdown + GFM via react-markdown
            </p>
          </div>
          <MarkdownPreview markdown={exampleMarkdown} />
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto w-full max-w-md text-center">
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8">
          <h2 className="mb-4 text-2xl font-medium text-white">
            Ready to get started?
          </h2>
          <p className="mb-6 text-slate-400">
            Sign in to create projects, build feature graphs, and generate
            professional PRDs with AI.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link className="text-black" href="/signin">
                Sign in to codeWinter
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
