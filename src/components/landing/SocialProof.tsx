export function SocialProof() {
  const stories = [
    {
      quote:
        'I used to waste entire weekends writing specs. Now I ship features the same day I think of them.',
      name: 'Sarah K.',
      role: 'Solo SaaS Builder',
      metric: '3 products in 6 months',
      color: 'primary',
    },
    {
      quote:
        'My AI agents were constantly confused by inconsistent docs. codeWinter fixed that overnight.',
      name: 'Marcus T.',
      role: 'AI-First Engineer',
      metric: '98% fewer spec questions',
      color: 'accent',
    },
    {
      quote:
        "From scattered Google Docs to connected PRDs. Finally, documentation that doesn't suck.",
      name: 'Jordan P.',
      role: 'Technical Founder',
      metric: '5 → 1 hour weekly planning',
      color: 'success',
    },
    {
      quote:
        'Built my thesis project in half the time. The graph visualization alone sold me.',
      name: 'Alex R.',
      role: 'CS Student',
      metric: 'A+ on capstone project',
      color: 'primary',
    },
  ]

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
      </div>

      <div className="mx-auto max-w-[1400px]">
        {/* Swiss-style Header with Grid */}
        <div className="mb-8">
          {/* Title Block - Flush Left */}
          <div className="border-primary border-l-4 pl-6">
            <h2
              className="mb-4 text-5xl leading-tight font-bold whitespace-nowrap text-white md:text-6xl"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Developers shipping faster
            </h2>
            <p className="text-muted max-w-xl text-lg">
              Real stories from builders who stopped wrestling with docs and
              started shipping.
            </p>
          </div>
        </div>

        {/* Asymmetric Grid Layout - Swiss Style */}
        <div className="grid grid-cols-12 gap-6">
          {/* Story 1 - Large */}
          <div className="col-span-12 md:col-span-7">
            <div className="border-primary bg-surface/30 h-full border-l-2 p-8 backdrop-blur">
              <div className="space-y-6">
                <div className="text-3xl leading-tight font-light text-white md:text-4xl">
                  &quot;{stories[0].quote}&quot;
                </div>
                <div className="bg-primary/20 h-px"></div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm font-bold tracking-wider text-white uppercase">
                      {stories[0].name}
                    </div>
                    <div className="text-muted text-sm">{stories[0].role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary text-2xl font-bold">
                      {stories[0].metric}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story 2 - Medium */}
          <div className="col-span-12 md:col-span-5">
            <div className="border-accent bg-surface/30 h-full border-l-2 p-6 backdrop-blur">
              <div className="space-y-4">
                <div className="text-xl leading-tight font-light text-white">
                  &quot;{stories[1].quote}&quot;
                </div>
                <div className="bg-accent/20 h-px"></div>
                <div>
                  <div className="text-xs font-bold tracking-wider text-white uppercase">
                    {stories[1].name}
                  </div>
                  <div className="text-muted mb-2 text-xs">
                    {stories[1].role}
                  </div>
                  <div className="text-accent text-lg font-bold">
                    {stories[1].metric}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story 3 - Medium */}
          <div className="col-span-12 md:col-span-5">
            <div className="border-success bg-surface/30 h-full border-l-2 p-6 backdrop-blur">
              <div className="space-y-4">
                <div className="text-xl leading-tight font-light text-white">
                  &quot;{stories[2].quote}&quot;
                </div>
                <div className="bg-success/20 h-px"></div>
                <div>
                  <div className="text-xs font-bold tracking-wider text-white uppercase">
                    {stories[2].name}
                  </div>
                  <div className="text-muted mb-2 text-xs">
                    {stories[2].role}
                  </div>
                  <div className="text-success text-lg font-bold">
                    {stories[2].metric}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story 4 - Large */}
          <div className="col-span-12 md:col-span-7">
            <div className="border-primary bg-surface/30 h-full border-l-2 p-8 backdrop-blur">
              <div className="space-y-6">
                <div className="text-3xl leading-tight font-light text-white md:text-4xl">
                  &quot;{stories[3].quote}&quot;
                </div>
                <div className="bg-primary/20 h-px"></div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm font-bold tracking-wider text-white uppercase">
                      {stories[3].name}
                    </div>
                    <div className="text-muted text-sm">{stories[3].role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary text-2xl font-bold">
                      {stories[3].metric}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Swiss-style Stat Bar */}
        <div className="mt-20 grid grid-cols-12 gap-6">
          <div className="border-primary col-span-12 border-t-2 pt-6 md:col-span-4">
            <div
              className="mb-2 text-5xl font-bold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              1000+
            </div>
            <div className="text-muted text-sm tracking-wider uppercase">
              Developers using codeWinter
            </div>
          </div>
          <div className="border-accent col-span-12 border-t-2 pt-6 md:col-span-4">
            <div
              className="mb-2 text-5xl font-bold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              10K+
            </div>
            <div className="text-muted text-sm tracking-wider uppercase">
              PRDs generated
            </div>
          </div>
          <div className="border-success col-span-12 border-t-2 pt-6 md:col-span-4">
            <div
              className="mb-2 text-5xl font-bold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              3min
            </div>
            <div className="text-muted text-sm tracking-wider uppercase">
              Average time to first PRD
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
