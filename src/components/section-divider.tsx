"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

export function SectionDivider(): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-6">
      <div
        ref={ref}
        className={`section-divider ${isInView ? "visible" : ""}`}
      />
    </div>
  );
}
