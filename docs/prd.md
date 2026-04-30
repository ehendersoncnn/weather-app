# Product Requirements Document (PRD)

## Summary

A responsive weather web app built with Next.js App Router, TypeScript, and Tailwind v4. Users can search any city and instantly see current conditions, an hourly outlook, and a 7-day forecast — all wrapped in an immersive, condition-driven animated background that reacts to live weather in real time. The visual experience is inspired by the Apple Weather app's iOS 15 redesign: animated environments that shift with the actual weather (rain falling on screen during rain, drifting clouds on overcast days, a moving sun arc on clear days). The UI respects system light/dark mode preferences and allows manual toggling.

---

## Goals

- Deliver accurate, real-time weather data via the OpenWeatherMap API.
- Create an immersive, emotionally resonant experience through condition-driven animated backgrounds that make the weather *feel* real — not just display it.
- Provide a fast, distraction-free experience optimized for quick lookups.
- Support light and dark mode with smooth, intentional transitions.
- Be fully responsive — usable on mobile, tablet, and desktop.
- Serve as a reusable reference for API-driven Next.js apps in this template system.

---

## Users & Personas

**The Casual Checker**
Opens the app quickly to decide what to wear or whether to carry an umbrella. Wants the answer in under 3 seconds. The animated background instantly communicates the vibe of the day — they feel the rain before they read the label.

**The Planner**
Checks a 7-day forecast before a trip or outdoor event. Wants temperature ranges, precipitation likelihood, and a general sense of the week ahead. The visual environment helps them intuitively understand what conditions feel like, not just what the numbers say.

Both personas expect the app to feel polished, load fast, and respect their OS theme preference. The animation should feel like a natural part of the experience — never gimmicky or distracting from the data.

---

## Scope

### In Scope

- City search with autocomplete or submit-on-enter
- Current conditions: temperature, feels-like, humidity, wind speed, weather description, and condition icon
- Hourly forecast (next 12–24 hours) displayed as a horizontal scroll strip
- 7-day daily forecast with high/low temps and condition icons
- **Immersive animated background** — full-screen, condition-driven environment that updates in real time based on current weather (see Animated Background Spec below)
- Light and dark mode — auto-detect from system, with manual toggle; background animations adapt to theme
- Responsive layout (mobile-first, scales gracefully to desktop)
- Unit toggle: Fahrenheit / Celsius
- Loading and error states (city not found, API failure)
- Location displayed as "City, Country Code"

### Out of Scope

- User accounts or saved locations
- Push notifications or alerts
- Radar maps
- Native mobile app (this is web only)
- Monetization or ads
- Reduced-motion users: `prefers-reduced-motion` must be respected — all animations pause/disable gracefully

---

## User Stories / Flows

**Search flow (primary)**
1. User lands on the app — sees a search bar over the animated background (default state or last city).
2. User types a city name and presses Enter or clicks Search.
3. App fetches weather data; background transitions to match the returned conditions.
4. User can clear and search a new city at any time — background transitions smoothly to the new environment.

**Animated background behavior**
- Background updates automatically when weather data changes (new city search).
- Transitions between weather states are smooth (cross-fade or morph, not a hard cut).
- Animation runs continuously in a loop while the condition is active.
- `prefers-reduced-motion`: all animations pause; background becomes a static gradient matching the condition's color palette.

**Theme toggle**
- App respects `prefers-color-scheme` on load.
- A visible toggle in the header allows switching between light and dark mode manually.
- Background animations adapt to theme (e.g., sunny day = bright sky in light mode, deep blue dusk in dark mode).

**Unit toggle**
- A toggle (°F / °C) switches all temperature values without a new API call (convert client-side).

**Error state**
- If the city is not found or the API fails, show a clear, friendly error message with a prompt to try again.
- Background returns to a neutral default state.

**Loading state**
- While data is fetching, show a skeleton or subtle loading indicator — never a blank screen.
- Background can show a calm, neutral animation (slow drifting clouds or gradient) during loading.

---

## Success Metrics

- Time-to-weather (TTW): user gets current conditions within 2 seconds of submitting a search on a standard connection.
- Background animation transitions complete within 800ms — smooth, never jarring.
- Animation runs at a consistent 60fps on mid-range devices; degrades gracefully on low-end hardware.
- Zero layout shift during theme toggle or background transition.
- Lighthouse performance score ≥ 90 on mobile (animations must not tank this).
- `prefers-reduced-motion` respected — all animations disabled, static fallback renders correctly.
- Fully usable without JavaScript (graceful degradation where possible).
- No accessibility violations at WCAG AA level — text remains readable over all background states.

---

## Dependencies & Assumptions

- **OpenWeatherMap API** — requires a free API key stored in `.env.local` as `OWM_API_KEY` (server-side only, never `NEXT_PUBLIC_`).
- Weather data is fetched via a Next.js API route (`/api/weather`) to keep the API key server-side.
- **Animated backgrounds** — implemented using CSS animations + Canvas API or a lightweight library (see Animated Background Spec). No heavy 3D engine required.
- Tailwind v4 is already configured in this template.
- No database or auth layer required.
- `next/image` used for any weather icons if served from external URLs (add OpenWeatherMap domain to `next.config.ts`).

### Environment Variables

```
OWM_API_KEY=your_openweathermap_api_key
```

### OpenWeatherMap Endpoints Used

| Data | Endpoint |
|---|---|
| Current weather | `GET /data/2.5/weather?q={city}&appid={key}&units=metric` |
| 5-day / 3-hour forecast | `GET /data/2.5/forecast?q={city}&appid={key}&units=metric` |

Temperatures stored in Celsius internally; Fahrenheit conversion done client-side.

---

## Open Questions

- Should the app remember the last searched city (localStorage)?
- Should geolocation ("use my location") be supported in v1?
- Are custom weather icons preferred over OpenWeatherMap's default icons?
- Should the hourly strip show every hour or every 3 hours (OWM free tier gives 3-hour intervals)?
- Canvas API vs. CSS-only animations for particles — CSS is simpler and GPU-accelerated; Canvas gives more control for rain/snow physics. Decision needed before Phase 3.
- Should animation intensity scale with weather severity (light drizzle vs. heavy downpour)?

---

## Animated Background Spec

### Concept
The background is a full-screen, layered animated environment that responds to the current weather condition returned by the OWM API. It sits behind all UI content as a `fixed` full-viewport layer. UI text and cards render on top with sufficient contrast in both themes.

### Condition → Animation Mapping

| OWM Condition Group | Animation | Color Palette (Light) | Color Palette (Dark) |
|---|---|---|---|
| `Clear` (day) | Sun arc drift, lens flare shimmer, warm sky gradient | `#FDB813` → `#87CEEB` | `#1a1a2e` → `#16213e` |
| `Clear` (night) | Slow star twinkle, moon glow | `#0f3460` → `#533483` | `#0a0a1a` → `#0f3460` |
| `Clouds` (few/scattered) | Slow-drifting cloud layers, soft light rays | `#B0C4DE` → `#E8EAF6` | `#2d2d44` → `#1a1a2e` |
| `Clouds` (broken/overcast) | Dense layered clouds, muted grey gradient | `#8C9BA8` → `#CFD8DC` | `#1c1c1c` → `#2d2d44` |
| `Rain` / `Drizzle` | Vertical raindrop streaks on screen, ripple effect at bottom, dark sky | `#455A64` → `#607D8B` | `#1a1a2e` → `#0d0d1a` |
| `Thunderstorm` | Rain + occasional lightning flash (full-screen white pulse), roiling clouds | `#263238` → `#37474F` | `#0a0a0a` → `#1a1a2e` |
| `Snow` | Slow-drifting snowflakes of varying sizes and opacity, cool blue-white gradient | `#E3F2FD` → `#BBDEFB` | `#1a2744` → `#0d1b2e` |
| `Mist` / `Fog` / `Haze` | Layered translucent fog sheets drifting horizontally | `#B0BEC5` → `#ECEFF1` | `#1c1c1c` → `#2d2d2d` |
| `Default` (unknown) | Gentle ambient gradient shift, slow color breathing | `#90A4AE` → `#CFD8DC` | `#1a1a2e` → `#2d2d44` |

### Technical Approach

**Recommended: CSS animations + lightweight Canvas for particles**

- Background gradient and sky layer: pure CSS, `@keyframes` transitions between condition palettes
- Cloud layers: absolutely positioned `div` elements with CSS `translateX` animation at varying speeds and opacities (parallax effect)
- Rain/snow particles: HTML5 Canvas element overlaid on the background — draw and animate particles in a `requestAnimationFrame` loop
- Lightning: CSS `@keyframes` opacity pulse on a full-screen white overlay, triggered randomly via JS `setTimeout`
- Sun/moon: CSS-animated SVG or `div` with radial gradient glow

**Component: `components/WeatherBackground.tsx` (Client Component)**

```ts
// Props
interface WeatherBackgroundProps {
  conditionId: number     // OWM condition code (e.g. 800 = clear, 500 = rain)
  isDay: boolean          // derived from OWM sunrise/sunset in API response
  theme: 'light' | 'dark'
}
```

**OWM condition code ranges to condition groups:**
- `2xx` → Thunderstorm
- `3xx` → Drizzle
- `5xx` → Rain
- `6xx` → Snow
- `7xx` → Atmosphere (Mist/Fog/Haze)
- `800` → Clear
- `80x` → Clouds

### Performance Rules
- Canvas particle count capped: Rain ≤ 150 drops, Snow ≤ 80 flakes
- Pause `requestAnimationFrame` loop when tab is not visible (`document.visibilityState`)
- `prefers-reduced-motion`: skip all particle and movement animations; render static gradient only
- Use `will-change: transform` on animated layers; remove after animation settles
- No animation libraries > 10kb for this feature — keep it native

### Contrast & Readability
- All UI text and cards must maintain WCAG AA contrast (≥ 4.5:1) over every background state
- Use a semi-transparent overlay (`bg-black/20` or `bg-white/10`) behind text content if needed
- Test readability in all condition states before shipping

---

## UX Principles

- **Speed over richness** — show the most important data (current temp + condition) immediately; secondary data below the fold.
- **Animation serves the data** — the background makes the weather emotionally legible; it never competes with or obscures the information.
- **Light/dark as first-class** — both themes fully designed, including distinct background palettes for each.
- **Minimal chrome** — no unnecessary nav, sidebars, or footers competing for attention. Let the background breathe.
- **Readable at a glance** — temperature is the hero; typography scale reflects that; contrast is maintained over all background states.
- **Honest empty states** — loading and error states are clearly communicated, never silent; background defaults gracefully.
- **Respect user preferences** — `prefers-reduced-motion` must disable all animations without breaking the layout.

---

*This PRD is specific to the weather app. Update open questions as decisions are made during development.*
