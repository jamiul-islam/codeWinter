'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { buttonClasses } from '@/components/ui/button-classes'
import type { Session } from '@supabase/supabase-js'

interface FinalCTAProps {
  session: Session | null
}

export function FinalCTA({ session }: FinalCTAProps) {
  const primaryHref = session ? '/dashboard' : '/signin'
  const primaryLabel = session ? 'Go to dashboard' : 'Get Started Free'

  return (
    <section className="relative overflow-hidden px-6 py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, var(--primary) 1.5px, transparent 1.5px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Gradient Orbs */}
        <div className="bg-primary/10 absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-primary/40 from-surface/90 to-surface/60 relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-12 backdrop-blur-xl md:p-16"
        >
          {/* Decorative corner elements - Swiss style */}
          <div className="border-primary/30 absolute top-6 right-6 h-16 w-16 border-t-2 border-r-2"></div>
          <div className="border-primary/30 absolute bottom-6 left-6 h-16 w-16 border-b-2 border-l-2"></div>

          <div className="relative z-10 space-y-8 text-center">
            {/* Headline */}
            <div className="space-y-4">
              <h2
                className="text-5xl leading-[1.1] font-bold text-white md:text-6xl lg:text-7xl"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                Stop planning.
                <br />
                <span className="from-primary via-accent to-primary bg-gradient-to-r bg-clip-text text-transparent">
                  Start shipping.
                </span>
              </h2>
              <p className="text-muted mx-auto max-w-2xl text-xl md:text-2xl">
                Join developers who turned 3-day planning into 3-minute PRDs.
              </p>
            </div>

            {/* Stats Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-background/50 border-primary/20 inline-flex items-baseline gap-3 rounded-2xl border px-8 py-4"
            >
              <span className="text-muted text-sm tracking-wider uppercase">
                PRDs Generated Today
              </span>
              <div
                className="text-primary text-4xl font-bold md:text-5xl"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                <CountUp />
              </div>
            </motion.div>

            {/* CTAs */}
            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
              <Link
                href={primaryHref}
                className={buttonClasses({ size: 'lg' })}
              >
                {primaryLabel}
              </Link>
              <Link
                href="#how-it-works"
                className={buttonClasses({ variant: 'secondary', size: 'lg' })}
              >
                See How It Works
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Simple counter component
function CountUp() {
  const [count, setCount] = React.useState(0)
  const targetCount = 1247 // Example number

  React.useEffect(() => {
    let current = 0
    const increment = targetCount / 60 // Animate over ~1 second (60 frames)
    const timer = setInterval(() => {
      current += increment
      if (current >= targetCount) {
        setCount(targetCount)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16) // ~60fps

    return () => clearInterval(timer)
  }, [])

  return <>{count.toLocaleString()}</>
}

// Add React import
import React from 'react'
