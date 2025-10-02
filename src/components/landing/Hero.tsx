import Link from 'next/link'
import { buttonClasses } from '@/components/ui/button-classes'
import { HeroGraph } from './HeroGraph'
import type { Session } from '@supabase/supabase-js'

interface HeroProps {
  session: Session | null
}

export function Hero({ session }: HeroProps) {
  const primaryHref = session ? '/dashboard' : '/signin'
  const primaryLabel = session ? 'Go to dashboard' : 'Start Building Free'

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Dotted Grid Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, var(--primary) 1.5px, transparent 1.5px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Gradient Orbs */}
        <div className="bg-primary/10 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-accent/10 absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />
      </div>

      {/* Two Column Layout */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left: Content */}
        <div className="space-y-6">
          {/* Headline */}
          <h1
            className="text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-6xl"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            <span className="via-primary to-primary bg-gradient-to-r from-white bg-clip-text text-transparent">
              The AI-powered PRD generator
            </span>
            <br />
            <span className="text-white">built for developers</span>
          </h1>

          {/* Subheadline */}
          <p className="text-muted max-w-xl text-lg leading-relaxed">
            Transform your ideas into production-ready specs in minutes. Plan
            features as a graph, generate consistent PRDs, and ship faster with
            AI coding agents.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <Link href={primaryHref} className={buttonClasses({ size: 'md' })}>
              {primaryLabel}
            </Link>
            <Link
              href="#how-it-works"
              className={buttonClasses({ variant: 'secondary', size: 'md' })}
            >
              See How It Works
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="text-muted flex flex-wrap gap-6 pt-2 text-sm">
            <div className="flex items-center gap-2">
              <svg
                className="text-success h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              No credit card
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="text-success h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Free to start
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="text-success h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Your own API key
            </div>
          </div>
        </div>

        {/* Right: Interactive Graph */}
        <div className="hidden lg:block">
          <HeroGraph />
        </div>
      </div>
    </section>
  )
}
