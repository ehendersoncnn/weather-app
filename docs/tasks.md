# Tasks — Weather App

This file defines the step-by-step execution plan for building the weather app.
Cursor should follow tasks sequentially. Always refer to `prd.md` before implementing.

---

## Phase 1 — Foundation

- [ ] Confirm Next.js + Tailwind v4 dev server runs cleanly (`npm run dev`)
- [ ] Add `OWM_API_KEY` to `.env.local` (OpenWeatherMap free tier key)
- [ ] Add OpenWeatherMap icon domain to `next.config.ts` image remotePatterns:
  ```ts
  { protocol: 'https', hostname: 'openweathermap.org' }
  ```
- [ ] Create `/api/weather/route.ts` — accepts `?city=` query param, fetches current weather + 5-day forecast from OWM, returns combined JSON. Keep API key server-side only.
- [ ] Define TypeScript types in `lib/types/weather.ts`:
  - `WeatherCurrent` — temp, feels_like, humidity, wind_speed, description, icon, city, country
  - `HourlyItem` — time, temp, icon, description
  - `DailyItem` — date, temp_min, temp_max, icon, description
  - `WeatherData` — `{ current: WeatherCurrent, hourly: HourlyItem[], daily: DailyItem[] }`
- [ ] Create `lib/weather.ts` — helper functions:
  - `fetchWeather(city: string): Promise<WeatherData>` — calls `/api/weather`
  - `celsiusToFahrenheit(c: number): number`
  - `formatDate(timestamp: number): string`
  - `formatTime(timestamp: number): string`
- [ ] Define global layout in `app/layout.tsx`:
  - Dark mode class strategy: `class="dark"` on `<html>` controlled by client component
  - Import global styles, set font, define metadata (title: "Weather App")
- [ ] Establish base page structure in `app/page.tsx` — placeholder content only, confirms layout renders

---

## Phase 2 — Core UI Components

- [ ] `components/WeatherBackground.tsx` (Client Component) — **immersive animated background**
  - Props: `conditionId: number`, `isDay: boolean`, `theme: 'light' | 'dark'`
  - Renders as a `fixed` full-viewport layer behind all UI content (`z-0`)
  - Map OWM condition codes to condition groups (`2xx`=thunderstorm, `3xx`=drizzle, `5xx`=rain, `6xx`=snow, `7xx`=fog, `800`=clear, `80x`=clouds)
  - Sky gradient layer: CSS `@keyframes` transitions between condition palettes (light + dark variants)
  - Cloud layer: multiple absolutely positioned divs at varying speeds/opacities for parallax drift
  - Particle layer: HTML5 `<canvas>` element for rain drops and snow flakes via `requestAnimationFrame`
  - Lightning layer: CSS opacity pulse on full-screen overlay, randomly triggered via `setTimeout`
  - Sun/moon: CSS-animated SVG or div with radial gradient glow, visible on clear conditions
  - Fog layer: translucent drifting divs for mist/haze conditions
  - Pause `requestAnimationFrame` when `document.visibilityState === 'hidden'`
  - Respect `prefers-reduced-motion`: skip all particle and movement animations, render static gradient only
  - Particle caps: Rain ≤ 150 drops, Snow ≤ 80 flakes
  - See `prd.md` → Animated Background Spec for full condition → color palette mapping
- [ ] `components/SearchBar.tsx` (Client Component)
  - Controlled input, submit on Enter or button click
  - Props: `onSearch: (city: string) => void`, `isLoading: boolean`
  - Shows subtle loading state while fetching
- [ ] `components/CurrentWeather.tsx` (Server-safe, pure display)
  - Props: `data: WeatherCurrent`, `unit: 'C' | 'F'`
  - Hero temperature display, condition icon, feels-like, humidity, wind
  - City + country subtitle
- [ ] `components/HourlyForecast.tsx`
  - Horizontal scrollable strip, 8 slots (every 3 hours over 24 hrs)
  - Each slot: time, icon, temp
  - Props: `items: HourlyItem[]`, `unit: 'C' | 'F'`
- [ ] `components/DailyForecast.tsx`
  - 7-row list or card grid
  - Each row: day name, icon, description, high/low temps
  - Props: `items: DailyItem[]`, `unit: 'C' | 'F'`
- [ ] `components/ThemeToggle.tsx` (Client Component)
  - Toggles `dark` class on `<html>`
  - Reads system preference on mount via `prefers-color-scheme`
  - Persists preference to `localStorage`
- [ ] `components/UnitToggle.tsx` (Client Component)
  - Simple °F / °C switch
  - Lifted state — lives in page-level context or prop-drilled from `app/page.tsx`
- [ ] `components/WeatherSkeleton.tsx`
  - Skeleton placeholder matching the layout of current + hourly + daily sections
  - Shown while fetch is in progress
- [ ] `components/ErrorMessage.tsx`
  - Friendly error display for city-not-found and API failure states
  - Props: `message: string`

---

## Phase 3 — Feature Assembly & Data Wiring

- [ ] Wire `app/page.tsx` as a Client Component:
  - State: `city`, `weatherData`, `isLoading`, `error`, `unit`
  - On search: call `fetchWeather(city)`, update state
  - Pass `conditionId`, `isDay`, and `theme` to `WeatherBackground` — update on every new weather fetch
  - Render: `WeatherBackground` (fixed, z-0) → content layer (relative, z-10) → `SearchBar` → conditional `WeatherSkeleton` / `ErrorMessage` / weather components
- [ ] Derive `isDay` from OWM `sys.sunrise` and `sys.sunset` timestamps in API response — pass to background
- [ ] Implement background transition on new city search: cross-fade between old and new condition state (CSS opacity transition on background layer)
- [ ] Background default/loading state: slow neutral gradient drift (muted blue-grey) while data is fetching
- [ ] Implement unit conversion: all temps rendered through a `formatTemp(value, unit)` util — no raw numbers in JSX
- [ ] Handle edge cases:
  - Empty search (no API call, optional inline hint)
  - API rate limit / network error (show `ErrorMessage` with retry prompt)
  - City not found (OWM returns 404 — map to friendly message)
- [ ] Add default city on first load (e.g., "Atlanta") so the app never opens blank
- [ ] Optional: persist last searched city to `localStorage` and restore on mount

---

## Phase 4 — Light / Dark Mode & Visual Polish

- [ ] Fully design **dark mode** — background, card surfaces, text, icon tints, borders; verify dark-mode background palettes per condition (see prd.md spec)
- [ ] Fully design **light mode** — equally considered background palettes per condition
- [ ] Verify theme toggle transitions smoothly — background cross-fades, no hard cuts
- [ ] Test all 8 condition states visually in both themes: Clear Day, Clear Night, Few Clouds, Overcast, Rain, Thunderstorm, Snow, Fog
- [ ] Verify text and UI cards maintain WCAG AA contrast (≥ 4.5:1) over every background condition — add semi-transparent overlay behind text if needed (`bg-black/20` or `bg-white/10`)
- [ ] Refine typography scale:
  - Hero temp: large, bold, prominent
  - Condition description: secondary, subdued
  - Labels (humidity, wind, etc.): small caps or muted weight
- [ ] Ensure `HourlyForecast` scroll strip looks intentional (hide scrollbar on desktop, subtle fade edges)
- [ ] Responsive audit:
  - Mobile (375px): single column, full-width cards
  - Tablet (768px): comfortable padding, readable hierarchy
  - Desktop (1280px): centered container, max-width constrained
- [ ] Verify weather icons render correctly in both themes (tint or swap if needed)

---

## Phase 5 — Performance & Quality

- [ ] Use `next/image` for weather condition icons (or inline SVG set if using custom icons)
- [ ] Confirm API route does not expose `OWM_API_KEY` to the client bundle
- [ ] **Animation performance audit:**
  - Verify Canvas particle loop pauses on tab blur (`visibilitychange` event)
  - Confirm particle caps: Rain ≤ 150, Snow ≤ 80 — profile on mid-range device
  - Use `will-change: transform` only on actively animating layers; remove after settle
  - No animation library > 10kb — keep particle rendering native Canvas + CSS
- [ ] **`prefers-reduced-motion` audit:** disable all CSS animations and Canvas loops; confirm static gradient fallback renders correctly for all conditions
- [ ] Add `loading="lazy"` and `priority` attributes to images appropriately
- [ ] Remove all `console.log` and debug artifacts
- [ ] Run Lighthouse on mobile — target ≥ 90 performance score (animations must not tank this)
- [ ] Accessibility check:
  - All interactive elements keyboard-navigable
  - Icons have `aria-label` or adjacent visible text
  - Contrast ratios pass WCAG AA in both themes across all background conditions
- [ ] Add `<meta name="description">` and Open Graph tags in `layout.tsx`

---

## Phase 6 — Deployment

- [ ] Confirm `.env.local` is in `.gitignore` (never commit the API key)
- [ ] Add `OWM_API_KEY` as an environment variable in Vercel project settings
- [ ] Push final code to GitHub main branch
- [ ] Deploy via Vercel — confirm production build succeeds
- [ ] Test production URL: search a city, toggle theme, toggle units, test error state
- [ ] Update `README.md` with setup instructions (env var required, OWM signup link)

---

## Notes

- Always refer to `prd.md` before implementing features
- Refer to `prd.md` → **Animated Background Spec** for the full condition → animation + color palette mapping before building `WeatherBackground.tsx`
- Temperatures are stored and fetched in **Celsius**; Fahrenheit is a client-side conversion only
- The OWM free tier 5-day/3-hour forecast gives 40 data points — slice to 8 for hourly, group by day for daily
- `isDay` is derived from `sys.sunrise` and `sys.sunset` in the OWM current weather response — always pass this to `WeatherBackground`
- Keep changes minimal and focused per task
- Prefer Server Components; only use `'use client'` where interactivity is required (search, theme toggle, unit toggle, page state, background animation)
- Prefer clarity over complexity
