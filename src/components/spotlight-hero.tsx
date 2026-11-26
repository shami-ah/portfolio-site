"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, FileText } from "lucide-react";
import { openCvDrawer } from "@/components/cv-drawer";
import { useStatus } from "@/lib/use-status";
import { useLens } from "@/lib/use-lens";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ------------------------------------------------------------------ */
/*  Spotlight hero                                                     */
/*  1. Boot particles land → portrait + headline materialise           */
/*  2. Scroll → the full-height portrait shrinks into a profile card   */
/*     and the "Hello, I'm Ahtesham" details slide in beside it        */
/*  Keeps the hero-reveal / hero-fully-written contract of the boot.   */
/* ------------------------------------------------------------------ */

const WORDS: [string, string][] = [
  ["AI", "products"],
  ["Agent", "systems"],
  ["Code", "review"],
  ["Dev", "tools"],
];

/** Right panel: the positioning line. Numbers live in the profile card, not here. */
const DESC = {
  plain:
    "I turn slow, manual work into AI software that people trust with real customers and real money. I take it from the first idea to launch, then I keep it running.",
  technical:
    "LLM pipelines with human approval gates, agent tooling, and the review layer that keeps generated code honest. I own the whole path, from schema to production.",
} as const;

/** Profile card copy. Every figure comes from status.json via useStatus. */
const ABOUT = {
  plain: (years: number): string =>
    `Full-stack AI engineer with ${years}+ years of taking products from a rough idea to software customers rely on. I have built for teams in Germany, France, the UK and the US, and I stay after launch.`,
  technical: (years: number): string =>
    `Full-stack AI engineer, ${years}+ years. TypeScript, React, Supabase and Postgres on the product side; LLM pipelines, agents and developer tooling on the AI side. Shipped for teams in Germany, France, the UK and the US.`,
} as const;

/** How long each headline word stays before the next one rotates in. */
const WORD_MS = 2800;
/** Portrait photo shown in the spotlight column. */
const PHOTO_SRC = "/ahtesham.jpg";
/** Share of the photo column on each side that is faded into the background, so text may sit over it. */
const PHOTO_EDGE_FADE = 0.22;

const ALL_TARGETS = ["title", "desc", "agent", "scroll"];
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CTA_PRIMARY =
  "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg btn-gradient font-semibold text-sm hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer";
const CTA_SECONDARY =
  "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-card-border bg-card/40 text-sm text-foreground/80 hover:border-accent/40 hover:text-foreground transition-all duration-200 cursor-pointer";

const clamp = (v: number, a = 0, b = 1): number => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const easeInOut = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ------------------------------------------------------------------ */
/*  Geometry: one source of truth for render (layout mode) and rAF     */
/* ------------------------------------------------------------------ */

/** Fallback width of the widest headline word, in em. Replaced by a real DOM measurement once fonts load. */
const WIDEST_WORD_EM_FALLBACK = 6.2;
const SIDE_PANEL_MIN_W = 250;

interface HeroGeometry {
  mob: boolean;
  /** Portrait column at the start of the scroll */
  sw: number;
  sx: number;
  leftEdge: number;
  /** Headline font size that fits beside the portrait without covering it */
  font: number;
  /** true = text left / panel right; false = text overlaid at the bottom (phones, small laptops) */
  wide: boolean;
}

function heroGeometry(W: number, H: number, widestEm = WIDEST_WORD_EM_FALLBACK): HeroGeometry {
  const mob = W < 768;
  const sw = mob ? W : Math.min(W * 0.46, H * 0.72);
  const sx = (W - sw) / 2;
  // The photo's outer edges fade into the background, so text may reach into that faded strip
  const bodyLeft = sx;
  const leftEdge = W >= 1024 ? 140 : Math.max(24, W * 0.05);
  // Text must end before the portrait column starts: no overlap at all
  const room = bodyLeft - leftEdge - 32;
  const font = Math.min(112, room / widestEm);
  const wide = !mob && font >= 36 && bodyLeft - W * 0.05 >= SIDE_PANEL_MIN_W + 16;
  return { mob, sw, sx, leftEdge, font: wide ? font : Math.min(64, Math.max(40, W / 9)), wide };
}

/* ------------------------------------------------------------------ */
/*  Boot hand-off: which hero parts the particles have "written"       */
/* ------------------------------------------------------------------ */

function useMaterialized(): Set<string> {
  const [materialized, setMaterialized] = useState<Set<string>>(new Set());

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        if (sessionStorage.getItem("boot-complete") === "1") setMaterialized(new Set(ALL_TARGETS));
      } catch {
        // storage unavailable: wait for events
      }
    });

    const onReveal = (e: Event): void => {
      const target = (e as CustomEvent<{ target: string }>).detail?.target;
      if (!target) return;
      setMaterialized((prev) => new Set([...prev, target]));
      if (target === "desc") {
        setTimeout(() => {
          setMaterialized((prev) => {
            const next = new Set([...prev, "agent", "scroll"]);
            if (next.size >= ALL_TARGETS.length) window.dispatchEvent(new CustomEvent("hero-fully-written"));
            return next;
          });
        }, 500);
      }
    };
    /* Fallback if particles never arrive */
    const onBootComplete = (): void => {
      setTimeout(() => setMaterialized((prev) => (prev.size === 0 ? new Set(ALL_TARGETS) : prev)), 6000);
    };
    const onReplay = (): void => setMaterialized(new Set());

    window.addEventListener("hero-reveal", onReveal);
    window.addEventListener("boot-complete", onBootComplete);
    window.addEventListener("replay-intro", onReplay);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hero-reveal", onReveal);
      window.removeEventListener("boot-complete", onBootComplete);
      window.removeEventListener("replay-intro", onReplay);
    };
  }, []);

  return materialized;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SpotlightHero(): React.ReactElement {
  const { status } = useStatus();
  const lens = useLens();
  const reduced = useReducedMotion();
  const materialized = useMaterialized();
  const m = (name: string): boolean => materialized.has(name);

  const heroRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  /* Real rendered width of the widest headline word (em), measured once the display font is loaded */
  const widestEmRef = useRef(WIDEST_WORD_EM_FALLBACK);

  /* Layout mode follows the viewport (rAF handles the per-frame geometry) */
  const [geo, setGeo] = useState<Pick<HeroGeometry, "wide" | "font">>({ wide: true, font: 96 });
  useEffect(() => {
    const measure = (): void => {
      const probe = document.createElement("span");
      probe.className = "font-display-wide";
      Object.assign(probe.style, { position: "absolute", visibility: "hidden", whiteSpace: "nowrap", fontSize: "100px", left: "-9999px", top: "0" });
      document.body.appendChild(probe);
      let widest = 0;
      for (const w of WORDS.flat()) {
        probe.textContent = w;
        widest = Math.max(widest, probe.getBoundingClientRect().width);
      }
      probe.remove();
      if (widest > 0) widestEmRef.current = widest / 100 + 0.08; // small safety margin
      update();
    };
    const update = (): void => {
      const g = heroGeometry(window.innerWidth, window.innerHeight, widestEmRef.current);
      setGeo((prev) => (prev.wide === g.wide && Math.abs(prev.font - g.font) < 1 ? prev : { wide: g.wide, font: g.font }));
    };
    update();
    void document.fonts.ready.then(measure);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* Rotating headline word */
  const [word, setWord] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setWord((w) => (w + 1) % WORDS.length), WORD_MS);
    return () => clearInterval(id);
  }, [reduced]);

  /* Scroll-driven layout: portrait column → profile card */
  useEffect(() => {
    let raf = 0;
    const frame = (): void => {
      raf = requestAnimationFrame(frame);
      const hero = heroRef.current;
      const photo = photoRef.current;
      if (!hero || !photo) return;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const { mob, sw, sx } = heroGeometry(W, H, widestEmRef.current);
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < -H || rect.top > H) return;
      const prog = clamp(-rect.top / (rect.height - H));
      const k = easeInOut(clamp((prog - 0.12) / 0.55));

      const sh = H;
      // End: profile card
      // Mobile card stays small so card + details fit inside one sticky screen
      const ew = mob ? Math.min(W * 0.56, 230, H * 0.3) : Math.min(340, W * 0.25);
      const eh = ew * 1.25;
      // Card + details are centred as one group
      const leftGutter = W >= 1024 ? 140 : 24;
      const infoW = Math.min(520, W - ew - 56 - leftGutter * 2);
      const ex = mob ? (W - ew) / 2 : Math.max(leftGutter, (W - (ew + 56 + infoW)) / 2);
      const ey = mob ? 72 : (H - eh) / 2;

      const x = lerp(sx, ex, k);
      const y = lerp(0, ey, k);
      const w = lerp(sw, ew, k);
      const h = lerp(sh, eh, k);
      photo.style.left = `${x}px`;
      photo.style.top = `${y}px`;
      photo.style.width = `${w}px`;
      photo.style.height = `${h}px`;
      photo.style.borderRadius = `${lerp(0, 24, k)}px`;
      photo.style.boxShadow =
        k > 0.05 ? `0 40px 80px -30px rgba(0,0,0,${0.85 * k}), 0 0 0 1px rgba(255,255,255,${0.08 * k})` : "none";

      // Vignette melts the photo into the page in the hero and relaxes into a plain card at the end
      if (maskRef.current) {
        maskRef.current.style.background = `radial-gradient(${lerp(46, 130, k)}% ${lerp(60, 150, k)}% at 50% 38%, transparent 55%, var(--background) 100%), linear-gradient(180deg, transparent 55%, color-mix(in srgb, var(--background) ${Math.round(lerp(95, 0, k))}%, transparent) 100%)`;
      }
      if (glowRef.current) glowRef.current.style.opacity = String(1 - k);

      const fade = 1 - clamp(prog / 0.18);
      for (const el of [introRef.current, sideRef.current, bottomRef.current]) {
        if (!el) continue;
        el.style.opacity = String(fade);
        el.style.pointerEvents = fade < 0.1 ? "none" : "auto";
        // `transform`, not `translate`: Tailwind's -translate-y-* utilities own the `translate` property
        el.style.transform = `translateY(${(1 - fade) * -36}px)`;
      }

      const reveal = clamp((prog - 0.6) / 0.25);
      const info = infoRef.current;
      if (info) {
        info.style.opacity = String(reveal);
        info.style.pointerEvents = reveal > 0.5 ? "auto" : "none";
        if (mob) {
          info.style.left = "24px";
          info.style.right = "24px";
          info.style.top = `${ey + eh + 28}px`;
          info.style.transform = `translateY(${(1 - reveal) * 20}px)`;
        } else {
          info.style.left = `${ex + ew + 56}px`;
          info.style.right = "auto";
          info.style.maxWidth = `${infoW}px`;
          info.style.top = `${H / 2}px`;
          info.style.transform = `translate(${(1 - reveal) * 30}px, -50%)`;
        }
      }
      const badge = badgeRef.current;
      if (badge) {
        badge.style.opacity = String(reveal);
        badge.style.left = `${ex + 14}px`;
        badge.style.top = `${ey + eh - 44}px`;
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const shown = m("title");

  return (
    <section id="hero" ref={heroRef} className="relative h-[250vh]" aria-label="Introduction">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Spotlight glow */}
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_70%_at_50%_42%,rgba(160,120,104,0.22),transparent_70%)]"
        />

        {/* Portrait (position/size driven by scroll) */}
        <motion.div
          ref={photoRef}
          data-hero="title"
          initial={false}
          animate={{
            opacity: shown ? 1 : 0,
            scale: shown ? 1 : 1.04,
            filter: shown ? "blur(0px)" : "blur(14px)",
          }}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute overflow-hidden will-change-[left,top,width,height]"
          style={{ left: 0, top: 0, width: "100%", height: "100%" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
          <img
            src={PHOTO_SRC}
            alt="Ahtesham Ahmad, full-stack AI engineer"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover [object-position:50%_30%]"
          />
          <div ref={maskRef} aria-hidden className="pointer-events-none absolute inset-0" />
        </motion.div>

        {/* Left: name + rotating headline */}
        <div
          ref={introRef}
          className={
            geo.wide
              ? "absolute z-[5] top-1/2 -translate-y-[40%] left-[5vw] lg:left-[140px]"
              : "absolute z-[5] left-6 right-6 bottom-28 md:left-[5vw] lg:left-[140px] md:right-[5vw] md:bottom-16"
          }
        >
          <motion.div
            initial={false}
            animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 16 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          >
            <p className="font-mono text-small tracking-[0.28em] text-muted mb-4">
              HI, I&apos;M{" "}
              <span className="text-foreground border-b border-accent pb-0.5">AHTESHAM</span>
            </p>
            <h1 className="sr-only">
              Ahtesham. I ship AI products that don&apos;t break.
            </h1>
            <p aria-hidden className="font-display-wide text-foreground/60" style={{ fontSize: "clamp(20px, 2.4vw, 34px)" }}>
              I ship
            </p>
            <div
              aria-hidden
              className="relative font-display-wide"
              style={{ fontSize: `${geo.font}px`, height: `${geo.font * 1.75}px` }}
            >
              {/* mode="wait": the old word leaves before the new one lands, so they never overlap */}
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: "30%", filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: "-30%", filter: "blur(8px)" }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="absolute left-0 top-0 whitespace-nowrap"
                >
                  <span className="text-gradient">{WORDS[word][0]}</span>
                  <br />
                  <span className="text-foreground">{WORDS[word][1]}</span>
                </motion.span>
              </AnimatePresence>
            </div>
            {!geo.wide && (
              <div className="hidden md:flex flex-wrap gap-2.5 mt-6">
                <button type="button" data-cv-open="true" onClick={openCvDrawer} className={CTA_PRIMARY}>
                  <FileText size={15} strokeWidth={1.5} />
                  View my CV
                </button>
                <a href="#projects" className={CTA_SECONDARY}>
                  See my work
                  <ArrowDown size={14} strokeWidth={1.5} />
                </a>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right: description + CTAs */}
        <div
          ref={sideRef}
          data-hero="desc"
          className={`${geo.wide ? "block" : "hidden"} absolute z-[5] right-[5vw] top-1/2 -translate-y-[30%] max-w-[min(300px,calc(50vw-18vw-5vw-16px))]`}
        >
          <motion.div
            initial={false}
            animate={{ opacity: m("desc") ? 1 : 0, y: m("desc") ? 0 : 12 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="flex items-center gap-2 font-mono text-caption text-accent-status mb-3 whitespace-nowrap">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent-status opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-status" />
              </span>
              Lead AI Developer at OpenEvent
            </p>
            <p key={lens} className="text-body text-muted leading-relaxed">
              {DESC[lens]}
            </p>
            <div className="flex flex-wrap gap-2.5 mt-5">
              <button type="button" data-cv-open="true" onClick={openCvDrawer} className={CTA_PRIMARY}>
                <FileText size={15} strokeWidth={1.5} />
                View my CV
              </button>
              <a href="#projects" className={CTA_SECONDARY}>
                See my work
                <ArrowDown size={14} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint. The numbers live only in the profile card, so nothing repeats. */}
        <div
          ref={bottomRef}
          className={`${geo.wide ? "block" : "hidden"} absolute z-[5] left-[5vw] lg:left-[140px] bottom-7`}
        >
          <motion.span
            initial={false}
            animate={{ opacity: m("desc") ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="block font-mono text-caption tracking-[0.24em] text-muted"
          >
            ↓ SCROLL TO MEET ME
          </motion.span>
        </div>

        {/* Card end-state: badge on the portrait */}
        <div
          ref={badgeRef}
          className="absolute z-[7] opacity-0 flex items-center gap-1.5 rounded-full border border-card-border bg-background/80 backdrop-blur-md px-2.5 py-1 font-mono text-caption text-accent-status"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-status" />
          Open to work<span className="hidden sm:inline"> · Remote / Gulf</span>
        </div>

        {/* Card end-state: details */}
        <div ref={infoRef} className="absolute z-[6] opacity-0 md:max-w-[520px]">
          <p className="font-mono text-small tracking-[0.24em] text-accent">{"// ABOUT"}</p>
          <h2 className="font-display-wide my-3 md:my-4" style={{ fontSize: "clamp(34px, 4.5vw, 64px)" }}>
            Hello, I&apos;m
            <br />
            <span className="text-gradient">Ahtesham</span>
          </h2>
          <p key={lens} className="text-body md:text-lead text-muted leading-relaxed">
            {ABOUT[lens](status.portfolio.yearsBuilding)}
          </p>
          <div className="grid grid-cols-3 gap-2.5 mt-5 md:mt-6">
            {[
              { v: `${status.openevent.clients}+`, l: lens === "plain" ? "companies on OpenEvent" : "OpenEvent clients" },
              { v: String(status.codelens.patterns), l: lens === "plain" ? "bug checks in CodeLens" : "CodeLens patterns" },
              { v: String(status.gogaa.providers), l: lens === "plain" ? "AI services in Gogaa" : "Gogaa providers" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-card-border bg-card/50 px-3 py-3 md:px-4 md:py-3.5">
                <b className="block font-heading text-xl md:text-2xl text-foreground">{s.v}</b>
                <span className="text-caption md:text-small text-muted">{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reveal anchor for the agent intro particles */}
        <div data-hero="agent" aria-hidden />
      </div>
    </section>
  );
}
