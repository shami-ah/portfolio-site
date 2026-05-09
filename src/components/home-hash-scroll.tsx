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
    if (!window.location.hash) return;

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
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  return null;
}
