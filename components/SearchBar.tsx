"use client";

import { useCallback } from "react";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  isLoading,
}: SearchBarProps) {
  const submit = useCallback(() => {
    const q = value.trim();
    if (!q || isLoading) return;
    onSearch(q);
  }, [value, isLoading, onSearch]);

  return (
    <form
      className="flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:items-center"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      role="search"
    >
      <label htmlFor="city-search" className="sr-only">
        Search by city
      </label>
      <input
        id="city-search"
        type="search"
        autoComplete="off"
        placeholder="Search city…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        className="min-h-11 flex-1 rounded-xl border border-zinc-300/90 bg-white/90 px-4 py-2.5 text-zinc-900 shadow-sm backdrop-blur-sm placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900/85 dark:text-zinc-50 dark:placeholder:text-zinc-500"
      />
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isLoading ? "Loading…" : "Search"}
      </button>
    </form>
  );
}
