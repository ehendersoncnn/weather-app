/** Subscribe to `<html class="dark">` changes (Tailwind dark mode). */

export function subscribeDocumentDarkClass(onChange: () => void) {
  const el = document.documentElement;
  const mo = new MutationObserver(onChange);
  mo.observe(el, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}

export function getDocumentIsDark() {
  return document.documentElement.classList.contains("dark");
}

export function getDocumentIsDarkServerSnapshot() {
  return false;
}
