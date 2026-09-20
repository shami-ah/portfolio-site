"use client";

import { useSyncExternalStore } from "react";

/**
 * Site-wide reading lens.
 * "plain" speaks in outcomes for recruiters and clients (default).
 * "technical" shows the engineering detail: diagrams, stack, dev wording.
 */
export type Lens = "plain" | "technical";

/** Who the visitor told the agent they are. Drives the lens and the primary CTA. */
export type VisitorIntent = "hiring" | "project" | "developer";

const LENS_KEY = "site-lens";
const INTENT_KEY = "visitor-intent";
const CHANGE_EVENT = "lens-change";

function read<T extends string>(key: string, allowed: readonly T[], fallback: T | null): T | null {
  try {
    const v = localStorage.getItem(key);
    return allowed.includes(v as T) ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable — state still updates for this page view via the event
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const LENSES = ["plain", "technical"] as const;
const INTENTS = ["hiring", "project", "developer"] as const;

export function setLens(lens: Lens): void {
  write(LENS_KEY, lens);
}

export function setVisitorIntent(intent: VisitorIntent): void {
  try {
    localStorage.setItem(INTENT_KEY, intent);
  } catch {
    // noop
  }
  setLens(intent === "developer" ? "technical" : "plain");
}

export function useLens(): Lens {
  return useSyncExternalStore(
    subscribe,
    () => read<Lens>(LENS_KEY, LENSES, "plain") ?? "plain",
    () => "plain",
  );
}

export function useVisitorIntent(): VisitorIntent | null {
  return useSyncExternalStore(
    subscribe,
    () => read<VisitorIntent>(INTENT_KEY, INTENTS, null),
    () => null,
  );
}
