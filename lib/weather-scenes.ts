export type WeatherScene =
  | "clearDay"
  | "clearNight"
  | "cloudsFew"
  | "cloudsHeavy"
  | "rain"
  | "drizzle"
  | "thunder"
  | "snow"
  | "fog"
  | "default";

export function resolveWeatherScene(
  conditionId: number,
  isDay: boolean,
): WeatherScene {
  if (conditionId >= 200 && conditionId < 300) return "thunder";
  if (conditionId >= 300 && conditionId < 400) return "drizzle";
  if (conditionId >= 500 && conditionId < 600) return "rain";
  if (conditionId >= 600 && conditionId < 700) return "snow";
  if (conditionId >= 700 && conditionId < 800) return "fog";
  if (conditionId === 800) return isDay ? "clearDay" : "clearNight";
  if (conditionId === 801 || conditionId === 802) return "cloudsFew";
  if (conditionId === 803 || conditionId === 804) return "cloudsHeavy";
  return "default";
}

/** Bright sky scenes in app "light" mode — use dark text on a light frosted scrim. */
const LIGHT_APP_BRIGHT_SCENES = new Set<WeatherScene>([
  "clearDay",
  "cloudsFew",
  "snow",
]);

/**
 * Whether chrome floating over the animated sky should use light foreground colors
 * (and a darker scrim). Dark app theme is always treated as needing light text.
 */
export function atmospherePrefersLightText(
  appTheme: "light" | "dark",
  scene: WeatherScene,
): boolean {
  if (appTheme === "dark") return true;
  return !LIGHT_APP_BRIGHT_SCENES.has(scene);
}

/** Muted blue-grey drift while data is fetching (Phase 3). */
export const LOADING_SKY_PALETTE: Record<
  "light" | "dark",
  [string, string]
> = {
  light: ["#94a3b8", "#cbd5e1"],
  dark: ["#1e293b", "#475569"],
};

/** PRD Animated Background Spec — light / dark gradient stops per scene. */
export const SCENE_PALETTES: Record<
  WeatherScene,
  { light: [string, string]; dark: [string, string] }
> = {
  clearDay: { light: ["#FDB813", "#87CEEB"], dark: ["#1a1a2e", "#16213e"] },
  clearNight: { light: ["#0f3460", "#533483"], dark: ["#0a0a1a", "#0f3460"] },
  cloudsFew: { light: ["#B0C4DE", "#E8EAF6"], dark: ["#2d2d44", "#1a1a2e"] },
  cloudsHeavy: { light: ["#8C9BA8", "#CFD8DC"], dark: ["#1c1c1c", "#2d2d44"] },
  rain: { light: ["#455A64", "#607D8B"], dark: ["#1a1a2e", "#0d0d1a"] },
  drizzle: { light: ["#455A64", "#607D8B"], dark: ["#1a1a2e", "#0d0d1a"] },
  thunder: { light: ["#263238", "#37474F"], dark: ["#0a0a0a", "#1a1a2e"] },
  snow: { light: ["#E3F2FD", "#BBDEFB"], dark: ["#1a2744", "#0d1b2e"] },
  fog: { light: ["#B0BEC5", "#ECEFF1"], dark: ["#1c1c1c", "#2d2d2d"] },
  default: { light: ["#90A4AE", "#CFD8DC"], dark: ["#1a1a2e", "#2d2d44"] },
};

export function sceneUsesRainCanvas(scene: WeatherScene): boolean {
  return scene === "rain" || scene === "drizzle" || scene === "thunder";
}

export function sceneUsesSnowCanvas(scene: WeatherScene): boolean {
  return scene === "snow";
}

export function sceneShowsLightning(scene: WeatherScene): boolean {
  return scene === "thunder";
}
