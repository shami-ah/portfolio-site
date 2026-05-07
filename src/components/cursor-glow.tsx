"use client";

import { useEffect } from "react";

/**
 * Attaches mousemove listeners to all .card-glow elements,
 * updating CSS custom properties for the radial highlight position.
 */
export function CursorGlow(): null {
  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      const card = (e.target as HTMLElement).closest(".card-glow") as HTMLElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
    };
    document.addEventListener("mousemove", handler, { passive: true });
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  return null;
}
