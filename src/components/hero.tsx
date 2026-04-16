"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Magnetic } from "./magnetic";
import { useStatus } from "@/lib/use-status";
import { HeroFlow } from "./hero-flow";

const taglines = [
  {
    prefix: "I build AI systems that",
    accent: "run businesses",
    suffix: "on their own.",
  },
  {
    prefix: "I design architectures where",
    accent: "humans stay in control",
    suffix: "while AI does the work.",
  },
  {
    prefix: "I ship production tools that",
    accent: "catch bugs",
    suffix: "commercial options miss.",
  },
];

/** Word-wave fade reveal for a single string. */
function WordReveal({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}): React.ReactElement {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.55,
            delay: delay + i * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {word}
          {i < text.split(" ").length - 1 && "\u00a0"}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero(): React.ReactElement {
  const { status } = useStatus();
  const [ready, setReady] = useState(false);
  const [tagIdx, setTagIdx] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const orbY1 = useTransform(scrollY, [0, 800], [0, 120]);
  const orbY2 = useTransform(scrollY, [0, 800], [0, -80]);
  const orbOpacity = useTransform(scrollY, [0, 600], [1, 0.3]);

  // Wait for terminal boot to finish before starting hero animations
  useEffect(() => {
    if (typeof window === "undefined") return;
    const done = sessionStorage.getItem("boot-complete");
    if (done) {
      setReady(true);
      return;
    }
    const onDone = (): void => setReady(true);
    window.addEventListener("boot-complete", onDone);
    const fallback = setTimeout(() => setReady(true), 4000);
    return () => {
      window.removeEventListener("boot-complete", onDone);
      clearTimeout(fallback);
    };
  }, []);

  // Rotate taglines every 5.5s after initial reveal
  useEffect(() => {
    if (!ready) return;
    const initial = setTimeout(() => {
      const interval = setInterval(() => {
        setTagIdx((i) => (i + 1) % taglines.length);
      }, 5500);
      return () => clearInterval(interval);
    }, 6000);
    return () => clearTimeout(initial);
  }, [ready]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 md:pt-20 md:pb-24"
    >
      {/* Parallax gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: orbY1, opacity: orbOpacity }}
          className="absolute -top-40 -right-40 w-72 md:w-[32rem] h-72 md:h-[32rem] bg-accent/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: orbY2, opacity: orbOpacity }}
          className="absolute -bottom-40 -left-40 w-72 md:w-[32rem] h-72 md:h-[32rem] bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-4xl mx-auto px-5 md:px-6 text-center">
        {/* Availability pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] md:text-xs font-mono mb-6 md:mb-8"
        >
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Open to opportunities
        </motion.div>

        {/* Rotating heading */}
        <div className="relative mb-5 md:mb-6 min-h-[120px] sm:min-h-[140px] md:min-h-[180px] lg:min-h-[220px] flex items-start justify-center">
          <AnimatePresence mode="wait">
            {ready && (
              <motion.h1
                key={tagIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] absolute inset-x-0"
              >
                <WordReveal text={taglines[tagIdx].prefix} delay={0.55} />
                <br className="hidden sm:block" />
                <span className="text-accent">
                  <WordReveal
                    text={` ${taglines[tagIdx].accent} `}
                    delay={0.9}
                  />
                </span>
                <WordReveal text={taglines[tagIdx].suffix} delay={1.1} />
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm md:text-lg text-muted max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2"
        >
          5+ years shipping production AI. Multi-agent architectures with
          human approval gates, full-stack products that hold up under real
          load, and the open-source tooling to build them right.
        </motion.p>

        {/* Single CTA: just go see the work */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 2.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <Magnetic strength={0.25}>
            <a
              href="#projects"
              className="block px-7 md:px-9 py-3 md:py-3.5 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 text-sm md:text-base"
            >
              See the work ↓
            </a>
          </Magnetic>
        </motion.div>

        {/* Currently building ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 2.7, ease: "easeOut" }}
          className="flex items-center justify-center gap-2 mt-4 md:mt-5 px-2"
        >
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shrink-0" />
          <p className="text-[10px] md:text-xs font-mono text-muted/60 truncate">
            Currently building:{" "}
            <span className="text-accent/80">
              {status.currentlyBuilding.label}: {status.currentlyBuilding.detail}
            </span>
          </p>
        </motion.div>

        {/* Architecture flow — live animated pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 3.0, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 md:mt-16 p-4 md:p-5 rounded-xl bg-card/50 border border-card-border backdrop-blur-sm"
        >
          <p className="text-[10px] md:text-xs font-mono text-muted mb-4 md:mb-5 uppercase tracking-wider">
            How I architect every system · live
          </p>
          <HeroFlow />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 4.2 }}
        className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-muted/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-muted/50 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
