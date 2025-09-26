'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium text-slate-200',
        className,
      )}
      {...props}
    />
  ),
)

Label.displayName = 'Label'
