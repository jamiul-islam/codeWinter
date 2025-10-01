import Link from 'next/link'
import { buttonClasses } from '@/components/ui/button-classes'
import type { Session } from '@supabase/supabase-js'

interface NavbarProps {
  session: Session | null
}

export function Navbar({ session }: NavbarProps) {
  const primaryHref = session ? '/dashboard' : '/signin'
  const primaryLabel = session ? 'Go to dashboard' : 'Start Building Free'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <Link
          href="/"
          className="text-xl font-semibold text-white transition hover:text-primary"
        >
          code<span className="text-primary">Winter</span> ❄️
        </Link>

        {/* CTA Button */}
        <Link 
          href={primaryHref}
          className={buttonClasses({ size: 'md' })}
        >
          {primaryLabel}
        </Link>
      </div>
    </nav>
  )
}