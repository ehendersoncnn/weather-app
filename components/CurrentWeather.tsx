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
      className="theme-surface-transition rounded-2xl border border-zinc-200/90 bg-white/92 p-5 shadow-lg shadow-zinc-900/5 backdrop-blur-md dark:border-zinc-600/55 dark:bg-zinc-950/90 dark:shadow-black/30 sm:p-6"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Image
          src={src}
          alt={`${data.description} (forecast icon)`}
          width={96}
          height={96}
          sizes="96px"
          className="weather-owm-icon h-24 w-24 shrink-0"
          priority
        />
        <div className="min-w-0 flex-1">
          <h2 id="current-weather-heading" className="sr-only">
            Current conditions
          </h2>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
            {data.city}, {data.country}
          </p>
          <p className="mt-2 text-5xl font-extrabold tracking-tight text-zinc-950 tabular-nums dark:text-zinc-50 sm:text-6xl md:text-7xl">
            {formatTemp(data.temp, unit)}
          </p>
          <p className="mt-2 text-base font-normal capitalize leading-snug text-zinc-600 dark:text-zinc-400">
            {data.description}
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-3 text-sm text-zinc-700 sm:grid-cols-3 dark:text-zinc-300">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                Feels like
              </dt>
              <dd className="tabular-nums">
                {formatTemp(data.feels_like, unit)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                Humidity
              </dt>
              <dd className="tabular-nums">{data.humidity}%</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
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
