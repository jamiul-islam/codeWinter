'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      <div
        ref={modalRef}
        className={cn(
          'relative z-10 w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-xl shadow-black/40',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

interface ModalSectionProps {
  children: React.ReactNode
  className?: string
}

export function ModalHeader({ children, className }: ModalSectionProps) {
  return <div className={cn('mb-4 space-y-2', className)}>{children}</div>
}

export function ModalTitle({ children, className }: ModalSectionProps) {
  return (
    <h2 className={cn('text-lg font-semibold text-white', className)}>
      {children}
    </h2>
  )
}

export function ModalDescription({
  children,
  className,
}: ModalSectionProps) {
  return (
    <p className={cn('text-sm text-slate-300', className)}>{children}</p>
  )
}

export function ModalFooter({ children, className }: ModalSectionProps) {
  return (
    <div className={cn('mt-6 flex justify-end gap-3', className)}>
      {children}
    </div>
  )
}
