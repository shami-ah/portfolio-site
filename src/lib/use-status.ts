"use client";

import { useEffect, useState } from "react";

export interface Status {
  updated: string;
  gogaa: { version: string; tests: number; providers: number; status: string };
  codelens: { version: string; patterns: number; stacks: number; status: string };
  openevent: { clients: number; events: number; hoursSavedPerDay: number; status: string };
  portfolio: { projects: number; yearsBuilding: number };
  currentlyBuilding: { label: string; detail: string };
}

/** Hardcoded fallback. Used if fetch fails — values kept in sync with
 *  status.json. If you update status.json, also update this to match
 *  so SSR'd markup stays consistent. */
const FALLBACK: Status = {
  updated: "2026-04-17",
  gogaa: { version: "0.9.1", tests: 1418, providers: 11, status: "private beta" },
  codelens: { version: "0.3.3", patterns: 305, stacks: 9, status: "private beta" },
  openevent: { clients: 100, events: 150, hoursSavedPerDay: 1.5, status: "live" },
  portfolio: { projects: 250, yearsBuilding: 5 },
  currentlyBuilding: { label: "Gogaa v0.9.2", detail: "parallel panes streaming" },
};

let cache: Status | null = null;
let inflight: Promise<Status> | null = null;

function fetchStatus(): Promise<Status> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = fetch("/status.json", { cache: "no-store" })
    .then((r) => r.json() as Promise<Status>)
    .then((data) => {
      cache = data;
      inflight = null;
      return data;
    })
    .catch(() => {
      inflight = null;
      return FALLBACK;
    });
  return inflight;
}

/** Returns live status from /status.json, with synchronous fallback so
 *  the first render shows real numbers (SSR-safe). */
export function useStatus(): { status: Status; isLive: boolean } {
  const [status, setStatus] = useState<Status>(cache ?? FALLBACK);
  const [isLive, setIsLive] = useState<boolean>(cache !== null);

  useEffect(() => {
    let cancelled = false;
    fetchStatus().then((s) => {
      if (!cancelled) {
        setStatus(s);
        setIsLive(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, isLive };
}
