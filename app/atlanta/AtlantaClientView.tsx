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

  return (
    <>
      <WeatherBackground
        conditionId={data.current.conditionId}
        isDay={isDay}
        theme={theme}
      />
      <div className="relative z-10 mx-auto min-h-screen max-w-2xl px-6 py-10 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="text-sm text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-200"
          >
            ← Home
          </Link>
          <ThemeToggle />
        </div>

        <div className="mt-8 space-y-6">
          <CurrentWeather data={data.current} unit={DEFAULT_TEMP_UNIT} />
          <HourlyForecast items={data.hourly} unit={DEFAULT_TEMP_UNIT} />
          <DailyForecast items={data.daily} unit={DEFAULT_TEMP_UNIT} />
        </div>

        <p className="mt-10 text-xs text-zinc-600 dark:text-zinc-400">
          API returns °C; display uses{" "}
          <code className="rounded bg-black/10 px-1 dark:bg-white/10">
            formatTemp
          </code>
          .{" "}
          <Link
            href="/api/weather?city=Atlanta"
            className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Raw JSON
          </Link>
        </p>
      </div>
    </>
  );
}
