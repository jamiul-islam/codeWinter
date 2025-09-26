'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const placeholder = `# PRD Preview

This preview renders the Markdown returned by the PRD generation pipeline.

- Supports **GitHub-flavored Markdown**
- Handles tables and task lists
- Styled via Tailwind prose classes (coming soon)
`

type MarkdownPreviewProps = {
  markdown?: string
}

export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-black/20">
      <article className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown ?? placeholder}</ReactMarkdown>
      </article>
    </div>
  )
}
