"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Mail, FileText, Layers, Check, Play } from "lucide-react";
import { FadeUp } from "./motion";
import { TiltCard } from "./tilt-card";
import { openCvDrawer } from "@/components/cv-drawer";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const BOOK_URL = "https://ahtesham.dev.wadwarehouse.com/book";

const deployments = [
  {
    flag: "\u{1F1E9}\u{1F1EA}",
    who: "More Life Hospitality",
    when: "Sep 2025",
    quote: "The AI layer saves our team 90 minutes a day. No engineer designed the human-in-the-loop gate the way he did.",
  },
  {
    flag: "\u{1F1EB}\u{1F1F7}",
    who: "Mouad, France",
    when: "Nov 2024",
    quote: "Technical and competent. Knows how to deal with specific and in-depth topics. Well-placed to monitor your teams and projects.",
  },
  {
    flag: "\u{1F1FA}\u{1F1F8}",
    who: "Chloe, United States",
    when: "Aug 2024",
    quote: "Very patient and understanding. Very speedy and professional.",
  },
  {
    flag: "\u{1F1EC}\u{1F1E7}",
    who: "Joseph, United Kingdom",
    when: "Jun 2024",
    quote: "Delivered exactly what we needed with precision and expertise.",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Pipeline Step                                                      */
/* ------------------------------------------------------------------ */

function PipeStep({ done, label, active }: { done: boolean; label: string; active?: boolean }): React.ReactElement {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[64px] md:min-w-[72px]">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
          done
            ? "bg-accent-status/12 border border-accent-status/25 text-accent-status"
            : "bg-accent/10 border-[1.5px] border-accent/30 text-accent animate-[ready-pulse_2s_ease-in-out_infinite]"
        }`}
      >
        {done ? <Check size={11} strokeWidth={2.5} /> : <Play size={9} strokeWidth={2.5} />}
      </div>
      <span
        className={`font-mono text-caption ${
          active ? "text-accent opacity-70" : "text-muted opacity-35"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function PipeLine({ done }: { done: boolean }): React.ReactElement {
  return (
    <div
      className="w-6 md:w-8 h-px mb-4"
      style={
        done
          ? { background: "rgba(74,222,128,0.2)" }
          : {
              background:
                "repeating-linear-gradient(90deg, rgba(160,120,104,0.2) 0px, rgba(160,120,104,0.2) 4px, transparent 4px, transparent 8px)",
            }
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Previous Deployments (rotating)                                    */
/* ------------------------------------------------------------------ */

function DeployHistory(): React.ReactElement {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % deployments.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const d = deployments[idx];

  return (
    <div className="w-full max-w-[58rem]">
      <p className="font-mono text-caption text-muted/20 uppercase tracking-widest text-center mb-3.5">
        previous deployments
      </p>

      <div className="relative h-[72px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-x-0 top-0 flex items-center gap-3.5 px-5 py-3.5 rounded-[10px] border border-card-border/50 bg-card/40 h-[72px]"
          >
            {/* Green check icon */}
            <div className="w-6 h-6 rounded-full bg-accent-status/10 border border-accent-status/20 flex items-center justify-center shrink-0">
              <Check size={11} strokeWidth={2.5} className="text-accent-status" />
            </div>

            <div className="flex items-center gap-2 font-mono text-small shrink-0">
              <span className="text-[13px]">{d.flag}</span>
              <span className="text-foreground/60 font-medium">{d.who}</span>
              <span className="text-muted/20">{d.when}</span>
            </div>

            <span className="text-muted/15 shrink-0">|</span>

            <p className="text-[12.5px] leading-[1.6] text-foreground/35 italic min-w-0 line-clamp-2">
              &ldquo;{d.quote}&rdquo;
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3.5">
        {deployments.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === idx ? "bg-accent/60 w-[18px]" : "bg-muted/15 w-1.5 hover:bg-muted/30"
            }`}
            aria-label={`Deployment ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

export function Footer(): React.ReactElement {
  const years = new Date().getFullYear() - 2019;

  return (
    <footer id="contact">
      {/* Deploy section */}
      <div className="relative flex flex-col items-center px-5 md:px-10 pt-20 md:pt-32 pb-16 overflow-hidden">
        {/* Subtle gradient orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(circle,rgba(160,120,104,0.035)_0%,transparent_65%)] pointer-events-none" />

        {/* Heading */}
        <FadeUp>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-center mb-3 relative z-[1]">
            Deploy <span className="text-gradient">me.</span>
          </h2>
        </FadeUp>
        <FadeUp delay={0.06}>
          <p className="font-mono text-[13px] text-muted/35 mb-8 text-center relative z-[1]">
            one engineer, full ownership, zero handoffs
          </p>
        </FadeUp>

        {/* Deploy panel */}
        <FadeUp delay={0.12} className="w-full max-w-[58rem]">
          <TiltCard maxDeg={3} className="w-full rounded-2xl border border-card-border bg-card overflow-hidden relative z-[1] shadow-[0_20px_60px_rgba(0,0,0,0.3),0_0_80px_rgba(160,120,104,0.03)] mb-10">

            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-card-border bg-card/50">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
                  <Layers size={14} strokeWidth={2} className="text-white" />
                </div>
                <span className="font-mono text-[13px] font-semibold text-foreground/80">
                  your-company <span className="text-muted/30 mx-0.5">/</span> ahtesham
                </span>
              </div>
              <span className="font-mono text-caption px-2 py-0.5 rounded bg-accent-status/8 border border-accent-status/15 text-accent-status/70">
                production
              </span>
            </div>

            {/* Pipeline */}
            <div className="flex items-center justify-center py-3.5 px-6 border-b border-card-border bg-background/30">
              <PipeStep done label="reviewed" />
              <PipeLine done />
              <PipeStep done label="vetted" />
              <PipeLine done />
              <PipeStep done label="matched" />
              <PipeLine done={false} />
              <PipeStep done={false} label="deploy" active />
            </div>

            {/* Config */}
            <div className="px-5 py-3 border-b border-card-border">
              {[
                { key: "engineer", val: "Ahtesham Ahmad" },
                { key: "status", val: "ready", green: true },
                { key: "region", val: "remote / Gulf / EU", sep: "/" },
                { key: "mode", val: "full-time | contract | 90-day", sep: "|" },
              ].map((row, i) => (
                <div
                  key={row.key}
                  className={`flex items-center justify-between py-2 font-mono text-small ${
                    i > 0 ? "border-t border-card-border/40" : ""
                  }`}
                >
                  <span className="text-muted/35 text-[11px]">{row.key}</span>
                  {row.green ? (
                    <span className="text-accent-status flex items-center gap-1.5 text-foreground/70">
                      <span className="w-[5px] h-[5px] rounded-full bg-accent-status animate-pulse" />
                      ready
                    </span>
                  ) : (
                    <span className="text-foreground/70 text-right">{row.val}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Deploy button */}
            <div className="px-5 pt-3 pb-2.5">
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3 rounded-[10px] btn-gradient font-semibold text-sm hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Calendar size={16} strokeWidth={1.5} />
                Deploy to your team
              </a>
            </div>

            {/* Reach channels */}
            <div className="flex justify-center gap-1.5 flex-wrap px-5 pb-4">
              <a
                href="mailto:shami8024@gmail.com"
                className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-[7px] border border-card-border/80 bg-background/50 text-foreground/45 font-mono text-[11px] hover:opacity-100 hover:border-accent hover:bg-accent/[0.06] hover:text-accent transition-all duration-200"
              >
                <Mail size={13} strokeWidth={1.5} className="opacity-50" />
                email
              </a>
              <a
                href="https://github.com/shami-ah"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-[7px] border border-card-border/80 bg-background/50 text-foreground/45 font-mono text-[11px] hover:opacity-100 hover:border-accent hover:bg-accent/[0.06] hover:text-accent transition-all duration-200"
              >
                <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor" className="opacity-50"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                github
              </a>
              <a
                href="https://www.linkedin.com/in/muhammad-ahtesham-ahmad-a153801b5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-[7px] border border-card-border/80 bg-background/50 text-foreground/45 font-mono text-[11px] hover:opacity-100 hover:border-accent hover:bg-accent/[0.06] hover:text-accent transition-all duration-200"
              >
                <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor" className="opacity-50"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                linkedin
              </a>
              <button
                type="button"
                data-cv-open="true"
                onClick={openCvDrawer}
                className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-[7px] border border-card-border/80 bg-background/50 text-foreground/45 font-mono text-[11px] hover:opacity-100 hover:border-accent hover:bg-accent/[0.06] hover:text-accent transition-all duration-200 cursor-pointer"
              >
                <FileText size={13} strokeWidth={1.5} className="opacity-50" />
                cv
              </button>
            </div>

          </TiltCard>
        </FadeUp>

        {/* Previous deployments */}
        <FadeUp delay={0.18} className="w-full max-w-[58rem]">
          <DeployHistory />
        </FadeUp>

      </div>

      {/* Copyright — left-aligned, between sidebar nav and content */}
      <div className="pl-16 md:pl-20 pb-8">
        <p className="font-mono text-caption text-muted/30">
          &copy; {new Date().getFullYear()} Ahtesham Ahmad &middot; {years}y uptime
        </p>
      </div>
    </footer>
  );
}
