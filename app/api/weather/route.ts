import { NextResponse } from "next/server";
import type {
  DailyItem,
  HourlyItem,
  WeatherCurrent,
  WeatherData,
} from "@/lib/types/weather";

const OWM_BASE = "https://api.openweathermap.org/data/2.5";

type OwmCurrentResponse = {
  dt?: number;
  weather?: Array<{ id: number; description: string; icon: string }>;
  main?: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind?: { speed: number };
  sys?: { country: string; sunrise: number; sunset: number };
  name?: string;
  cod?: number | string;
  message?: string;
};

type OwmForecastListItem = {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number };
  weather: Array<{ id: number; description: string; icon: string }>;
};

type OwmForecastResponse = {
  list?: OwmForecastListItem[];
  cod?: string;
  message?: string;
};

function mapCurrent(json: OwmCurrentResponse): WeatherCurrent | null {
  const w = json.weather?.[0];
  const main = json.main;
  const sys = json.sys;
  if (!w || !main || !sys || !json.name || typeof json.dt !== "number")
    return null;
  return {
    dt: json.dt,
    temp: main.temp,
    feels_like: main.feels_like,
    humidity: main.humidity,
    wind_speed: json.wind?.speed ?? 0,
    description: w.description,
    icon: w.icon,
    city: json.name,
    country: sys.country,
    conditionId: w.id,
    sunrise: sys.sunrise,
    sunset: sys.sunset,
  };
}

function mapHourly(list: OwmForecastListItem[]): HourlyItem[] {
  return list.slice(0, 8).map((item) => {
    const w = item.weather[0];
    return {
      time: item.dt,
      temp: item.main.temp,
      icon: w.icon,
      description: w.description,
    };
  });
}

function dayKeyUtcSeconds(dt: number): string {
  return new Date(dt * 1000).toISOString().slice(0, 10);
}

function mapDaily(list: OwmForecastListItem[]): DailyItem[] {
  const byDay = new Map<
    string,
    { min: number; max: number; items: OwmForecastListItem[] }
  >();

  for (const item of list) {
    const key = dayKeyUtcSeconds(item.dt);
    const prev = byDay.get(key);
    if (!prev) {
      byDay.set(key, {
        min: item.main.temp_min,
        max: item.main.temp_max,
        items: [item],
      });
    } else {
      prev.min = Math.min(prev.min, item.main.temp_min);
      prev.max = Math.max(prev.max, item.main.temp_max);
      prev.items.push(item);
    }
  }

  const days: DailyItem[] = [];
  const sortedKeys = [...byDay.keys()].sort();

  for (const key of sortedKeys) {
    const bucket = byDay.get(key)!;
    const noonUtcHour = 12;
    const representative =
      bucket.items.find((i) => {
        const h = new Date(i.dt * 1000).getUTCHours();
        return Math.abs(h - noonUtcHour) <= 3;
      }) ?? bucket.items[Math.floor(bucket.items.length / 2)];
    const w = representative.weather[0];
    days.push({
      date: representative.dt,
      temp_min: bucket.min,
      temp_max: bucket.max,
      icon: w.icon,
      description: w.description,
    });
  }

  return days;
}

export async function GET(request: Request) {
  const key = process.env.OWM_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      { error: "Server missing OWM_API_KEY" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();
  if (!city) {
    return NextResponse.json({ error: "Missing city query parameter" }, {
      status: 400,
    });
  }

  const params = new URLSearchParams({
    q: city,
    appid: key,
    units: "metric",
  });

  let currentRes: Response;
  let forecastRes: Response;
  try {
    [currentRes, forecastRes] = await Promise.all([
      fetch(`${OWM_BASE}/weather?${params}`, { next: { revalidate: 300 } }),
      fetch(`${OWM_BASE}/forecast?${params}`, { next: { revalidate: 300 } }),
    ]);
  } catch {
    return NextResponse.json({ error: "Network error calling weather API" }, {
      status: 502,
    });
  }

  if (!currentRes.ok) {
    if (currentRes.status === 404) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }
    const errBody = (await currentRes.json()) as OwmCurrentResponse;
    return NextResponse.json(
      {
        error:
          typeof errBody.message === "string"
            ? errBody.message
            : "Weather request failed",
      },
      { status: currentRes.status >= 400 ? currentRes.status : 502 },
    );
  }

  if (!forecastRes.ok) {
    return NextResponse.json({ error: "Forecast request failed" }, {
      status: forecastRes.status >= 400 ? forecastRes.status : 502,
    });
  }

  const currentJson = (await currentRes.json()) as OwmCurrentResponse;
  const forecastJson = (await forecastRes.json()) as OwmForecastResponse;

  const current = mapCurrent(currentJson);
  if (!current) {
    return NextResponse.json({ error: "Invalid weather response" }, {
      status: 502,
    });
  }

  const list = forecastJson.list ?? [];
  const payload: WeatherData = {
    current,
    hourly: mapHourly(list),
    daily: mapDaily(list),
  };

  return NextResponse.json(payload);
}
