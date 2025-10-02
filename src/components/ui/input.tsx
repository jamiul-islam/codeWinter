'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white transition placeholder:text-slate-400 focus:border-cyan-300/80 focus:ring-2 focus:ring-cyan-300/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        'read-only:bg-white/5 read-only:text-slate-400',
        className
      )}
      {...props}
    />
  )
)

Input.displayName = 'Input'
