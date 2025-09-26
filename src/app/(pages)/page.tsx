import Link from 'next/link'

import { GraphCanvas, GraphSeed } from '@/components/graph'
import { MarkdownPreview } from '@/components/prd'
import { buttonClasses } from '@/components/ui/button-classes'
import { getServerSupabaseClient } from '@/lib/supabase/server'

const exampleMarkdown = `# Architecture Graph → PRD

## Goal & Rationale
Ensure every feature has a consistent narrative and references its dependencies.

## Scope
**In:** Feature outlines, graph relationships, Supabase metadata\\
**Out:** Sprint tasks, burndown charts

## Acceptance Criteria
- [x] Users can see node statuses changing in real time
- [ ] Regenerating a PRD keeps historical copies for 7 days
- [ ] Downloaded markdown uses deterministic filenames
`

export default async function Home() {
  const supabase = await getServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const primaryHref = session ? '/dashboard' : '/signin'
  const primaryLabel = session ? 'Go to dashboard' : 'Sign in to codeWinter'

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 pt-16 pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-white transition hover:text-cyan-200"
        >
          code<span className="text-cyan-300">Winter</span> ❄️
        </Link>
        <Link className={buttonClasses({ size: 'sm' })} href={primaryHref}>
          {primaryLabel}
        </Link>
      </header>

      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
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
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-wide text-cyan-200">
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
    </main>
  )
}
