"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CurrentWeather } from "@/components/CurrentWeather";
import { DailyForecast } from "@/components/DailyForecast";
import { ErrorMessage } from "@/components/ErrorMessage";
import { HourlyForecast } from "@/components/HourlyForecast";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UnitToggle } from "@/components/UnitToggle";
import { WeatherBackground } from "@/components/WeatherBackground";
import { WeatherSkeleton } from "@/components/WeatherSkeleton";
import {
  getDocumentIsDark,
  getDocumentIsDarkServerSnapshot,
  subscribeDocumentDarkClass,
} from "@/lib/html-theme";
import type { WeatherData } from "@/lib/types/weather";
import {
  DEFAULT_TEMP_UNIT,
  fetchWeather,
  isDaytime,
  type TempUnit,
} from "@/lib/weather";
import {
  atmospherePrefersLightText,
  resolveWeatherScene,
  type WeatherScene,
} from "@/lib/weather-scenes";

const DEFAULT_CITY = "Atlanta";
const LAST_CITY_STORAGE_KEY = "weather-app-last-city";

export default function HomePage() {
  const dark = useSyncExternalStore(
    subscribeDocumentDarkClass,
    getDocumentIsDark,
    getDocumentIsDarkServerSnapshot,
  );
  const theme = dark ? "dark" : "light";

  const [city, setCity] = useState(DEFAULT_CITY);
  const [searchInput, setSearchInput] = useState(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TempUnit>(DEFAULT_TEMP_UNIT);

  const runFetch = useCallback(async (cityName: string) => {
    const q = cityName.trim();
    if (!q) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(q);
      setWeatherData(data);
      setCity(data.current.city);
      setSearchInput(data.current.city);
      try {
        localStorage.setItem(LAST_CITY_STORAGE_KEY, data.current.city);
      } catch {
        /* storage unavailable */
      }
    } catch (e) {
      setWeatherData(null);
      setError(
        e instanceof Error ? e.message : "Failed to load weather",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      let initial = DEFAULT_CITY;
      try {
        const saved = localStorage.getItem(LAST_CITY_STORAGE_KEY)?.trim();
        if (saved) initial = saved;
      } catch {
        /* ignore */
      }
      if (cancelled) return;
      setCity(initial);
      setSearchInput(initial);
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchWeather(initial);
        if (cancelled) return;
        setWeatherData(data);
        setCity(data.current.city);
        setSearchInput(data.current.city);
        try {
          localStorage.setItem(LAST_CITY_STORAGE_KEY, data.current.city);
        } catch {
          /* ignore */
        }
      } catch (e) {
        if (cancelled) return;
        setWeatherData(null);
        setError(
          e instanceof Error ? e.message : "Failed to load weather",
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = useCallback(
    (q: string) => {
      const t = q.trim();
      if (!t) {
        setError("Please enter a city name.");
        return;
      }
      setError(null);
      void runFetch(t);
    },
    [runFetch],
  );

  const bgConditionId = weatherData?.current.conditionId ?? 0;
  const bgIsDay = weatherData
    ? isDaytime(
        weatherData.current.dt,
        weatherData.current.sunrise,
        weatherData.current.sunset,
      )
    : true;

  const sceneForChrome: WeatherScene = isLoading
    ? "default"
    : resolveWeatherScene(bgConditionId, bgIsDay);
  const lightOnTop = atmospherePrefersLightText(theme, sceneForChrome);

  const kickerClass = lightOnTop
    ? "text-zinc-100 [text-shadow:0_1px_3px_rgba(0,0,0,0.88)]"
    : "text-zinc-800 [text-shadow:0_1px_3px_rgba(255,255,255,0.95),0_0_1px_rgba(255,255,255,0.85)]";
  const titleClass = lightOnTop
    ? "text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.92)]"
    : "text-zinc-950 [text-shadow:0_1px_3px_rgba(255,255,255,0.95),0_0_1px_rgba(255,255,255,0.85)]";
  const footerLinkClass = lightOnTop
    ? "font-medium text-white underline decoration-white/80 underline-offset-2 [text-shadow:0_1px_3px_rgba(0,0,0,0.92)] hover:text-zinc-100 hover:decoration-zinc-100 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    : "font-medium text-zinc-950 underline decoration-zinc-950/50 underline-offset-2 [text-shadow:0_1px_3px_rgba(255,255,255,0.95)] hover:text-zinc-800 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950";

  const footerSepClass = lightOnTop
    ? "text-zinc-300 [text-shadow:0_1px_2px_rgba(0,0,0,0.85)]"
    : "text-zinc-600 [text-shadow:0_1px_2px_rgba(255,255,255,0.9)]";

  return (
    <>
      <WeatherBackground
        loading={isLoading}
        conditionId={bgConditionId}
        isDay={bgIsDay}
        theme={theme}
      />

      <div className="relative z-10 min-h-screen">
        <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:max-w-4xl lg:px-8 xl:max-w-[52rem]">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p
                className={`text-xs font-semibold uppercase tracking-widest ${kickerClass}`}
              >
                Weather
              </p>
              <h1
                className={`mt-1 text-2xl font-bold tracking-tight ${titleClass}`}
              >
                {isLoading ? "Loading…" : weatherData?.current.city ?? city}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <UnitToggle unit={unit} onChange={setUnit} />
              <ThemeToggle />
            </div>
          </header>

          <div className="mt-6">
            <SearchBar
              value={searchInput}
              onChange={(v) => {
                setSearchInput(v);
                if (error === "Please enter a city name.") setError(null);
              }}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </div>

          <main className="theme-surface-transition relative mt-8 space-y-6 overflow-hidden rounded-2xl border border-white/30 bg-white/32 p-4 shadow-2xl shadow-black/10 ring-1 ring-white/20 backdrop-blur-xl dark:border-zinc-600/35 dark:bg-zinc-950/48 dark:shadow-black/40 dark:ring-zinc-500/15 sm:p-6 md:p-8">
            {isLoading && <WeatherSkeleton />}
            {!isLoading && error && (
              <ErrorMessage
                message={error}
                onRetry={() => void runFetch(city)}
              />
            )}
            {!isLoading && !error && weatherData && (
              <>
                <CurrentWeather data={weatherData.current} unit={unit} />
                <HourlyForecast items={weatherData.hourly} unit={unit} />
                <DailyForecast items={weatherData.daily} unit={unit} />
              </>
            )}
          </main>

          <p className="mt-10 text-center text-xs leading-relaxed">
            <Link href="/atlanta" className={footerLinkClass}>
              Atlanta demo route
            </Link>
            <span className={footerSepClass} aria-hidden>
              {" "}
              ·{" "}
            </span>
            <a
              href={`/api/weather?city=${encodeURIComponent(city)}`}
              className={footerLinkClass}
            >
              Raw JSON
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
