"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { X, Download, Zap, Rocket, Building2, Link2, TreePine, GraduationCap, Globe, Cog, Cloud, ArrowRight } from "lucide-react";
import { useCvHit } from "@/components/cv-counter";
import { useStatus } from "@/lib/use-status";

/* ------------------------------------------------------------------ */
/*  Global event bus for opening the drawer from anywhere              */
/* ------------------------------------------------------------------ */

const OPEN_EVENT = "open-cv-drawer";

export function openCvDrawer(): void {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

/* ------------------------------------------------------------------ */
/*  Shared constants                                                   */
/* ------------------------------------------------------------------ */

const ACCENT = "var(--accent, #d4a853)";
const AMBER = "var(--accent-secondary, #8ba4c4)";

/* ------------------------------------------------------------------ */
/*  Print CV — standalone HTML in popup window                         */
/* ------------------------------------------------------------------ */

function printCV(s: ReturnType<typeof useStatus>["status"]): void {
  const flow = ["Ingest", "Classify", "Orchestrate", "Review", "Execute", "Observe"]
    .map((step, i, a) => `<span style="font-family:monospace;font-size:9px;font-weight:500;padding:3px 9px;border-radius:5px;border:1px solid #d0d0d0;color:#4a6fa5;background:#f0f0ec">${step}</span>${i < a.length - 1 ? ' <span style="color:#ccc;font-size:9px">\u2192</span> ' : ""}`)
    .join("");

  const skills = [
    { title: "AI & ML", items: [["Claude API", 90], ["OpenAI / LangChain", 85], ["RAG Pipelines", 80], ["Multi-Agent Systems", 75], ["Prompt Engineering", 70], ["Taint Analysis", 65]] },
    { title: "Full Stack", items: [["TypeScript / React", 92], ["Next.js", 88], ["Supabase / PostgreSQL", 84], ["Node.js / Python", 80], ["Tailwind / Framer", 76]] },
    { title: "Infrastructure", items: [["GitHub Actions / CI", 88], ["Docker / Cloudflare", 83], ["Stripe Integration", 78], ["Playwright / n8n", 73]] },
    { title: "Process", items: [["Architecture-First Dev", 90], ["Team Leadership (3-10)", 85], ["Client Comms & SOWs", 80], ["Code Review (CodeLens)", 75]] },
  ].map(sec => `
    <p style="font-family:monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin:8px 0 4px"><span style="color:#4a6fa5">\u25B8</span> ${sec.title}</p>
    ${(sec.items as [string, number][]).map(([n, l]) => `
      <div style="display:flex;justify-content:space-between;margin-bottom:2px"><span style="font-size:9px;color:#555">${n}</span><span style="font-family:monospace;font-size:9px;color:#bbb">${l}%</span></div>
      <div style="height:3px;background:#eee;border-radius:1px;margin-bottom:4px"><div style="height:100%;width:${l}%;background:#4a6fa5;border-radius:1px"></div></div>
    `).join("")}
  `).join("");

  const roles = [
    { t: "Lead AI Developer", c: "MORE LIFE Hospitality GmbH \u00b7 Zurich \u00b7 Remote", p: "Sep 2025 \u2013 Present", a: true, items: [
      "Architected AI orchestration: email \u2192 classification \u2192 task extraction \u2192 workflow execution \u2192 auto-approval",
      "Multi-agent system with planner/worker/validator + human-in-the-loop approval",
      "Shipped full React frontend + Supabase Edge Functions + Stripe + Claude API",
    ]},
    { t: "Director IT & R&D", c: "Rouelite Techno Pvt. Ltd. \u00b7 Remote", p: "2022 \u2013 2024", items: [
      "Led 10-person team; system architecture serving 500+ daily users",
      "AI reduced manual data entry by 70%; agile cut delivery cycles by 40%",
    ]},
    { t: "AI Evaluation Specialist", c: "Outlier \u00b7 RWS \u00b7 Translated \u00b7 Remote", p: "2021 \u2013 Present", items: ["500+ RLHF/SFT evaluation sessions on frontier models"] },
    { t: "Freelance AI & Full-Stack Engineer", c: "Upwork \u00b7 Fiverr \u00b7 Direct Clients \u00b7 Remote", p: "2019 \u2013 Present", items: ["50+ production systems shipped; 40+ clients, 100% job success on Upwork"] },
    { t: "Co-Founder & AI Engineer", c: "Wadware House \u00b7 Remote", p: "2023 \u2013 Present", items: ["AI automation agency for scoped client engagements"] },
  ].map(r => `
    <div style="display:flex;gap:8px;margin-bottom:6px">
      <div style="display:flex;flex-direction:column;align-items:center;padding-top:2px">
        <div style="width:7px;height:7px;border-radius:50%;border:2px solid #4a6fa5;background:${r.a ? "rgba(74,111,165,0.15)" : "#fafaf8"}"></div>
        <div style="flex:1;width:1px;background:#e0e0dc;margin-top:2px"></div>
      </div>
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <p style="font-size:10.5px;font-weight:600">${r.t}</p>
          <p style="font-family:monospace;font-size:9px;color:#aaa">${r.p}</p>
        </div>
        <p style="font-size:9px;color:#999">${r.c}</p>
        <ul style="list-style:none;margin-top:3px;padding:0">${r.items.map(i => `<li style="font-size:9px;color:#666;line-height:1.45;padding-left:9px;position:relative;margin-bottom:1px"><span style="position:absolute;left:0;color:rgba(74,111,165,0.4);font-size:7px">\u25B8</span>${i}</li>`).join("")}</ul>
      </div>
    </div>
  `).join("");

  const projects = [
    { n: "Gogaa CLI", tag: "Dev Tool", tc: "#4a6fa5", d: `Claude Code alternative: ${s.gogaa.providers} providers, ${s.gogaa.tests.toLocaleString()} tests. Repo map, SEARCH/REPLACE, watch mode, plugins, parallel agents.` },
    { n: "CodeLens", tag: "AI Dev Tool", tc: "#4a6fa5", d: `${s.codelens.patterns}-pattern AI code review across ${s.codelens.stacks} stacks. Taint tracking, PR risk scoring, guardian mode. Zero deps, <1s.` },
    { n: "OpenEvent", tag: "Production SaaS", tc: "#b8860b", d: `${s.openevent.clients}+ clients, ${s.openevent.events}+ events. Multi-agent: email \u2192 extraction \u2192 workflow \u2192 auto-approval. Saves ~${s.openevent.hoursSavedPerDay} hrs/day.` },
    { n: "Command Center", tag: "Dev Tool", tc: "#10b981", d: "Unified dev interface: Claude API, Gemini, Supabase, Gmail. PWA with push notifications." },
    { n: "Gluten-Free Deals & Dining", tag: "Cross-Platform", tc: "#8b5cf6", d: "React Native + Next.js. LLM queries, 40+ retailer scraping, GPS finder, AI recipes." },
    { n: "AI Agent System", tag: "Multi-Agent", tc: "#ec4899", d: "5 agents with tool-calling on HuggingFace Spaces. Groq + Tavily + GitHub API." },
  ].map(p => `
    <div style="padding:5px 8px;border-radius:5px;border:1px solid #e8e8e4;background:#f5f5f1;margin-bottom:3px">
      <div style="display:flex;align-items:baseline;gap:5px;margin-bottom:1px">
        <span style="font-size:9.5px;font-weight:600">${p.n}</span>
        <span style="font-family:monospace;font-size:8px;padding:1px 5px;border-radius:10px;color:${p.tc};border:1px solid ${p.tc}40">${p.tag}</span>
      </div>
      <p style="font-size:9px;color:#777;line-height:1.4">${p.d}</p>
    </div>
  `).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CV - Ahtesham Ahmad</title>
<style>@page{size:A4;margin:0}html,body{margin:0;padding:0}body{-webkit-print-color-adjust:exact;print-color-adjust:exact;font-family:system-ui,-apple-system,sans-serif}</style>
</head><body style="background:#fafaf8;color:#1a1a2e">
<div style="padding:20px 32px;font-size:10px;line-height:1.45">
  <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:8px">
    <div>
      <p style="font-family:monospace;font-size:9px;text-transform:uppercase;letter-spacing:3px;color:#aaa;margin:0 0 3px">Curriculum Vitae</p>
      <h1 style="font-size:40px;font-weight:bold;letter-spacing:-1px;line-height:1;color:#1a1a2e;margin:0">Ahtesham <span style="color:#4a6fa5">Ahmad</span></h1>
      <p style="font-size:13px;font-weight:300;color:#888;margin:3px 0 0">AI Engineer</p>
      <p style="font-size:9.5px;color:#777;margin-top:5px;max-width:380px;line-height:1.55">AI engineer building production AI systems end-to-end: multi-agent orchestration, RAG pipelines, and full-stack AI-powered SaaS. I architect solutions where AI agents classify, execute, and learn while humans stay in control.</p>
    </div>
    <div style="font-family:monospace;font-size:9.5px;color:#999;text-align:right;line-height:1.7">
      shami8024@gmail.com<br><span style="color:#4a6fa5">github.com/shami-ah</span><br><span style="color:#4a6fa5">linkedin.com/in/ahtesham</span><br><span style="color:#4a6fa5">ahtesham.dev.wadwarehouse.com</span><br>Islamabad, PK \u00b7 Remote
    </div>
  </div>
  <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">${flow}</div>
  <div style="height:1px;background:linear-gradient(90deg,transparent,#4a6fa5,transparent);margin:7px 0"></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:8px">
    ${[{ n: "50+", l: "Production Systems" }, { n: "5+", l: "Years Experience" }, { n: "100%", l: "Client Satisfaction" }, { n: String(s.gogaa.tests), l: "Gogaa Tests", a: true }].map(st => `<div style="padding:8px;border-radius:6px;border:1px solid #e8e8e4;background:#f5f5f1;text-align:center"><p style="font-family:monospace;font-size:18px;font-weight:bold;color:${st.a ? "#b8860b" : "#4a6fa5"};line-height:1">${st.n}</p><p style="font-size:8px;text-transform:uppercase;letter-spacing:1.5px;color:#aaa;margin-top:3px">${st.l}</p></div>`).join("")}
  </div>
  <div style="display:grid;grid-template-columns:1fr 240px;gap:18px">
    <div>
      <p style="font-family:monospace;font-size:9px;text-transform:uppercase;letter-spacing:3px;color:#aaa;margin-bottom:6px"><span style="color:#4a6fa5">\u25B8</span> Experience</p>
      ${roles}
      <p style="font-family:monospace;font-size:9px;text-transform:uppercase;letter-spacing:3px;color:#aaa;margin:6px 0"><span style="color:#4a6fa5">\u25C6</span> Key Projects</p>
      ${projects}
      <p style="font-family:monospace;font-size:9px;text-transform:uppercase;letter-spacing:3px;color:#aaa;margin:6px 0 5px"><span style="color:#4a6fa5">\u25C8</span> Education</p>
      <div style="padding:6px 8px;border-radius:5px;border:1px solid #e8e8e4;background:#f5f5f1;display:flex;justify-content:space-between;align-items:baseline">
        <div><p style="font-size:9.5px;font-weight:600">B.Eng in Electrical & Electronics Engineering</p><p style="font-size:9px;color:#999">Sukkur IBA University</p></div>
        <p style="font-family:monospace;font-size:9px;color:#aaa">2017 \u2013 2020 \u00b7 Grade A</p>
      </div>
    </div>
    <div>
      ${skills}
      <p style="font-family:monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin:8px 0 4px"><span style="color:#4a6fa5">\u25B8</span> Certifications</p>
      ${["Generative AI & LLMs \u00b7 IBM", "Project Management \u00b7 Google", "Gen AI for PMs \u00b7 PMI"].map(c => `<p style="font-size:9px;color:#888;padding-left:7px;border-left:2px solid #e8e8e4;margin-bottom:3px;line-height:1.4">${c}</p>`).join("")}
      <p style="font-family:monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin:8px 0 4px"><span style="color:#4a6fa5">\u25B8</span> Languages</p>
      <div style="display:flex;gap:5px;flex-wrap:wrap">${["English \u00b7 Pro", "Urdu \u00b7 Native", "Pashtu \u00b7 Native", "Sindhi \u00b7 Conv", "Arabic \u00b7 Conv"].map(l => `<span style="font-size:8px;padding:2px 6px;border-radius:3px;background:#f0f0ec;color:#888;border:1px solid #e4e4e0">${l}</span>`).join("")}</div>
      <p style="font-family:monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin:8px 0 3px"><span style="color:#4a6fa5">\u25B8</span> Building Next</p>
      <p style="font-size:9px;color:#888;line-height:1.45">Gogaa Architect Mode \u00b7 Spec-to-Code Traceability \u00b7 CodeLens v0.4 (AST)</p>
    </div>
  </div>
</div></body></html>`;

  const id = "cv-print-frame";
  let frame = document.getElementById(id) as HTMLIFrameElement | null;
  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = id;
    frame.style.cssText = "position:fixed;width:0;height:0;border:none;left:-9999px";
    document.body.appendChild(frame);
  }
  const doc = frame.contentDocument || frame.contentWindow?.document;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();
  setTimeout(() => frame?.contentWindow?.print(), 300);
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */

function useCounter(target: number, duration = 2000): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }): React.ReactElement {
  const count = useCounter(value);
  return <>{count}{suffix}</>;
}

/* ------------------------------------------------------------------ */
/*  Flow node                                                          */
/* ------------------------------------------------------------------ */

function FlowNode({ label, delay, isLast }: { label: string; delay: number; isLast?: boolean }): React.ReactElement {
  return (
    <motion.div
      className="flex items-center gap-1"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
    >
      <motion.span
        className="px-2 py-0.5 rounded-lg text-xs font-mono font-medium border border-accent/25 bg-accent/10 text-accent"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
      {!isLast && (
        <motion.span
          className="text-muted/60 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.3 }}
        >{"\u2192"}</motion.span>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skill bar with glow                                                */
/* ------------------------------------------------------------------ */

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }): React.ReactElement {
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex justify-between text-xs mb-1">
        <span className="text-foreground/80 group-hover:text-foreground transition-colors">{name}</span>
        <span className="text-muted/80 font-mono">{level}%</span>
      </div>
      <div className="h-1.5 bg-card-border/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-accent"
          style={{ boxShadow: "0 0 10px var(--accent-glow)" }}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline dot with pulse                                            */
/* ------------------------------------------------------------------ */

function TimelineDot({ active }: { active?: boolean }): React.ReactElement {
  return (
    <div className="relative flex items-center justify-center">
      <div className={`w-3 h-3 rounded-full border-2 ${active ? "border-accent bg-accent/20" : "border-card-border bg-card"}`} />
      {active && (
        <motion.div
          className="absolute w-3 h-3 rounded-full border border-accent/40"
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section header                                                     */
/* ------------------------------------------------------------------ */

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-muted/80 mb-4 flex items-center gap-2">
        <span className="text-accent">{icon}</span> {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline role                                                      */
/* ------------------------------------------------------------------ */

function TimelineRole({ title, company, period, location, items, active }: {
  title: string; company: string; period: string; location: string; items: string[]; active?: boolean;
}): React.ReactElement {
  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col items-center pt-1">
        <TimelineDot active={active} />
        <div className="flex-1 w-px bg-card-border mt-2" />
      </div>
      <div className="pb-6 flex-1 min-w-0">
        <div className="flex justify-between items-baseline flex-wrap gap-2">
          <p className="font-semibold text-sm text-foreground">{title}</p>
          <p className="text-xs text-muted/60 font-mono">{period}</p>
        </div>
        <p className="text-xs text-muted/80">{company} · {location}</p>
        <ul className="mt-2 space-y-1">
          {items.map((item, i) => (
            <motion.li
              key={i}
              className="text-xs text-muted pl-3 relative before:content-['\25B8'] before:absolute before:left-0 before:text-accent/60 before:text-caption"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project card with 3D tilt                                          */
/* ------------------------------------------------------------------ */

function ProjectCard({ name, tag, tagColor, description, version, liveLabel }: {
  name: string; tag: string; tagColor: string; description: string; version?: string; liveLabel?: string;
}): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 7);
    rx.set((0.5 - (e.clientY - rect.top) / rect.height) * 7);
  };
  const onMouseLeave = (): void => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      className="p-4 rounded-lg border border-card-border bg-card/20 hover:border-muted/30 transition-all group relative overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      whileHover={{ boxShadow: `0 8px 30px ${tagColor}20` }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-70 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${tagColor}, transparent)` }}
      />
      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
        <p className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">{name}</p>
        <span className="text-caption px-1.5 py-0.5 rounded-full font-mono" style={{ color: tagColor, border: `1px solid ${tagColor}40` }}>{tag}</span>
        {version && <span className="text-caption px-1.5 py-0.5 rounded font-mono bg-card/60 text-muted tabular-nums">v{version}</span>}
        {liveLabel && (
          <span className="inline-flex items-center gap-1 text-caption font-mono text-green-400/80">
            <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
            {liveLabel}
          </span>
        )}
      </div>
      <p className="text-xs text-muted/80 leading-relaxed">{description}</p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring" as const, damping: 28, stiffness: 300, mass: 0.8 },
  },
  exit: {
    x: "100%",
    transition: { type: "spring" as const, damping: 32, stiffness: 400 },
  },
};

/* ------------------------------------------------------------------ */
/*  Main Drawer                                                        */
/* ------------------------------------------------------------------ */

export function CVDrawer(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const { status } = useStatus();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handler = (): void => setOpen(true);
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  // Scroll lock (iOS-safe) + Escape key
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    document.body.setAttribute("data-modal-open", "true");

    const onKey = (e: KeyboardEvent): void => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.body.removeAttribute("data-modal-open");
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && <DrawerContent close={close} status={status} />}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Drawer content — matches visual-cv.tsx styling                     */
/* ------------------------------------------------------------------ */

function DrawerContent({ close, status }: { close: () => void; status: ReturnType<typeof useStatus>["status"] }): React.ReactElement {
  useCvHit();
  const flowSteps = ["Ingest", "Classify", "Orchestrate", "Review", "Execute", "Observe"];

  return (
    <motion.div
      className="fixed inset-0 z-[100] print:hidden"
      initial="hidden"
      animate="visible"
      exit="exit"
      aria-modal="true"
      role="dialog"
      aria-label="CV Drawer"
    >
      {/* Backdrop */}
      <motion.div
        variants={backdropVariants}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
      />

      {/* Drawer panel */}
      <motion.div
        variants={drawerVariants}
        className="absolute top-0 right-0 bottom-0 w-full max-w-[520px] bg-background border-l border-card-border shadow-2xl shadow-black/40 flex flex-col overflow-hidden"
      >
        {/* Background effects — same as visual-cv */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-accent-secondary/5 rounded-full blur-3xl" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--foreground) 3%, transparent) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Header — pinned, with PDF + close */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-card-border bg-background/80 backdrop-blur-md shrink-0 z-10">
          <div>
            <motion.p
              className="text-xs font-mono uppercase tracking-[0.3em] text-muted/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >Curriculum Vitae</motion.p>
            <h2 className="text-xl font-bold tracking-tight mt-0.5">
              Ahtesham <span style={{ color: ACCENT }}>Ahmad</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={() => printCV(status)}
              className="px-3 py-1.5 bg-accent/90 hover:bg-accent text-background rounded-lg text-xs font-medium flex items-center gap-1.5 border border-accent/20 shadow-lg shadow-accent/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={13} />
              PDF
            </motion.button>
            <button
              type="button"
              onClick={close}
              aria-label="Close CV"
              className="w-8 h-8 rounded-full bg-card/80 border border-card-border hover:border-accent/40 hover:bg-card-hover transition-all flex items-center justify-center text-muted hover:text-foreground"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="relative flex-1 overflow-y-auto overscroll-contain">
          <div className="px-6 py-8 space-y-10">

            {/* Intro + contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                className="text-lg text-muted font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >AI Engineer</motion.p>
              <motion.p
                className="text-sm text-muted/80 mt-3 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                AI engineer building production AI systems end-to-end: multi-agent orchestration, RAG pipelines, and full-stack AI-powered SaaS. I architect solutions where AI agents classify, execute, and learn while humans stay in control.
              </motion.p>
              <motion.div
                className="text-sm text-muted/80 space-y-1.5 font-mono mt-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p>shami8024@gmail.com</p>
                <p className="text-accent-secondary">github.com/shami-ah</p>
                <p className="text-accent-secondary">linkedin.com/in/ahtesham</p>
                <p className="text-accent-secondary">ahtesham.dev.wadwarehouse.com</p>
                <p>Islamabad, PK · Remote</p>
              </motion.div>
            </motion.div>

            {/* Architecture flow — animated */}
            <motion.div
              className="flex flex-wrap items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {flowSteps.map((step, i) => (
                <FlowNode key={step} label={step} delay={0.8 + i * 0.15} isLast={i === flowSteps.length - 1} />
              ))}
            </motion.div>

            {/* Glowing divider */}
            <motion.div
              className="h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            />

            {/* Stats row */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {[
                { n: 50, s: "+", l: "Production Systems", amber: false },
                { n: 5, s: "+", l: "Years Experience", amber: false },
                { n: 100, s: "%", l: "Client Satisfaction", amber: false },
                { n: status.gogaa.tests, s: "", l: "Gogaa Tests Passing", amber: true },
              ].map((stat) => (
                <motion.div
                  key={stat.l}
                  className="p-4 rounded-xl border border-card-border bg-card/40 backdrop-blur-sm text-center group hover:border-accent/20 transition-colors"
                  whileHover={{ y: -4 }}
                >
                  <p className="text-2xl font-bold font-mono" style={{ color: stat.amber ? AMBER : ACCENT }}>
                    <AnimatedCounter value={stat.n} suffix={stat.s} />
                  </p>
                  <p className="text-caption text-muted/80 mt-1 uppercase tracking-wider">{stat.l}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Experience */}
            <Section title="Experience" icon={<ArrowRight size={12} />}>
              <TimelineRole active title="Lead AI Developer" company="MORE LIFE Hospitality GmbH" period="Sep 2025 – Present" location="Zurich · Remote" items={[
                "Architected AI orchestration: email \u2192 classification \u2192 task extraction \u2192 workflow execution \u2192 auto-approval",
                "Built Supabase Edge Functions for LLM calls, entity extraction, and workflow triggers",
                "Designed multi-agent system with planner/worker/validator pattern + human-in-the-loop approval",
                "Shipped React frontend: Task Inbox, Workflow Runner, Approval Flows, Marketing Hub, Admin Dashboard",
                "React + TypeScript + Supabase + Stripe + Claude API + GitHub Actions",
              ]} />
              <TimelineRole title="Director IT & R&D" company="Rouelite Techno Pvt. Ltd." period="2022 – 2024" location="Remote" items={[
                "Led 10-person team building custom CRM and business automation",
                "Designed system architecture serving 500+ daily users",
                "Introduced AI into daily operations, reducing manual data entry by 70%",
                "Replaced 3 legacy spreadsheet processes with React + Supabase internal tools",
                "Implemented agile workflows reducing delivery cycles by 40%",
              ]} />
              <TimelineRole title="AI Evaluation Specialist" company="Outlier · RWS · Translated" period="2021 – Present" location="Remote" items={[
                "500+ RLHF/SFT evaluation sessions on frontier models",
                "Evaluated model reasoning, code generation, and instruction-following quality",
              ]} />
              <TimelineRole title="Freelance AI & Full-Stack Engineer" company="Upwork · Fiverr · Direct Clients" period="2019 – Present" location="Remote · Global" items={[
                "50+ production systems shipped: SaaS products, AI pipelines, dashboards, automation",
                "40+ long-term clients across 250+ total projects, 100% job success rate on Upwork",
              ]} />
              <TimelineRole title="Co-Founder & AI Engineer" company="Wadware House" period="2023 – Present" location="Remote" items={[
                "Co-founded AI automation agency for scoped client engagements",
                "Delivered AI integration and automation projects for global clients",
              ]} />
            </Section>

            {/* Key Projects */}
            <Section title="Key Projects" icon={<Building2 size={12} />}>
              <ProjectCard name="Gogaa CLI" tag="Dev Tool · CLI" tagColor={ACCENT} version={status.gogaa.version} description={`Claude Code alternative: ${status.gogaa.providers} providers, Aider parity, ${status.gogaa.tests.toLocaleString()} tests. Repo map, SEARCH/REPLACE, watch mode, plugin marketplace, parallel agents.`} />
              <ProjectCard name="CodeLens" tag="AI Dev Tool" tagColor={ACCENT} version={status.codelens.version} description={`${status.codelens.patterns}-pattern AI code review engine across ${status.codelens.stacks} stacks. Security taint tracking, PR risk scoring, guardian mode. Zero deps, <1s reviews.`} />
              <ProjectCard name="OpenEvent" tag="Production SaaS" tagColor={AMBER} liveLabel="live" description={`${status.openevent.clients}+ clients across ${status.openevent.events}+ events. Saves each team ~${status.openevent.hoursSavedPerDay} hrs/day of manual email processing. Multi-agent orchestration: email \u2192 entity extraction \u2192 workflow \u2192 auto-approval.`} />
              <ProjectCard name="Command Center" tag="Developer Tool" tagColor="#10b981" description="Unified dev interface with Claude API, Google Gemini, Supabase, Gmail/Calendar integration. PWA with push notifications." />
              <ProjectCard name="Gluten-Free Deals & Dining" tag="Cross-Platform" tagColor="#8b5cf6" description="React Native + Next.js app. LLM-generated 200+ search queries, concurrent scraping from 40+ retailers, GPS restaurant finder, AI recipe generation." />
              <ProjectCard name="AI Agent System" tag="Multi-Agent" tagColor="#ec4899" description="5 purpose-built AI agents with tool-calling: job search, research, code review, proposals, freelance automation. Groq + Tavily + GitHub API. Deployed on HuggingFace Spaces." />
            </Section>

            {/* Skills — AI & ML */}
            <Section title="AI & ML" icon={<Zap size={12} />}>
              {["Claude API", "OpenAI / LangChain", "RAG Pipelines", "Multi-Agent Systems", "Prompt Engineering", "Taint Analysis"].map((s, i) => (
                <SkillBar key={s} name={s} level={90 - i * 5} delay={i * 0.05} />
              ))}
            </Section>

            {/* Skills — Full Stack */}
            <Section title="Full Stack" icon={<Cog size={12} />}>
              {["TypeScript / React", "Next.js", "Supabase / PostgreSQL", "Node.js / Python", "Tailwind / Framer"].map((s, i) => (
                <SkillBar key={s} name={s} level={92 - i * 4} delay={i * 0.05} />
              ))}
            </Section>

            {/* Skills — Infrastructure */}
            <Section title="Infrastructure" icon={<Cloud size={12} />}>
              {["GitHub Actions / CI", "Docker / Cloudflare", "Stripe Integration", "Playwright / n8n"].map((s, i) => (
                <SkillBar key={s} name={s} level={88 - i * 5} delay={i * 0.05} />
              ))}
            </Section>

            {/* Skills — Process */}
            <Section title="Process" icon={<ArrowRight size={12} />}>
              {["Architecture-First Development", "Team Leadership (3-10 people)", "Client-Facing Comms & SOWs", "CodeLens: 305-pattern review engine", "Gogaa: Claude Code alternative"].map((s, i) => (
                <SkillBar key={s} name={s} level={90 - i * 4} delay={i * 0.05} />
              ))}
            </Section>

            {/* Certifications */}
            <Section title="Certifications" icon={<GraduationCap size={12} />}>
              <div className="space-y-2 text-xs">
                {["Generative AI & LLMs · IBM", "Project Management · Google", "Gen AI for PMs · PMI"].map((cert, i) => (
                  <motion.p
                    key={cert}
                    className="text-muted pl-3 border-l border-card-border"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >{cert}</motion.p>
                ))}
              </div>
            </Section>

            {/* Languages */}
            <Section title="Languages" icon={<Globe size={12} />}>
              <div className="flex gap-2 flex-wrap">
                {[{ l: "English", v: "Professional" }, { l: "Urdu", v: "Native" }, { l: "Pashtu", v: "Native" }, { l: "Sindhi", v: "Conversational" }, { l: "Arabic", v: "Conversational" }].map((lang) => (
                  <span key={lang.l} className="text-xs px-2.5 py-1 rounded-lg bg-card/80 text-muted border border-card-border">{lang.l} · {lang.v}</span>
                ))}
              </div>
            </Section>

            {/* Education */}
            <Section title="Education" icon={<GraduationCap size={12} />}>
              <motion.div
                className="p-4 rounded-lg border border-card-border bg-card/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex justify-between items-baseline">
                  <div>
                    <p className="font-semibold text-sm">B.Eng in Electrical & Electronics Engineering</p>
                    <p className="text-xs text-muted/80">Sukkur IBA University</p>
                  </div>
                  <p className="text-xs text-muted/60 font-mono">2017 – 2020 · Grade A</p>
                </div>
              </motion.div>
            </Section>

            {/* Building Next */}
            <Section title="Building Next" icon={<Rocket size={12} />}>
              <div className="space-y-2">
                {[
                  { icon: <Building2 size={14} />, name: "Gogaa Architect Mode", status: "Next", color: ACCENT },
                  { icon: <Link2 size={14} />, name: "Spec-to-Code Traceability", status: "Designing", color: AMBER },
                  { icon: <TreePine size={14} />, name: "CodeLens v0.4 (AST)", status: "Planned", color: "#10b981" },
                ].map((item, i) => (
                  <motion.div
                    key={item.name}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-card/40 border border-card-border"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ borderColor: `${item.color}40` }}
                  >
                    <span>{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground/80">{item.name}</p>
                    </div>
                    <span className="text-caption px-1.5 py-0.5 rounded-full font-mono" style={{ color: item.color, border: `1px solid ${item.color}40` }}>{item.status}</span>
                  </motion.div>
                ))}
              </div>
            </Section>

            {/* Footer spacer */}
            <div className="h-6" />
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
