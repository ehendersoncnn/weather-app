"use client";

import type { TempUnit } from "@/lib/weather";

export interface UnitToggleProps {
  unit: TempUnit;
  onChange: (unit: TempUnit) => void;
}

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div
      role="group"
      aria-label="Temperature units"
      className="inline-flex rounded-full border border-zinc-300/80 bg-white/70 p-0.5 shadow-sm backdrop-blur-sm dark:border-zinc-600 dark:bg-zinc-900/70"
    >
      {(["F", "C"] as const).map((u) => (
        <button
          key={u}
          type="button"
          onClick={() => onChange(u)}
          aria-pressed={unit === u}
          aria-label={u === "F" ? "Use degrees Fahrenheit" : "Use degrees Celsius"}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:focus-visible:ring-blue-400/50 ${
            unit === u
              ? "bg-zinc-900 text-white shadow dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-600 hover:bg-white/80 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
          }`}
        >
          °{u}
        </button>
      ))}
    </div>
  );
}
