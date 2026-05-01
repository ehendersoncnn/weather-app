"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { WeatherBackground } from "@/components/WeatherBackground";
import { CurrentWeather } from "@/components/CurrentWeather";
import { DailyForecast } from "@/components/DailyForecast";
import { HourlyForecast } from "@/components/HourlyForecast";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { WeatherData } from "@/lib/types/weather";
import {
  getDocumentIsDark,
  getDocumentIsDarkServerSnapshot,
  subscribeDocumentDarkClass,
} from "@/lib/html-theme";
import { DEFAULT_TEMP_UNIT } from "@/lib/weather";
import {
  atmospherePrefersLightText,
  resolveWeatherScene,
} from "@/lib/weather-scenes";

export function AtlantaClientView({
  data,
  isDay,
}: {
  data: WeatherData;
  isDay: boolean;
}) {
  const dark = useSyncExternalStore(
    subscribeDocumentDarkClass,
    getDocumentIsDark,
    getDocumentIsDarkServerSnapshot,
  );
  const theme = dark ? "dark" : "light";

  const scene = resolveWeatherScene(data.current.conditionId, isDay);
  const lightOnTop = atmospherePrefersLightText(theme, scene);

  const homeLinkClass = lightOnTop
    ? "text-sm font-medium text-white underline decoration-white/80 underline-offset-4 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] hover:text-zinc-100 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    : "text-sm font-medium text-zinc-950 underline decoration-zinc-950/45 underline-offset-4 [text-shadow:0_1px_3px_rgba(255,255,255,0.95)] hover:text-zinc-800 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950";

  const footText = lightOnTop
    ? "text-zinc-100 [text-shadow:0_1px_3px_rgba(0,0,0,0.88)]"
    : "text-zinc-900 [text-shadow:0_1px_3px_rgba(255,255,255,0.95),0_0_1px_rgba(255,255,255,0.85)]";

  const footLinkClass = lightOnTop
    ? "font-medium text-white underline decoration-white/80 underline-offset-2 [text-shadow:0_1px_3px_rgba(0,0,0,0.92)] hover:text-zinc-100 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    : "font-medium text-zinc-950 underline decoration-zinc-950/50 underline-offset-2 [text-shadow:0_1px_3px_rgba(255,255,255,0.95)] hover:text-zinc-800 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950";

  const codeClass = lightOnTop
    ? "rounded bg-white/25 px-1 text-zinc-50 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
    : "rounded bg-zinc-950/10 px-1 text-zinc-950 [text-shadow:0_1px_2px_rgba(255,255,255,0.8)]";

  return (
    <>
      <WeatherBackground
        conditionId={data.current.conditionId}
        isDay={isDay}
        theme={theme}
      />
      <div className="relative z-10 mx-auto min-h-screen w-full max-w-3xl px-4 py-8 pb-16 sm:px-6 sm:py-10 lg:max-w-4xl lg:px-8 xl:max-w-[52rem]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className={homeLinkClass}>
            ← Home
          </Link>
          <ThemeToggle />
        </div>

        <main className="theme-surface-transition mt-8 space-y-6 overflow-hidden rounded-2xl border border-white/30 bg-white/32 p-4 shadow-2xl shadow-black/10 ring-1 ring-white/20 backdrop-blur-xl dark:border-zinc-600/35 dark:bg-zinc-950/48 dark:shadow-black/40 dark:ring-zinc-500/15 sm:p-6 md:p-8">
          <CurrentWeather data={data.current} unit={DEFAULT_TEMP_UNIT} />
          <HourlyForecast items={data.hourly} unit={DEFAULT_TEMP_UNIT} />
          <DailyForecast items={data.daily} unit={DEFAULT_TEMP_UNIT} />
        </main>

        <p className={`mt-10 text-xs leading-relaxed ${footText}`}>
          API returns °C; display uses{" "}
          <code className={codeClass}>formatTemp</code>.{" "}
          <Link
            href="/api/weather?city=Atlanta"
            className={footLinkClass}
          >
            Raw JSON
          </Link>
        </p>
      </div>
    </>
  );
}
