'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const baseClasses =
  'inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:opacity-50 disabled:pointer-events-none'

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-500/30 hover:bg-cyan-300',
  secondary:
    'border border-white/10 bg-white/5 text-white hover:bg-white/10',
  ghost: 'text-slate-200 hover:bg-white/5',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
}: {
  variant?: ButtonVariant
  size?: ButtonSize
} = {}) {
  return cn(baseClasses, variantStyles[variant], sizeStyles[size])
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', type = 'button', ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonClasses({ variant, size }), className)}
      {...props}
    />
  ),
)

Button.displayName = 'Button'
