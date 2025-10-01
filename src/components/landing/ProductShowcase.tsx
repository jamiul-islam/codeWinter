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
    <section id="how-it-works" className="relative overflow-hidden px-6 py-32">
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
          <div className="border-primary border-l-4 pl-6">
            <h2
              className="text-5xl leading-tight font-bold whitespace-nowrap text-white md:text-6xl"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Everything you need to plan better
            </h2>
          </div>
        </div>

        {/* Bento Grid */}
        <motion.div
          className="grid auto-rows-[140px] grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* MASSIVE HERO - Interactive Graph Demo */}
          <motion.div
            className="group col-span-4 row-span-3 md:col-span-8 lg:col-span-8"
            variants={itemVariants}
          >
            <div className="border-primary/40 from-surface/80 to-surface/50 hover:border-primary/60 shadow-primary/10 h-full overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-8 shadow-2xl backdrop-blur-xl transition-all">
              <div className="flex h-full flex-col">
                <div className="mb-4">
                  <h3
                    className="mb-3 text-4xl font-bold text-white lg:text-5xl"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    Plan features visually
                  </h3>
                  <p className="text-muted max-w-xl text-lg">
                    Drag nodes. Connect dependencies. Let AI understand your
                    architecture.
                  </p>
                </div>

                {/* Embedded Interactive Graph */}
                <div className="-mx-4 -mb-4 min-h-0 flex-1">
                  <HeroGraph />
                </div>
              </div>
            </div>
          </motion.div>

          {/* STAT - Speed */}
          <motion.div
            className="group col-span-2 row-span-1 md:col-span-4 lg:col-span-4"
            variants={itemVariants}
          >
            <div className="border-accent/40 bg-surface/50 hover:border-accent/60 h-full rounded-3xl border-2 p-6 backdrop-blur transition-all">
              <div className="flex h-full flex-col justify-center">
                <div className="from-accent to-primary mb-2 bg-gradient-to-br bg-clip-text text-5xl font-bold text-transparent lg:text-7xl">
                  3min
                </div>
                <p className="text-muted text-sm font-medium">
                  From idea → PRDs
                </p>
              </div>
            </div>
          </motion.div>

          {/* COMPARISON */}
          <motion.div
            className="group col-span-2 row-span-2 md:col-span-4 lg:col-span-4"
            variants={itemVariants}
          >
            <div className="border-danger/30 bg-surface/50 hover:border-danger/50 h-full rounded-3xl border-2 p-6 backdrop-blur transition-all">
              <div className="space-y-4">
                <h4
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  The old way
                </h4>
                <div className="text-muted/70 space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-danger">✗</span>
                    <span>3 days on scattered Google Docs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-danger">✗</span>
                    <span>
                      Endless Slack threads asking &quot;what&apos;s the
                      spec?&quot;
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-danger">✗</span>
                    <span>AI agents confused by inconsistent context</span>
                  </div>
                </div>
                <div className="border-danger/20 border-t pt-4">
                  <p className="text-danger font-mono text-xs">
                    Result: Wasted time, mismatched features
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ONE-CLICK PRD */}
          <motion.div
            className="group col-span-4 row-span-2 md:col-span-4 lg:col-span-4"
            variants={itemVariants}
          >
            <div className="border-success/40 bg-surface/50 hover:border-success/60 h-full rounded-3xl border-2 p-6 backdrop-blur transition-all">
              <div className="flex h-full flex-col">
                <div className="mb-4">
                  <div className="bg-success/20 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                    <svg
                      className="text-success h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h4
                    className="mb-2 text-2xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    One-click PRDs
                  </h4>
                  <p className="text-muted text-sm">
                    Click any node → instant PRD with full context
                  </p>
                </div>

                {/* Mock PRD Preview */}
                <div className="bg-background/60 border-success/20 flex-1 space-y-1.5 overflow-hidden rounded-xl border p-4 font-mono text-xs">
                  <div className="text-success font-semibold">
                    # User Authentication
                  </div>
                  <div className="text-muted/60">## Goal & Rationale</div>
                  <div className="text-muted/40">
                    Secure login system with...
                  </div>
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
            className="group col-span-4 row-span-1 md:col-span-4 lg:col-span-4"
            variants={itemVariants}
          >
            <div className="border-primary/40 bg-surface/50 hover:border-primary/60 flex h-full items-center gap-4 rounded-3xl border-2 p-6 backdrop-blur transition-all">
              <div className="bg-primary/20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl">
                <svg
                  className="text-primary h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <div>
                <h4 className="mb-1 text-lg font-bold text-white">
                  Context-aware
                </h4>
                <p className="text-muted/70 text-sm">
                  Every PRD references connected features
                </p>
              </div>
            </div>
          </motion.div>

          {/* EXPORT */}
          <motion.div
            className="group col-span-2 row-span-2 md:col-span-4 lg:col-span-4"
            variants={itemVariants}
          >
            <div className="border-accent/40 bg-surface/50 hover:border-accent/60 h-full rounded-3xl border-2 p-6 backdrop-blur transition-all">
              <div className="flex h-full flex-col">
                <div className="mb-4">
                  <h4
                    className="mb-2 text-2xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    Export & Ship
                  </h4>
                  <p className="text-muted text-sm">
                    Clean Markdown for any AI agent
                  </p>
                </div>

                {/* File List */}
                <div className="flex-1 space-y-2">
                  <div className="bg-background/50 border-accent/20 flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="text-accent h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs font-medium text-white">
                        auth.md
                      </span>
                    </div>
                    <svg
                      className="text-success h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="bg-background/50 border-accent/20 flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="text-accent h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs font-medium text-white">
                        dashboard.md
                      </span>
                    </div>
                    <svg
                      className="text-success h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="bg-background/50 border-accent/20 flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="text-accent h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs font-medium text-white">
                        api.md
                      </span>
                    </div>
                    <svg
                      className="text-success h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* YOUR API KEY */}
          <motion.div
            className="group col-span-2 row-span-1 md:col-span-4 lg:col-span-4"
            variants={itemVariants}
          >
            <div className="border-success/40 bg-surface/50 hover:border-success/60 flex h-full items-center gap-4 rounded-3xl border-2 p-6 backdrop-blur transition-all">
              <div className="bg-success/20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl">
                <svg
                  className="text-success h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="mb-1 text-lg font-bold text-white">
                  Your API key
                </h4>
                <p className="text-muted/70 text-sm">No vendor lock-in</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
