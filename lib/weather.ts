import type { WeatherData } from "@/lib/types/weather";

function getBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  const params = new URLSearchParams({ city: city.trim() });
  const path = `/api/weather?${params}`;
  const url = typeof window === "undefined" ? `${getBaseUrl()}${path}` : path;

  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new Error(
      "Network error — check your connection and try again.",
    );
  }

  const body = (await res.json()) as WeatherData & { error?: string };
  if (!res.ok) {
    throw new Error(
      typeof body.error === "string" ? body.error : "Failed to load weather",
    );
  }
  return body as WeatherData;
}

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export type TempUnit = "C" | "F";

/** Default shown in the UI; API data stays in Celsius. */
export const DEFAULT_TEMP_UNIT: TempUnit = "F";

/** `value` is always Celsius from the API. */
export function formatTemp(
  celsius: number,
  unit: TempUnit = DEFAULT_TEMP_UNIT,
): string {
  const n =
    unit === "F" ? celsiusToFahrenheit(celsius) : celsius;
  return `${Math.round(n)}°${unit}`;
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp * 1000));
}

export function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp * 1000));
}

/** Uses OWM `sys.sunrise` / `sys.sunset` unix seconds (UTC-aligned with their API). */
export function isDaytime(
  nowSeconds: number,
  sunriseSeconds: number,
  sunsetSeconds: number,
): boolean {
  return nowSeconds >= sunriseSeconds && nowSeconds < sunsetSeconds;
}
