"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "./motion";

export type ViewerContext = "hiring" | "dev" | "client" | null;

interface ContextOption {
  key: Exclude<ViewerContext, null>;
  label: string;
  headline: string;
  detail: string;
  cta: { label: string; href: string; external?: boolean };
  route: string; // where to scroll after choosing
}

const options: ContextOption[] = [
  {
    key: "hiring",
    label: "Hiring",
    headline: "You need a senior AI engineer.",
    detail:
      "Start with my experience and the production systems I've shipped. The CV is one click away.",
    cta: { label: "Book a screening call", href: "https://calendly.com/shami8024/30min", external: true },
    route: "#experience",
  },
  {
    key: "dev",
    label: "A developer",
    headline: "You want to see the work.",
    detail:
      "Projects and architecture decisions, with live version data. The chat agent knows the technical details.",
    cta: { label: "Open chat agent", href: "/chat" },
    route: "#projects",
  },
  {
    key: "client",
    label: "A client",
    headline: "You need a system shipped.",
    detail:
      "Start with OpenEvent: what 100+ clients get from AI + human-in-the-loop architecture.",
    cta: { label: "Book a discovery call", href: "https://calendly.com/shami8024/30min", external: true },
    route: "#experience",
  },
];

/** Dispatches a custom event so other components (Nav, sections) can
 *  react to context changes if they want to. */
function setContext(ctx: Exclude<ViewerContext, null>): void {
  localStorage.setItem("viewer-context", ctx);
  window.dispatchEvent(new CustomEvent("viewer-context", { detail: ctx }));
}

export function ContextSwitcher(): React.ReactElement {
  const [active, setActive] = useState<ViewerContext>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("viewer-context") as ViewerContext;
    if (saved === "hiring" || saved === "dev" || saved === "client") {
      setActive(saved);
    }
  }, []);

  const choose = (ctx: Exclude<ViewerContext, null>): void => {
    setActive(ctx);
    setContext(ctx);
    // Scroll to the relevant section after a beat so the animation can play
    const target = options.find((o) => o.key === ctx)?.route;
    if (target) {
      setTimeout(() => {
        document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
  };

  const reset = (): void => {
    setActive(null);
    localStorage.removeItem("viewer-context");
    window.dispatchEvent(new CustomEvent("viewer-context", { detail: null }));
  };

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <FadeUp>
          <p className="text-[10px] md:text-xs font-mono text-accent uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent/70 animate-pulse" />
            before we continue
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 leading-tight">
            Who are you here as?
            <span className="text-muted block text-base md:text-lg font-normal mt-2">
              Pick one and I&apos;ll jump you to what matters most.
            </span>
          </h2>
        </FadeUp>

        <AnimatePresence mode="wait">
          {/* SELECTION STATE */}
          {active === null && (
            <motion.div
              key="choose"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="grid sm:grid-cols-3 gap-3 md:gap-4"
            >
              {options.map((opt, i) => (
                <motion.button
                  key={opt.key}
                  type="button"
                  onClick={() => choose(opt.key)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="group text-left p-5 md:p-6 rounded-xl bg-card border border-card-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted/50">
                      I&apos;m
                    </span>
                    <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                  <p className="text-lg md:text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                    {opt.label}
                  </p>
                  <p className="text-xs md:text-sm text-muted/70 leading-relaxed">
                    {opt.headline}
                  </p>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* RESULT STATE */}
          {active !== null && (
            <motion.div
              key={`result-${active}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 md:p-10 rounded-2xl bg-gradient-to-br from-accent/8 via-card to-card border border-accent/30 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative grid md:grid-cols-[1fr_auto] gap-5 md:gap-8 items-center">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    context · {options.find((o) => o.key === active)?.label.toLowerCase()}
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
                    {options.find((o) => o.key === active)?.headline}
                  </h3>
                  <p className="text-sm md:text-base text-muted leading-relaxed">
                    {options.find((o) => o.key === active)?.detail}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {(() => {
                    const cta = options.find((o) => o.key === active)?.cta;
                    if (!cta) return null;
                    return (
                      <a
                        href={cta.href}
                        target={cta.external ? "_blank" : undefined}
                        rel={cta.external ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 transition-all"
                      >
                        {cta.label}
                        <span>→</span>
                      </a>
                    );
                  })()}
                  <button
                    type="button"
                    onClick={reset}
                    className="text-[10px] font-mono text-muted/50 hover:text-muted transition-colors text-center"
                  >
                    change context
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
