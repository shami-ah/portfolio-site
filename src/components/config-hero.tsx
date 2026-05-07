"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useStatus } from "@/lib/use-status";

const CONFIG_LINES = [
  { text: "// openevent.pipeline.ts", type: "comment" as const },
  { text: "", type: "blank" as const },
  { text: "export const inbox = createPipeline({", type: "keyword" as const },
  { text: '  trigger: "incoming_email",', type: "string" as const },
  { text: "  steps: [", type: "keyword" as const },
  { text: '    classify({ model: "gpt-4o", schema: EventIntent }),', type: "string" as const },
  { text: '    extract(["date", "guests", "venue", "budget"]),', type: "string" as const },
  { text: '    requireApproval({ notify: "team_lead" }),', type: "status" as const },
  { text: "    execute([", type: "keyword" as const },
  { text: "      bookCalendar(),", type: "string" as const },
  { text: "      sendConfirmation(),", type: "string" as const },
  { text: '      createInvoice({ via: "stripe" }),', type: "string" as const },
  { text: "    ]),", type: "keyword" as const },
  { text: "  ],", type: "keyword" as const },
  { text: "  onError: escalateToHuman(),", type: "status" as const },
  { text: "}) satisfies Pipeline;", type: "keyword" as const },
];

function SyntaxLine({ line, lineNum }: {
  line: typeof CONFIG_LINES[number];
  lineNum: number;
}): React.ReactElement {
  const { text, type } = line;

  // useMemo must run unconditionally (React hooks rules)
  const colorized = useMemo(() => {
    if (type === "blank" || type === "comment") return null;

    const tokens: { text: string; color: string }[] = [];
    let i = 0;

    while (i < text.length) {
      const kwMatch = text.slice(i).match(/^(export default|export|default|satisfies|const)\b/);
      if (kwMatch) {
        tokens.push({ text: kwMatch[0], color: "text-accent" });
        i += kwMatch[0].length;
        continue;
      }

      if (text[i] === '"') {
        const end = text.indexOf('"', i + 1);
        if (end !== -1) {
          tokens.push({ text: text.slice(i, end + 1), color: type === "status" ? "text-accent-status" : "text-accent-secondary" });
          i = end + 1;
          continue;
        }
      }

      if ("{}[],;:".includes(text[i])) {
        tokens.push({ text: text[i], color: "text-muted/50" });
        i++;
        continue;
      }

      if (text[i] === " ") {
        tokens.push({ text: " ", color: "" });
        i++;
        continue;
      }

      const propNameMatch = text.slice(i).match(/^(\w+)/);
      if (propNameMatch) {
        tokens.push({ text: propNameMatch[0], color: "text-foreground/80" });
        i += propNameMatch[0].length;
        continue;
      }

      tokens.push({ text: text[i], color: "text-foreground" });
      i++;
    }

    return tokens.map((t, idx) => (
      <span key={idx} className={t.color}>{t.text}</span>
    ));
  }, [text, type]);

  if (type === "blank") {
    return <div className="h-[1.7em]" />;
  }

  if (type === "comment") {
    return (
      <div className="flex">
        <span className="w-8 text-right mr-4 text-muted/30 select-none">{lineNum}</span>
        <span className="text-muted/50">{text}</span>
      </div>
    );
  }

  return (
    <div className="flex">
      <span className="w-8 text-right mr-4 text-muted/30 select-none">{lineNum}</span>
      <span>{colorized}</span>
    </div>
  );
}

export function ConfigHero(): React.ReactElement {
  const { status } = useStatus();
  const [ready, setReady] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  const { scrollY } = useScroll();
  const orbY1 = useTransform(scrollY, [0, 800], [0, 120]);
  const orbY2 = useTransform(scrollY, [0, 800], [0, -80]);
  const orbOpacity = useTransform(scrollY, [0, 600], [1, 0.3]);
  const codeY = useTransform(scrollY, [0, 600], [0, -40]);
  const codeScale = useTransform(scrollY, [0, 600], [1, 0.97]);

  // Wait for boot-complete
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

  // Type out lines one by one
  useEffect(() => {
    if (!ready) return;
    if (visibleLines >= CONFIG_LINES.length) return;
    const timer = setTimeout(
      () => setVisibleLines((n) => n + 1),
      visibleLines === 0 ? 400 : 55,
    );
    return () => clearTimeout(timer);
  }, [ready, visibleLines]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 md:pt-20 md:pb-24"
    >
      {/* Parallax gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: orbY1, opacity: orbOpacity }}
          className="absolute -top-40 -right-40 w-72 md:w-[32rem] h-72 md:h-[32rem] bg-accent/8 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: orbY2, opacity: orbOpacity }}
          className="absolute -bottom-40 -left-40 w-72 md:w-[32rem] h-72 md:h-[32rem] bg-accent-secondary/6 rounded-full blur-3xl"
        />
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-5 md:px-6">
        <div className="grid md:grid-cols-[1fr,1.1fr] gap-10 md:gap-14 items-center">

          {/* Left: tagline + CTA */}
          <div className="text-center md:text-left">
            {/* System badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={ready ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-status/10 border border-accent-status/20 text-accent-status text-caption md:text-xs font-mono mb-6"
            >
              <span className="w-1.5 h-1.5 bg-accent-status rounded-full animate-pulse" />
              Open to opportunities
            </motion.div>

            {/* Tagline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-5"
            >
              I architect{" "}
              <span className="text-gradient">AI systems</span>
              {" "}and ship them to production.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm md:text-base text-muted max-w-md leading-relaxed mb-8"
            >
              From multi-agent orchestration and RAG pipelines to full-stack
              AI-powered SaaS. I design the architecture, build the product, and own the delivery.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex flex-wrap gap-3 justify-center md:justify-start"
            >
              <a
                href="#projects"
                className="px-6 py-2.5 bg-accent text-background font-medium rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 text-sm"
              >
                See the work
              </a>
            </motion.div>

            {/* Currently building */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="flex items-center gap-2 mt-6 justify-center md:justify-start"
            >
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              <p className="text-caption md:text-xs font-mono text-muted/60">
                building:{" "}
                <span className="text-accent/80">
                  {status.currentlyBuilding.label}
                </span>
              </p>
            </motion.div>
          </div>

          {/* Right: code editor — floats with parallax depth */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: codeY, scale: codeScale }}
          >
            <div className="rounded-xl border border-card-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/30">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-card-border bg-card/50">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="ml-2 text-xs font-mono text-muted/60">openevent.pipeline.ts</span>
              </div>

              {/* Code content */}
              <div className="p-4 md:p-5 font-mono text-small md:text-body leading-[1.7] overflow-x-auto">
                {CONFIG_LINES.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <SyntaxLine line={line} lineNum={i + 1} />
                  </motion.div>
                ))}
                {/* Blinking cursor */}
                {visibleLines < CONFIG_LINES.length && (
                  <div className="flex">
                    <span className="w-8 text-right mr-4 text-muted/30 select-none">{visibleLines + 1}</span>
                    <span className="w-2 h-[1.1em] bg-accent animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 2.5 }}
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
