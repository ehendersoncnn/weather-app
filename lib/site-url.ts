/**
 * Canonical site URL for metadata / Open Graph (build time).
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://your-app.vercel.app).
 * Vercel injects `VERCEL_URL` without scheme when available.
 */
export function getSiteUrl(): URL | undefined {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercel = process.env.VERCEL_URL?.trim();
  const raw =
    explicit ??
    (vercel ? (vercel.startsWith("http") ? vercel : `https://${vercel}`) : null);
  if (!raw) return undefined;
  try {
    return new URL(raw);
  } catch {
    return undefined;
  }
}
