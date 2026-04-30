import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { formatDate, formatTemp, formatTime } from "@/lib/weather";
import type { WeatherData } from "@/lib/types/weather";

export const dynamic = "force-dynamic";

async function loadAtlantaWeather(): Promise<WeatherData> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) {
    throw new Error("Missing host header");
  }
  const proto = h.get("x-forwarded-proto") ?? "http";
  const url = `${proto}://${host}/api/weather?city=${encodeURIComponent("Atlanta")}`;
  const res = await fetch(url, { cache: "no-store" });
  const body = (await res.json()) as WeatherData & { error?: string };
  if (!res.ok) {
    throw new Error(
      typeof body.error === "string" ? body.error : "Failed to load weather",
    );
  }
  return body as WeatherData;
}

export default async function AtlantaPage() {
  let data: WeatherData;
  try {
    data = await loadAtlantaWeather();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Something went wrong";
    return (
      <div className="relative z-10 mx-auto max-w-lg px-6 py-16">
        <p className="text-red-600 dark:text-red-400">{message}</p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 underline dark:text-blue-400"
        >
          Home
        </Link>
      </div>
    );
  }

  const { current, hourly, daily } = data;

  return (
    <div className="relative z-10 mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        ← Home
      </Link>

      <div className="mt-6 flex flex-wrap items-start gap-6">
        <Image
          src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
          alt=""
          width={96}
          height={96}
          className="h-24 w-24"
        />
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {current.city}, {current.country}
          </h1>
          <p className="mt-2 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {formatTemp(current.temp)}
          </p>
          <p className="mt-1 capitalize text-zinc-600 dark:text-zinc-400">
            {current.description}
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            Feels like {formatTemp(current.feels_like)} · Humidity{" "}
            {current.humidity}% · Wind {current.wind_speed} m/s
          </p>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-medium text-zinc-900 dark:text-zinc-50">
        Next hours
      </h2>
      <ul className="mt-3 flex gap-3 overflow-x-auto pb-2">
        {hourly.map((slot) => (
          <li
            key={slot.time}
            className="min-w-[4.75rem] shrink-0 rounded-lg bg-white/90 px-3 py-2 text-center shadow-sm dark:bg-zinc-900/90"
          >
            <div className="text-xs text-zinc-500">{formatTime(slot.time)}</div>
            <div className="font-semibold text-zinc-900 dark:text-zinc-50">
              {formatTemp(slot.temp)}
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-lg font-medium text-zinc-900 dark:text-zinc-50">
        Daily
      </h2>
      <ul className="mt-3 space-y-2">
        {daily.map((day) => (
          <li
            key={day.date}
            className="flex items-center justify-between rounded-lg bg-white/90 px-4 py-2 shadow-sm dark:bg-zinc-900/90"
          >
            <span className="text-zinc-700 dark:text-zinc-300">
              {formatDate(day.date)}
            </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {formatTemp(day.temp_max)} / {formatTemp(day.temp_min)}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-xs text-zinc-400">
        API data is in °C; this page shows °F via{" "}
        <code className="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">formatTemp</code>
        .{" "}
        <Link
          href="/api/weather?city=Atlanta"
          className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          Raw JSON
        </Link>
      </p>
    </div>
  );
}
