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
    <div className="prose prose-invert max-w-none rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown ?? placeholder}
      </ReactMarkdown>
    </div>
  )
}
