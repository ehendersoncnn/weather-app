import Image from "next/image";
import { CalendarIcon } from "@/components/ForecastSectionIcons";
import type { DailyItem } from "@/lib/types/weather";
import type { TempUnit } from "@/lib/weather";
import { formatDate, formatTemp } from "@/lib/weather";

export interface DailyForecastProps {
  items: DailyItem[];
  unit: TempUnit;
}

/** Full-width track: cold (left) → hot (right), aligned to this forecast’s min/max. */
const RANGE_TRACK_GRADIENT =
  "linear-gradient(90deg, #38bdf8 0%, #7dd3fc 18%, #a78bfa 42%, #fbbf24 68%, #fb923c 85%, #f87171 100%)";
const RANGE_TRACK_GRADIENT_DARK =
  "linear-gradient(90deg, #0ea5e9 0%, #38bdf8 20%, #818cf8 45%, #eab308 65%, #ea580c 82%, #ef4444 100%)";

function WeeklyTemperatureRangeBar({
  tempMin,
  tempMax,
  globalMin,
  globalMax,
  unit,
}: {
  tempMin: number;
  tempMax: number;
  globalMin: number;
  globalMax: number;
  unit: TempUnit;
}) {
  const span = Math.max(globalMax - globalMin, 1e-6);
  let leftPct = ((tempMin - globalMin) / span) * 100;
  let widthPct = ((tempMax - tempMin) / span) * 100;

  leftPct = Math.min(100, Math.max(0, leftPct));
  widthPct = Math.max(widthPct, 0);
  if (leftPct + widthPct > 100) widthPct = 100 - leftPct;
  if (widthPct < 2) widthPct = Math.min(2, 100 - leftPct);

  const label = `${formatTemp(tempMin, unit)} to ${formatTemp(tempMax, unit)} within the week’s ${formatTemp(globalMin, unit)}–${formatTemp(globalMax, unit)} range`;

  return (
    <div
      className="relative min-h-5 min-w-0 w-full px-1.5"
      role="img"
      aria-label={label}
    >
      <div className="relative h-5 w-full overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 my-0 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-zinc-200/90 ring-1 ring-zinc-300/60 dark:bg-zinc-800/95 dark:ring-zinc-600/50">
          <div
            className="h-full w-full dark:hidden"
            style={{ background: RANGE_TRACK_GRADIENT }}
          />
          <div
            className="hidden h-full w-full dark:block"
            style={{ background: RANGE_TRACK_GRADIENT_DARK }}
          />
        </div>
        <div
          className="pointer-events-none absolute top-1/2 h-2.5 -translate-y-1/2"
          style={{
            left: `${leftPct}%`,
            width: `${Math.max(widthPct, 0)}%`,
            minWidth: "6px",
            maxWidth: `calc(100% - ${leftPct}%)`,
          }}
        >
          <div className="h-full w-full rounded-full bg-white/92 shadow-sm ring-1 ring-zinc-900/10 dark:bg-zinc-100/95 dark:ring-white/20" />
        </div>
      </div>
    </div>
  );
}

export function DailyForecast({ items, unit }: DailyForecastProps) {
  const rows = items.slice(0, 7);
  const globalMin = Math.min(...rows.map((d) => d.temp_min));
  const globalMax = Math.max(...rows.map((d) => d.temp_max));

  return (
    <section
      aria-label="Daily forecast"
      className="theme-surface-transition rounded-2xl border border-zinc-200/90 bg-white/92 p-4 shadow-lg shadow-zinc-900/5 backdrop-blur-md dark:border-zinc-600/55 dark:bg-zinc-950/90 dark:shadow-black/30 sm:p-5"
    >
      <h2 className="mb-3 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
        <CalendarIcon className="size-[1em] shrink-0 opacity-90" />
        7-day outlook
      </h2>
      <ul className="space-y-0.5">
        {rows.map((day) => (
          <li
            key={day.date}
            className="flex flex-col gap-2 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-zinc-200/80 hover:bg-zinc-50/95 sm:grid sm:grid-cols-[7.5rem_2.25rem_minmax(0,1fr)_3.25rem_minmax(5rem,1fr)_3.25rem] sm:items-center sm:gap-x-3 sm:gap-y-0 sm:px-1 dark:hover:border-zinc-600/50 dark:hover:bg-zinc-800/70"
            aria-label={`${formatDate(day.date)}: ${day.description}, low ${formatTemp(day.temp_min, unit)}, high ${formatTemp(day.temp_max, unit)}`}
          >
            <div className="flex min-w-0 items-center gap-2 sm:contents">
              <span className="w-[7.25rem] shrink-0 truncate text-sm font-medium text-zinc-800 sm:w-auto dark:text-zinc-200">
                {formatDate(day.date)}
              </span>
              <Image
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt=""
                width={36}
                height={36}
                className="weather-owm-icon h-9 w-9 shrink-0 justify-self-center"
              />
              <span className="min-w-0 flex-1 truncate text-sm capitalize text-zinc-600 dark:text-zinc-400">
                {day.description}
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-3 sm:contents">
              <span className="inline-flex w-[3.25rem] shrink-0 justify-end text-sm font-medium tabular-nums text-zinc-600 sm:block sm:w-full sm:text-right dark:text-zinc-400">
                {formatTemp(day.temp_min, unit)}
              </span>
              <WeeklyTemperatureRangeBar
                tempMin={day.temp_min}
                tempMax={day.temp_max}
                globalMin={globalMin}
                globalMax={globalMax}
                unit={unit}
              />
              <span className="inline-flex w-[3.25rem] shrink-0 justify-start text-sm font-semibold tabular-nums text-zinc-900 sm:block sm:w-full sm:text-left dark:text-zinc-50">
                {formatTemp(day.temp_max, unit)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
