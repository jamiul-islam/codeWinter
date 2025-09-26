'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-full border border-[#1f1f1f]/15 bg-white/80 px-4 text-sm text-[#0F0F0F] transition placeholder:text-[#0f0f0f]/40 focus:border-[#4C7EFF]/50 focus:ring-2 focus:ring-[#4C7EFF]/30 focus:outline-none dark:border-[#f5f5f5]/12 dark:bg-[#111]/90 dark:text-[#F8F8F8] dark:placeholder:text-[#F8F8F8]/40',
        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800',
        // Readonly state
        'read-only:cursor-default read-only:bg-slate-50 read-only:text-slate-600 dark:read-only:bg-slate-800/50 dark:read-only:text-slate-400',
        className
      )}
      {...props}
    />
  )
)

Input.displayName = 'Input'
