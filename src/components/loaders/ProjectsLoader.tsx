export default function ProjectsLoader() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-black/30"
        >
          {/* Project name skeleton */}
          <div className="h-6 w-3/4 rounded-lg bg-white/10"></div>
          
          {/* Last updated skeleton */}
          <div className="mt-3 h-4 w-1/2 rounded bg-white/5"></div>
          
          {/* PRD count skeleton */}
          <div className="mt-2 h-4 w-1/3 rounded bg-cyan-500/20"></div>
        </div>
      ))}
    </div>
  )
}
