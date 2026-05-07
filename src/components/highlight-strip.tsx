"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function CountTo({ to, suffix = "" }: { to: number; suffix?: string }): React.ReactElement {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const start = Date.now();
    const tick = (): void => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, to]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const highlights = [
  { value: 100, suffix: "+", label: "clients live" },
  { value: 250, suffix: "+", label: "projects shipped" },
  { value: 1418, suffix: "", label: "tests passing" },
  { value: 6, suffix: "", label: "engineers led" },
];

export function HighlightStrip(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8 }}
      className="relative py-10 md:py-14 overflow-hidden"
    >
      {/* Animated gradient line top */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      {/* Ambient glow behind the numbers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[200px] bg-accent/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-5 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {highlights.map((h, i) => (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold font-mono text-accent mb-1">
                <CountTo to={h.value} suffix={h.suffix} />
              </p>
              <p className="text-[11px] md:text-xs text-muted/50 font-mono uppercase tracking-wider">
                {h.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animated gradient line bottom */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-secondary/30 to-transparent"
      />
    </motion.div>
  );
}
