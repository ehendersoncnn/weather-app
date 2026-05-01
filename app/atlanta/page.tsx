import Link from "next/link";
import { headers } from "next/headers";
import type { WeatherData } from "@/lib/types/weather";
import { isDaytime } from "@/lib/weather";
import { AtlantaClientView } from "./AtlantaClientView";

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

  const isDay = isDaytime(
    data.current.dt,
    data.current.sunrise,
    data.current.sunset,
  );

  return <AtlantaClientView data={data} isDay={isDay} />;
}
