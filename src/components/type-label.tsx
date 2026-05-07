"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * A monospace label that types itself out character-by-character
 * when it enters the viewport.
 */
export function TypeLabel({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}): React.ReactElement {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (charCount >= text.length) return;
    const timer = setTimeout(() => setCharCount((c) => c + 1), 28);
    return () => clearTimeout(timer);
  }, [isInView, charCount, text.length]);

  return (
    <p ref={ref} className={className}>
      {text.slice(0, charCount)}
      {isInView && charCount < text.length && (
        <span className="inline-block w-[6px] h-[1em] bg-accent/70 ml-0.5 translate-y-[1px] animate-pulse" />
      )}
    </p>
  );
}
