'use client'

import { motion } from 'framer-motion'
import { HeroGraph } from './HeroGraph'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
}

export function ProductShowcase() {
  return (
    <section id="how-it-works" className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, var(--primary) 1.5px, transparent 1.5px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="mx-auto max-w-[1400px]">
      <div className="mb-20">
  
            {/* Title Block - Flush Left */}
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-5xl md:text-6xl font-bold text-white  leading-tight whitespace-nowrap" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Everything you need to plan better
              </h2>
            </div>
          </div>

        {/* Bento Grid */}
        <motion.div 
          className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 auto-rows-[140px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          
          {/* MASSIVE HERO - Interactive Graph Demo */}
          <motion.div 
            className="col-span-4 md:col-span-8 lg:col-span-8 row-span-3 group"
            variants={itemVariants}
          >
            <div className="h-full p-8 rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-surface/80 to-surface/50 backdrop-blur-xl hover:border-primary/60 transition-all shadow-2xl shadow-primary/10 overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-4xl lg:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    Plan features visually
                  </h3>
                  <p className="text-lg text-muted max-w-xl">
                    Drag nodes. Connect dependencies. Let AI understand your architecture.
                  </p>
                </div>
                
                {/* Embedded Interactive Graph */}
                <div className="flex-1 min-h-0 -mx-4 -mb-4">
                  <HeroGraph />
                </div>
              </div>
            </div>
          </motion.div>

          {/* STAT - Speed */}
          <motion.div 
            className="col-span-2 md:col-span-4 lg:col-span-4 row-span-1 group"
            variants={itemVariants}
          >
            <div className="h-full p-6 rounded-3xl border-2 border-accent/40 bg-surface/50 backdrop-blur hover:border-accent/60 transition-all">
              <div className="flex flex-col justify-center h-full">
                <div className="text-5xl lg:text-7xl font-bold bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent mb-2">
                  3min
                </div>
                <p className="text-sm text-muted font-medium">From idea → PRDs</p>
              </div>
            </div>
          </motion.div>

          {/* COMPARISON */}
          <motion.div 
            className="col-span-2 md:col-span-4 lg:col-span-4 row-span-2 group"
            variants={itemVariants}
          >
            <div className="h-full p-6 rounded-3xl border-2 border-danger/30 bg-surface/50 backdrop-blur hover:border-danger/50 transition-all">
              <div className="space-y-4">
                <h4 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                  The old way
                </h4>
                <div className="space-y-3 text-sm text-muted/70">
                  <div className="flex items-start gap-2">
                    <span className="text-danger">✗</span>
                    <span>3 days on scattered Google Docs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-danger">✗</span>
                    <span>Endless Slack threads asking "what's the spec?"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-danger">✗</span>
                    <span>AI agents confused by inconsistent context</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-danger/20">
                  <p className="text-xs text-danger font-mono">Result: Wasted time, mismatched features</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ONE-CLICK PRD */}
          <motion.div 
            className="col-span-4 md:col-span-4 lg:col-span-4 row-span-2 group"
            variants={itemVariants}
          >
            <div className="h-full p-6 rounded-3xl border-2 border-success/40 bg-surface/50 backdrop-blur hover:border-success/60 transition-all">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    One-click PRDs
                  </h4>
                  <p className="text-muted text-sm">Click any node → instant PRD with full context</p>
                </div>

                {/* Mock PRD Preview */}
                <div className="flex-1 rounded-xl bg-background/60 border border-success/20 p-4 font-mono text-xs space-y-1.5 overflow-hidden">
                  <div className="text-success font-semibold"># User Authentication</div>
                  <div className="text-muted/60">## Goal & Rationale</div>
                  <div className="text-muted/40">Secure login system with...</div>
                  <div className="text-muted/60">## Connected Features</div>
                  <div className="text-muted/40">→ Dashboard, Profile</div>
                  <div className="text-muted/60">## API Endpoints</div>
                  <div className="text-muted/40">POST /api/auth/login</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CONSISTENCY */}
          <motion.div 
            className="col-span-4 md:col-span-4 lg:col-span-4 row-span-1 group"
            variants={itemVariants}
          >
            <div className="h-full p-6 rounded-3xl border-2 border-primary/40 bg-surface/50 backdrop-blur hover:border-primary/60 transition-all flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Context-aware</h4>
                <p className="text-sm text-muted/70">Every PRD references connected features</p>
              </div>
            </div>
          </motion.div>

          {/* EXPORT */}
          <motion.div 
            className="col-span-2 md:col-span-4 lg:col-span-4 row-span-2 group"
            variants={itemVariants}
          >
            <div className="h-full p-6 rounded-3xl border-2 border-accent/40 bg-surface/50 backdrop-blur hover:border-accent/60 transition-all">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h4 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    Export & Ship
                  </h4>
                  <p className="text-sm text-muted">Clean Markdown for any AI agent</p>
                </div>

                {/* File List */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-accent/20">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium text-white">auth.md</span>
                    </div>
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-accent/20">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium text-white">dashboard.md</span>
                    </div>
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-accent/20">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium text-white">api.md</span>
                    </div>
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* YOUR API KEY */}
          <motion.div 
            className="col-span-2 md:col-span-4 lg:col-span-4 row-span-1 group"
            variants={itemVariants}
          >
            <div className="h-full p-6 rounded-3xl border-2 border-success/40 bg-surface/50 backdrop-blur hover:border-success/60 transition-all flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Your API key</h4>
                <p className="text-sm text-muted/70">No vendor lock-in</p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}