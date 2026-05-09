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
    // Signal boot complete for returning visitors
    sessionStorage.setItem("boot-complete", "1");
    window.dispatchEvent(new CustomEvent("boot-complete"));

    if (!window.location.hash) return;

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    scrollToCurrentHash();
    // Retry after layout paints to handle lazy-rendered sections
    const timers = [50, 150, 350].map((delay) =>
      window.setTimeout(scrollToCurrentHash, delay),
    );

    return () => {
      timers.forEach(window.clearTimeout);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  return null;
}
