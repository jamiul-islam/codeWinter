'use client'

import { useState } from 'react'
import { MarkdownPreview } from './MarkdownPreview'
import { Copy, Check, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prdToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

interface PrdViewerProps {
  markdown: string
  prdId: string
  featureTitle: string
  className?: string
  hideTitle?: boolean
  editButton?: React.ReactNode
}

export function PrdViewer({
  markdown,
  prdId,
  featureTitle,
  className,
  hideTitle = false,
  editButton,
}: PrdViewerProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const handleDownload = async () => {
    try {
      setDownloading(true)
      prdToast.downloadStarted(featureTitle)

      const response = await fetch(`/api/prd/${prdId}/download`)

      if (!response.ok) {
        throw new Error('Download failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${featureTitle.replace(/[^a-zA-Z0-9\-_]/g, '_')}.md`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      prdToast.downloadSuccess(featureTitle)
    } catch (error) {
      console.error('Download failed:', error)
      prdToast.downloadError(featureTitle)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header with actions - only show if not hidden */}
      {!hideTitle && (
        <div className="flex items-center justify-between border-b border-slate-700 p-4">
          <div className="flex items-center gap-4">{editButton}</div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={copied}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              disabled={downloading}
              className="gap-2"
            >
              {downloading ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="size-4" />
                  Download
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Action buttons for when title is hidden */}
      {hideTitle && (
        <div className="flex items-center justify-end gap-2 border-b border-slate-700 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={copied}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="size-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-4" /> Copy
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            disabled={downloading}
            className="gap-2"
          >
            {downloading ? (
              <>
                <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span className="ml-2">Downloading...</span>
              </>
            ) : (
              <>
                <Download className="size-4" />
                Download
              </>
            )}
          </Button>
        </div>
      )}

      {/* Markdown content */}
      <div className="flex-1 overflow-auto p-4">
        <article
          className="prose prose-invert max-w-none break-words"
          style={{ wordWrap: 'break-word', overflowWrap: 'anywhere' }}
        >
          <MarkdownPreview markdown={markdown} />
        </article>
      </div>
    </div>
  )
}
