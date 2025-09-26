import { cn } from '@/lib/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const baseClasses =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-60'

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#4C7EFF] text-white hover:bg-[#3d69e0] dark:bg-[#4C7EFF] dark:text-white dark:hover:bg-[#3d69e0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4C7EFF] transition-colors',
  secondary:
    'bg-transparent border border-[#1f1f1f]/20 dark:border-[#f1f1f1]/20 text-[#0F0F0F] dark:text-[#F8F8F8] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4C7EFF]',
  ghost:
    'bg-transparent text-[#0F0F0F] dark:text-[#F8F8F8] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 rounded-full px-3 text-xs font-medium',
  md: 'h-10 rounded-full px-4 text-sm font-medium',
  lg: 'h-12 rounded-full px-5 text-base font-medium',
}

export const buttonClasses = ({
  variant = 'primary',
  size = 'md',
}: {
  variant?: ButtonVariant
  size?: ButtonSize
} = {}) => cn(baseClasses, variantStyles[variant], sizeStyles[size])
