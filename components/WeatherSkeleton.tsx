export function WeatherSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="theme-surface-transition space-y-4 animate-pulse"
    >
      <div className="h-48 rounded-2xl border border-zinc-200/60 bg-white/70 dark:border-zinc-600/40 dark:bg-zinc-900/60" />
      <div className="h-32 rounded-2xl border border-zinc-200/60 bg-white/70 dark:border-zinc-600/40 dark:bg-zinc-900/60" />
      <div className="h-64 rounded-2xl border border-zinc-200/60 bg-white/70 dark:border-zinc-600/40 dark:bg-zinc-900/60" />
    </div>
  );
}
