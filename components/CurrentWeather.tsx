import Image from "next/image";
import type { WeatherCurrent } from "@/lib/types/weather";
import type { TempUnit } from "@/lib/weather";
import { formatTemp } from "@/lib/weather";

export interface CurrentWeatherProps {
  data: WeatherCurrent;
  unit: TempUnit;
}

export function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  const src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

  return (
    <section
      aria-labelledby="current-weather-heading"
      className="rounded-2xl border border-zinc-200/80 bg-white/85 p-6 shadow-lg backdrop-blur-md dark:border-zinc-700/80 dark:bg-zinc-900/80"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Image
          src={src}
          alt=""
          width={96}
          height={96}
          className="h-24 w-24 shrink-0"
          priority
        />
        <div className="min-w-0 flex-1">
          <h2 id="current-weather-heading" className="sr-only">
            Current conditions
          </h2>
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {data.city}, {data.country}
          </p>
          <p className="mt-1 text-5xl font-bold tracking-tight text-zinc-900 tabular-nums dark:text-zinc-50 sm:text-6xl">
            {formatTemp(data.temp, unit)}
          </p>
          <p className="mt-1 capitalize text-zinc-600 dark:text-zinc-300">
            {data.description}
          </p>
          <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-zinc-600 sm:grid-cols-3 dark:text-zinc-400">
            <div>
              <dt className="font-medium text-zinc-500 dark:text-zinc-500">
                Feels like
              </dt>
              <dd className="tabular-nums">
                {formatTemp(data.feels_like, unit)}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500 dark:text-zinc-500">
                Humidity
              </dt>
              <dd className="tabular-nums">{data.humidity}%</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500 dark:text-zinc-500">
                Wind
              </dt>
              <dd className="tabular-nums">{data.wind_speed} m/s</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
