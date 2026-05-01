import Image from "next/image";
import { ClockIcon } from "@/components/ForecastSectionIcons";
import type { HourlyItem } from "@/lib/types/weather";
import type { TempUnit } from "@/lib/weather";
import { formatTemp, formatTime } from "@/lib/weather";

export interface HourlyForecastProps {
  items: HourlyItem[];
  unit: TempUnit;
}

export function HourlyForecast({ items, unit }: HourlyForecastProps) {
  const slots = items.slice(0, 8);

  return (
    <section
      aria-label="Hourly forecast"
      className="theme-surface-transition rounded-2xl border border-zinc-200/90 bg-white/92 p-4 shadow-lg shadow-zinc-900/5 backdrop-blur-md dark:border-zinc-600/55 dark:bg-zinc-950/90 dark:shadow-black/30 sm:p-5"
    >
      <h2 className="mb-3 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
        <ClockIcon className="size-[1em] shrink-0 opacity-90" />
        Next hours
      </h2>
      <div className="relative -mx-1 px-1">
        <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {slots.map((slot) => (
            <li
              key={slot.time}
              className="flex min-w-[4.75rem] shrink-0 snap-start flex-col items-center rounded-xl border border-zinc-200/60 bg-zinc-50/95 px-3 py-2 dark:border-zinc-600/40 dark:bg-zinc-800/90"
            >
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {formatTime(slot.time)}
              </span>
              <Image
                src={`https://openweathermap.org/img/wn/${slot.icon}.png`}
                alt={`${slot.description} at ${formatTime(slot.time)}`}
                width={40}
                height={40}
                sizes="40px"
                loading="lazy"
                className="weather-owm-icon my-1 h-10 w-10"
              />
              <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                {formatTemp(slot.temp, unit)}
              </span>
            </li>
          ))}
        </ul>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-6 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-10 dark:from-zinc-950 dark:via-zinc-950/85"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-6 bg-gradient-to-l from-white via-white/80 to-transparent sm:w-10 dark:from-zinc-950 dark:via-zinc-950/85"
        />
      </div>
    </section>
  );
}
