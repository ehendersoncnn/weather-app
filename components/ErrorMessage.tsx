export interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200/90 bg-red-50/95 px-4 py-4 text-red-900 shadow-md backdrop-blur-sm dark:border-red-900/60 dark:bg-red-950/85 dark:text-red-100"
    >
      <p className="text-sm font-semibold">Something went wrong</p>
      <p className="mt-1 text-sm opacity-90">{message}</p>
      <p className="mt-3 text-xs text-red-800/90 dark:text-red-200/90">
        Check the spelling or try another city.
      </p>
    </div>
  );
}
