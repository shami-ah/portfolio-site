"use client";

import { useRef, useCallback } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

interface TiltResult {
  ref: React.RefObject<HTMLDivElement | null>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  style: {
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
    transformPerspective: number;
    transformStyle: "preserve-3d";
  };
}

/**
 * Reusable 3D tilt hook for cards.
 * @param maxDeg - Maximum rotation in degrees (default 5)
 */
export function useTilt(maxDeg = 5): TiltResult {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 260, damping: 24 });
  const rotateY = useSpring(ry, { stiffness: 260, damping: 24 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): void => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      ry.set(((e.clientX - rect.left) / rect.width - 0.5) * maxDeg);
      rx.set((0.5 - (e.clientY - rect.top) / rect.height) * maxDeg);
    },
    [rx, ry, maxDeg],
  );

  const onMouseLeave = useCallback((): void => {
    rx.set(0);
    ry.set(0);
  }, [rx, ry]);

  return {
    ref,
    rotateX,
    rotateY,
    onMouseMove,
    onMouseLeave,
    style: {
      rotateX,
      rotateY,
      transformPerspective: 900,
      transformStyle: "preserve-3d" as const,
    },
  };
}
