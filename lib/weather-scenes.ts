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
  clearDay: { light: ["#FDB813", "#87CEEB"], dark: ["#0c1222", "#1e3a5f"] },
  clearNight: { light: ["#0f3460", "#533483"], dark: ["#06060f", "#0f2744"] },
  cloudsFew: { light: ["#B0C4DE", "#E8EAF6"], dark: ["#252538", "#141420"] },
  cloudsHeavy: { light: ["#8C9BA8", "#CFD8DC"], dark: ["#121216", "#252830"] },
  rain: { light: ["#455A64", "#78909C"], dark: ["#0d1118", "#1a2332"] },
  drizzle: { light: ["#455A64", "#78909C"], dark: ["#0d1118", "#1a2332"] },
  thunder: { light: ["#263238", "#455A64"], dark: ["#050508", "#151d28"] },
  snow: { light: ["#E3F2FD", "#BBDEFB"], dark: ["#0f1728", "#1a2d44"] },
  fog: { light: ["#B0BEC5", "#ECEFF1"], dark: ["#18181c", "#2a2a2e"] },
  default: { light: ["#90A4AE", "#CFD8DC"], dark: ["#12141c", "#242836"] },
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
