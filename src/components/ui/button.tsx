'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

import {
  buttonClasses,
  type ButtonSize,
  type ButtonVariant,
} from '@/components/ui/button-classes'

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
