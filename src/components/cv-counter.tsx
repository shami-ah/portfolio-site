"use client";

import { useEffect, useState } from "react";

const API_GET = "https://abacus.jasoncameron.dev/get/shami-portfolio/cv-view-2026";

/** Displays the current CV view count (read-only). The actual increment
 *  happens in /cv page on mount. */
export function CvCounter(): React.ReactElement | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(API_GET, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { value?: number }) => {
        if (!cancelled && typeof data.value === "number") {
          setCount(data.value);
        }
      })
      .catch(() => {
        // Silent fail
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null || count < 5) return null;

  return (
    <p className="text-[10px] md:text-xs font-mono text-muted/50 mt-2">
      CV viewed <span className="text-accent/70">{count.toLocaleString()}</span>{" "}
      times
    </p>
  );
}

/** Fires a hit (+1) when mounted. Should only be used on the CV page. */
export function useCvHit(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const already = sessionStorage.getItem("cv-hit-fired");
    if (already) return;
    sessionStorage.setItem("cv-hit-fired", "1");
    fetch("https://abacus.jasoncameron.dev/hit/shami-portfolio/cv-view-2026", {
      cache: "no-store",
    }).catch(() => {
      // silent fail
    });
  }, []);
}
