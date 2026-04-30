# Cursor Rules — Weather App

## Project Context

This is a **Next.js App Router** weather application (React 19, TypeScript, Tailwind v4).
It displays real-time weather data from the OpenWeatherMap API with full light/dark mode support.

Product and engineering notes live under `docs/`:
- `prd.md` — product requirements, scope, user stories, UX principles
- `tasks.md` — phased implementation plan (follow sequentially)

**Always read `docs/prd.md` and `docs/tasks.md` before implementing any feature.**

---

## Next.js & Agent Constraints

- Follow **`AGENTS.md`** at the repo root.
- Prefer App Router patterns (`app/` directory). Never use `pages/` or legacy data-fetching patterns (`getServerSideProps`, `getStaticProps`).
- Refer to in-repo Next.js docs (`node_modules/next/dist/docs/`) for routing, data fetching, and caching when behavior is uncertain.

---

## Architecture — Weather App Specifics

### Data Flow
```
User searches city
  → Client calls /api/weather?city=...
  → API route fetches OWM (current + forecast) server-side
  → Returns WeatherData to client
  → Client renders components
```

### Key Files & Responsibilities

| File | Role |
|---|---|
| `app/page.tsx` | Client Component — owns all weather state (city, data, loading, error, unit) |
| `app/api/weather/route.ts` | Server-side API route — fetches OWM, keeps API key hidden |
| `lib/types/weather.ts` | All TypeScript types for weather data |
| `lib/weather.ts` | `fetchWeather()`, `celsiusToFahrenheit()`, `formatTemp()`, `formatDate()`, `formatTime()` |
| `components/WeatherBackground.tsx` | Client Component — full-screen animated background driven by condition + theme |
| `components/SearchBar.tsx` | Client Component — search input + submit |
| `components/CurrentWeather.tsx` | Display-only — current conditions hero |
| `components/HourlyForecast.tsx` | Horizontal scroll strip — next 8 × 3-hour slots |
| `components/DailyForecast.tsx` | 7-day forecast list |
| `components/ThemeToggle.tsx` | Client Component — dark/light toggle |
| `components/UnitToggle.tsx` | Client Component — °F / °C toggle |
| `components/WeatherSkeleton.tsx` | Loading placeholder |
| `components/ErrorMessage.tsx` | Error state display |

### Animated Background — `WeatherBackground.tsx`

This is the most visually distinctive feature of the app. Read `prd.md` → **Animated Background Spec** before implementing.

**Key rules:**
- `WeatherBackground` renders as `position: fixed`, `inset: 0`, `z-index: 0`. All other UI content renders at `z-index: 10` or above.
- Props: `conditionId: number` (OWM code), `isDay: boolean`, `theme: 'light' | 'dark'`
- Map OWM condition code ranges to condition groups before selecting animation:
  - `2xx` → Thunderstorm, `3xx` → Drizzle, `5xx` → Rain, `6xx` → Snow, `7xx` → Fog, `800` → Clear, `801–804` → Clouds
- `isDay` is derived from `sys.sunrise` / `sys.sunset` in the OWM API response — always pass it. Clear day and clear night are distinct animations.
- Background transitions on condition change: cross-fade using CSS `opacity` transition (800ms) — never a hard cut.
- **Canvas particle rules:** Rain ≤ 150 drops, Snow ≤ 80 flakes. Pause `requestAnimationFrame` on `visibilitychange` (tab not active).
- **`prefers-reduced-motion`:** all animations off. Static gradient only. Non-negotiable.
- Keep animation logic self-contained in `WeatherBackground.tsx`. Do not bleed animation state into other components.
- No animation library > 10kb — use native Canvas + CSS animations only.

### OpenWeatherMap Integration

- **Never expose `OWM_API_KEY` to the client.** All OWM requests go through `/api/weather/route.ts`.
- Store key in `.env.local` as `OWM_API_KEY` (no `NEXT_PUBLIC_` prefix).
- Endpoints used:
  - Current: `https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric`
  - Forecast: `https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={key}&units=metric`
- All temperatures stored and returned in **Celsius**. Fahrenheit conversion is client-side only via `formatTemp(value, unit)`.
- OWM forecast returns 40 × 3-hour slots. Slice the first 8 for hourly; group by calendar day for daily (take noon slot or first slot per day).
- OWM icons: `https://openweathermap.org/img/wn/{icon}@2x.png` — add this domain to `next.config.ts` image remotePatterns.

---

## Editing Guidelines

- Match existing patterns in `app/` (layout, metadata, Tailwind usage).
- Keep changes **minimal and scoped** to the current task. Avoid unrelated refactors.
- Use **Server Components** unless a Client Component is explicitly required (search input, toggles, page-level state, background animation).
- Mark Client Components with `'use client'` at the top. Do not add it unless necessary.
- All temperature values in JSX must go through `formatTemp(value, unit)` — never raw numbers.
- Handle all three states for weather data: **loading** (skeleton), **error** (ErrorMessage), **success** (weather components).
- **All text and UI must maintain WCAG AA contrast over the animated background in every condition state.** Use `bg-black/20` or `bg-white/10` overlays behind text if needed.

---

## Light / Dark Mode

- Dark mode is controlled by the `dark` class on `<html>` (Tailwind class strategy).
- `ThemeToggle` reads `prefers-color-scheme` on mount and persists choice to `localStorage`.
- Both themes are fully designed — dark mode is not an afterthought.
- Use Tailwind `dark:` variants for all theme-sensitive colors.
- Ensure smooth transitions: apply `transition-colors duration-300` to major layout containers.

---

## Design & UI Guidelines

- **Temperature is the hero.** It should be the largest, most prominent element on screen.
- **The background is the experience.** `WeatherBackground` makes the weather emotionally legible — it should feel alive and reactive, not decorative.
- **Minimal chrome.** No unnecessary nav, sidebars, or decorative elements. Let the background breathe.
- **Layer discipline:** Background at `z-0`, UI content at `z-10`+. Never let UI components fight the background.
- **Readable at a glance.** Secondary data (humidity, wind, feels-like) uses smaller, muted type. Text must be readable over all background states.
- **Horizontal scroll strip** for hourly forecast — hide scrollbar, add subtle fade edges on desktop.
- **Responsive breakpoints:**
  - Mobile (375px): single column, full-width
  - Tablet (768px): comfortable padding
  - Desktop (1280px): centered container, `max-w-3xl` or similar constraint

---

## Documentation

When behavior, stack, or structure changes meaningfully, update the relevant file in `docs/` so the PRD, tasks, and this rules file stay accurate.

---

## UX Principles (from PRD)

- Speed over richness — show temperature + condition immediately
- Light/dark as first-class — both themes designed with equal care
- Minimal chrome — no clutter competing with weather data
- Readable at a glance — typography scale reflects data hierarchy
- Honest empty states — loading and error are never silent or blank

---

## AI Collaboration

- Always read `docs/prd.md` and `docs/tasks.md` before implementing features.
- Follow `tasks.md` step-by-step. Do not skip phases.
- Ask for clarification if a task is ambiguous before implementing.
- When a task is complete, check it off in `tasks.md`.
