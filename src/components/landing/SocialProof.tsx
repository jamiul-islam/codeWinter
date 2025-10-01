export function SocialProof() {
    const stories = [
      {
        quote: "I used to waste entire weekends writing specs. Now I ship features the same day I think of them.",
        name: "Sarah K.",
        role: "Solo SaaS Builder",
        metric: "3 products in 6 months",
        color: "primary",
      },
      {
        quote: "My AI agents were constantly confused by inconsistent docs. codeWinter fixed that overnight.",
        name: "Marcus T.",
        role: "AI-First Engineer",
        metric: "98% fewer spec questions",
        color: "accent",
      },
      {
        quote: "From scattered Google Docs to connected PRDs. Finally, documentation that doesn't suck.",
        name: "Jordan P.",
        role: "Technical Founder",
        metric: "5 → 1 hour weekly planning",
        color: "success",
      },
      {
        quote: "Built my thesis project in half the time. The graph visualization alone sold me.",
        name: "Alex R.",
        role: "CS Student",
        metric: "A+ on capstone project",
        color: "primary",
      },
    ]
  
    return (
      <section className="relative py-32 px-6 overflow-hidden">
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
          {/* Swiss-style Header with Grid */}
          <div className="mb-8">
  
            {/* Title Block - Flush Left */}
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight whitespace-nowrap" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                Developers shipping faster
              </h2>
              <p className="text-lg text-muted max-w-xl">
                Real stories from builders who stopped wrestling with docs and started shipping.
              </p>
            </div>
          </div>
  
          {/* Asymmetric Grid Layout - Swiss Style */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Story 1 - Large */}
            <div className="col-span-12 md:col-span-7">
              <div className="h-full p-8 border-l-2 border-primary bg-surface/30 backdrop-blur">
                <div className="space-y-6">
                  <div className="text-3xl md:text-4xl font-light leading-tight text-white">
                    "{stories[0].quote}"
                  </div>
                  <div className="h-px bg-primary/20"></div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm font-bold text-white uppercase tracking-wider">{stories[0].name}</div>
                      <div className="text-sm text-muted">{stories[0].role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{stories[0].metric}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Story 2 - Medium */}
            <div className="col-span-12 md:col-span-5">
              <div className="h-full p-6 border-l-2 border-accent bg-surface/30 backdrop-blur">
                <div className="space-y-4">
                  <div className="text-xl font-light leading-tight text-white">
                    "{stories[1].quote}"
                  </div>
                  <div className="h-px bg-accent/20"></div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">{stories[1].name}</div>
                    <div className="text-xs text-muted mb-2">{stories[1].role}</div>
                    <div className="text-lg font-bold text-accent">{stories[1].metric}</div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Story 3 - Medium */}
            <div className="col-span-12 md:col-span-5">
              <div className="h-full p-6 border-l-2 border-success bg-surface/30 backdrop-blur">
                <div className="space-y-4">
                  <div className="text-xl font-light leading-tight text-white">
                    "{stories[2].quote}"
                  </div>
                  <div className="h-px bg-success/20"></div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">{stories[2].name}</div>
                    <div className="text-xs text-muted mb-2">{stories[2].role}</div>
                    <div className="text-lg font-bold text-success">{stories[2].metric}</div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Story 4 - Large */}
            <div className="col-span-12 md:col-span-7">
              <div className="h-full p-8 border-l-2 border-primary bg-surface/30 backdrop-blur">
                <div className="space-y-6">
                  <div className="text-3xl md:text-4xl font-light leading-tight text-white">
                    "{stories[3].quote}"
                  </div>
                  <div className="h-px bg-primary/20"></div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm font-bold text-white uppercase tracking-wider">{stories[3].name}</div>
                      <div className="text-sm text-muted">{stories[3].role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{stories[3].metric}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
          </div>
  
          {/* Swiss-style Stat Bar */}
          <div className="mt-20 grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 border-t-2 border-primary pt-6">
              <div className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-space-grotesk)' }}>1000+</div>
              <div className="text-sm text-muted uppercase tracking-wider">Developers using codeWinter</div>
            </div>
            <div className="col-span-12 md:col-span-4 border-t-2 border-accent pt-6">
              <div className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-space-grotesk)' }}>10K+</div>
              <div className="text-sm text-muted uppercase tracking-wider">PRDs generated</div>
            </div>
            <div className="col-span-12 md:col-span-4 border-t-2 border-success pt-6">
              <div className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-space-grotesk)' }}>3min</div>
              <div className="text-sm text-muted uppercase tracking-wider">Average time to first PRD</div>
            </div>
          </div>
        </div>
      </section>
    )
  }