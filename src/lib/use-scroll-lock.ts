import { useEffect, useRef } from "react";

/**
 * Lock background scroll when a modal/drawer is open.
 * Uses `overflow: hidden` on both html + body, and captures scroll position
 * in a ref so it survives effect re-runs without jumping.
 */
export function useScrollLock(active: boolean): void {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    // Only capture scroll position if not already locked by another modal
    if (document.documentElement.style.overflow !== "hidden") {
      scrollYRef.current = window.scrollY;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, [active]);
}
