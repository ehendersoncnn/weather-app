"use client";

import { useEffect } from "react";

export const WEATHER_APP_THEME_STORAGE_KEY = "weather-app-theme";

export function ThemeClassProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;

    const applyDark = (dark: boolean) => {
      root.classList.toggle("dark", dark);
    };

    const stored = localStorage.getItem(WEATHER_APP_THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      applyDark(stored === "dark");
    } else {
      applyDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (localStorage.getItem(WEATHER_APP_THEME_STORAGE_KEY)) return;
      applyDark(mq.matches);
    };
    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, []);

  return <>{children}</>;
}
