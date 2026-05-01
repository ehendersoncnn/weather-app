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
      className="rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-lg backdrop-blur-md dark:border-zinc-700/80 dark:bg-zinc-900/80"
    >
      <h2 className="mb-3 flex items-center gap-1.5 px-1 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        <ClockIcon className="size-[1em] shrink-0 opacity-90" />
        Next hours
      </h2>
      <div className="relative">
        <ul className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {slots.map((slot) => (
            <li
              key={slot.time}
              className="flex min-w-[4.75rem] shrink-0 flex-col items-center rounded-xl bg-zinc-50/90 px-3 py-2 dark:bg-zinc-800/80"
            >
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {formatTime(slot.time)}
              </span>
              <Image
                src={`https://openweathermap.org/img/wn/${slot.icon}.png`}
                alt=""
                width={40}
                height={40}
                className="my-1 h-10 w-10"
              />
              <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                {formatTemp(slot.temp, unit)}
              </span>
            </li>
          ))}
        </ul>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/90 to-transparent dark:from-zinc-900/90 sm:w-12"
        />
      </div>
    </section>
  );
}
