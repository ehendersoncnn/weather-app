"use client";

import { useCallback, useSyncExternalStore } from "react";
import { WEATHER_APP_THEME_STORAGE_KEY } from "@/components/ThemeClassProvider";
import {
  getDocumentIsDark,
  getDocumentIsDarkServerSnapshot,
  subscribeDocumentDarkClass,
} from "@/lib/html-theme";

export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribeDocumentDarkClass,
    getDocumentIsDark,
    getDocumentIsDarkServerSnapshot,
  );

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(
      WEATHER_APP_THEME_STORAGE_KEY,
      next ? "dark" : "light",
    );
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-300/80 bg-white/80 px-3 text-sm font-medium text-zinc-800 shadow-sm backdrop-blur-sm transition hover:bg-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:focus-visible:ring-blue-400/50"
    >
      <span className="text-base" aria-hidden>
        {dark ? "☀" : "☾"}
      </span>
      {dark ? "Light" : "Dark"}
    </button>
  );
}
