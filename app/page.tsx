import Link from "next/link";

/**
 * Phase 1 placeholder — full UI arrives in later phases.
 * Confirms root layout, theme class hook, and baseline page shell.
 */
export default function Home() {
  return (
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Weather App
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Foundation ready
      </h1>
      <p className="mt-3 max-w-md text-zinc-600 dark:text-zinc-400">
        API route{" "}
        <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-sm dark:bg-zinc-800">
          /api/weather
        </code>{" "}
        and helpers in{" "}
        <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-sm dark:bg-zinc-800">
          lib/
        </code>{" "}
        are wired. Add your OpenWeatherMap key to{" "}
        <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-sm dark:bg-zinc-800">
          .env.local
        </code>
        .
      </p>
      <p className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        <Link
          href="/atlanta"
          className="text-sm font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-4 hover:decoration-blue-600 dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:decoration-blue-400"
        >
          View Atlanta weather (°F)
        </Link>
        <span className="hidden text-zinc-400 sm:inline" aria-hidden>
          ·
        </span>
        <a
          href="/api/weather?city=Atlanta"
          className="text-sm text-zinc-500 underline decoration-zinc-400/40 underline-offset-4 hover:text-zinc-700 hover:decoration-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Raw JSON (°C)
        </a>
      </p>
    </div>
  );
}
