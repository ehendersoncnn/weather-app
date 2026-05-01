"use client";

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="theme-surface-transition rounded-2xl border border-red-200/90 bg-red-50/95 px-4 py-4 text-red-900 shadow-md backdrop-blur-sm dark:border-red-900/60 dark:bg-red-950/90 dark:text-red-100"
    >
      <p className="text-sm font-semibold">Something went wrong</p>
      <p className="mt-1 text-sm opacity-90">{message}</p>
      <p className="mt-3 text-xs text-red-800/90 dark:text-red-200/90">
        Check the spelling or try another city.
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 dark:bg-red-200 dark:text-red-950 dark:hover:bg-white"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
