"use client";

import { useLayoutEffect } from "react";

function scrollToCurrentHash(): boolean {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (!hash) return false;

  const target = document.getElementById(hash);
  if (!target) return false;

  const html = document.documentElement;
  const previousScrollBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  target.scrollIntoView({ block: "start" });
  requestAnimationFrame(() => {
    html.style.scrollBehavior = previousScrollBehavior;
  });

  return true;
}

export function HomeHashScroll(): null {
  useLayoutEffect(() => {
    const reloadKey = `home-bfcache-reload:${window.location.pathname}${window.location.search}${window.location.hash}`;
    const reloadIfRestoredFromCache = (event: PageTransitionEvent): void => {
      if (!event.persisted) {
        sessionStorage.removeItem(reloadKey);
        return;
      }

      if (sessionStorage.getItem(reloadKey) === "1") return;
      sessionStorage.setItem(reloadKey, "1");
      window.location.reload();
    };

    window.addEventListener("pageshow", reloadIfRestoredFromCache);

    sessionStorage.setItem("boot-complete", "1");
    window.dispatchEvent(new CustomEvent("boot-complete"));

    if (!window.location.hash) {
      return () => window.removeEventListener("pageshow", reloadIfRestoredFromCache);
    }

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    scrollToCurrentHash();
    const timers = [50, 150, 350, 700].map((delay) =>
      window.setTimeout(scrollToCurrentHash, delay),
    );

    const onPageShow = (): void => {
      scrollToCurrentHash();
      window.setTimeout(scrollToCurrentHash, 50);
    };

    window.addEventListener("pageshow", onPageShow);

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("pageshow", reloadIfRestoredFromCache);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  return null;
}
