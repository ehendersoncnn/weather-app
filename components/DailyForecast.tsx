import Image from "next/image";
import { CalendarIcon } from "@/components/ForecastSectionIcons";
import type { DailyItem } from "@/lib/types/weather";
import type { TempUnit } from "@/lib/weather";
import { formatDate, formatTemp } from "@/lib/weather";

export interface DailyForecastProps {
  items: DailyItem[];
  unit: TempUnit;
}

export function DailyForecast({ items, unit }: DailyForecastProps) {
  const rows = items.slice(0, 7);

  return (
    <section
      aria-label="Daily forecast"
      className="rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-lg backdrop-blur-md dark:border-zinc-700/80 dark:bg-zinc-900/80"
    >
      <h2 className="mb-3 flex items-center gap-1.5 px-1 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        <CalendarIcon className="size-[1em] shrink-0 opacity-90" />
        7-day outlook
      </h2>
      <ul className="space-y-1">
        {rows.map((day) => (
          <li
            key={day.date}
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-zinc-50/90 dark:hover:bg-zinc-800/60"
          >
            <span className="w-24 shrink-0 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {formatDate(day.date)}
            </span>
            <Image
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0"
            />
            <span className="min-w-0 flex-1 truncate text-sm capitalize text-zinc-600 dark:text-zinc-400">
              {day.description}
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {formatTemp(day.temp_max, unit)} / {formatTemp(day.temp_min, unit)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
