export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-300/40 border-t-cyan-300 shadow-lg shadow-cyan-500/20" />
        <p className="text-sm text-slate-300">Loading your workspace…</p>
      </div>
    </div>
  )
}
