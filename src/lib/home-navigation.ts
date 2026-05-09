const HOME_SECTION_IDS = [
  "hero",
  "mission",
  "projects",
  "log",
  "experience",
  "writing",
  "contact",
] as const;

export function getCurrentHomeSectionId(fallback = "hero"): string {
  if (typeof window === "undefined") return fallback;

  const probeY = window.innerHeight * 0.35;
  let current = fallback;

  for (const id of HOME_SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= probeY) current = id;
  }

  return current;
}

export function markHomeSectionReturn(sectionId = getCurrentHomeSectionId()): void {
  if (typeof window === "undefined") return;

  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${window.location.search}#${sectionId}`,
  );
}

export function canReturnWithinPortfolio(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (window.history.length <= 1 || !document.referrer) return false;

  try {
    return new URL(document.referrer).origin === window.location.origin;
  } catch {
    return false;
  }
}

export function returnWithinPortfolio(): boolean {
  if (!canReturnWithinPortfolio()) return false;
  window.history.back();
  return true;
}
