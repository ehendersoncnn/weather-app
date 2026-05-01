export function WeatherSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-4 animate-pulse"
    >
      <div className="h-48 rounded-2xl bg-white/50 dark:bg-zinc-800/50" />
      <div className="h-32 rounded-2xl bg-white/50 dark:bg-zinc-800/50" />
      <div className="h-64 rounded-2xl bg-white/50 dark:bg-zinc-800/50" />
    </div>
  );
}
