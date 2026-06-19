"use client";

import { useCallback } from "react";

type SoundName = "modal-open" | "scan-complete" | "agent-respond" | "boot-pulse";

interface SoundFX {
  play: (name: SoundName) => void;
}

/** Lazily-created AudioContext (browser policy requires user gesture). */
let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedCtx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    sharedCtx = new Ctor();
  }
  return sharedCtx;
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  type: OscillatorType,
  gain: number,
  attackMs: number,
  decayMs: number,
): void {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g);
  g.connect(ctx.destination);

  osc.frequency.value = frequency;
  osc.type = type;

  const now = ctx.currentTime;
  const attackSec = attackMs / 1000;
  const decaySec = decayMs / 1000;

  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(gain, now + attackSec);
  g.gain.exponentialRampToValueAtTime(0.0001, now + attackSec + decaySec);

  osc.start(now);
  osc.stop(now + attackSec + decaySec + 0.01);
}

const SOUNDS: Record<SoundName, (ctx: AudioContext) => void> = {
  "modal-open": (ctx) => {
    // 440Hz triangle, smooth attack (80ms) -> fast decay (200ms)
    playTone(ctx, 440, "triangle", 0.05, 80, 200);
  },
  "scan-complete": (ctx) => {
    // 880Hz sine, quick bright chime (30ms attack, 180ms decay)
    playTone(ctx, 880, "sine", 0.04, 30, 180);
  },
  "agent-respond": (ctx) => {
    // 220Hz sine, warm resonant hum (60ms attack, 300ms decay)
    playTone(ctx, 220, "sine", 0.06, 60, 300);
  },
  "boot-pulse": (ctx) => {
    // 330Hz triangle, medium pulse (50ms attack, 250ms decay)
    playTone(ctx, 330, "triangle", 0.05, 50, 250);
  },
};

/**
 * Subtle sound effects via Web Audio API oscillators.
 * Always on — plays after first user interaction (browser autoplay policy).
 */
export function useSoundFX(): SoundFX {
  const play = useCallback(
    (name: SoundName): void => {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === "suspended") {
        void ctx.resume();
      }
      const fn = SOUNDS[name];
      fn(ctx);
    },
    [],
  );

  return { play };
}
