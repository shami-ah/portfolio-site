"use client";

declare global {
  // eslint-disable-next-line no-var
  var __agentScrolling: boolean | undefined;
}

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { openCvDrawer } from "@/components/cv-drawer";

/* ------------------------------------------------------------------ */
/*  Build pipeline popup — 5-second centered overlay                  */
/* ------------------------------------------------------------------ */

const BUILD_STEPS = [
  { label: "Product", detail: "Pin the outcome" },
  { label: "Architect", detail: "Sketch the flow" },
  { label: "Spec", detail: "Schema + RLS + edge cases" },
  { label: "Scaffold", detail: "Agent generates from spec" },
  { label: "Review", detail: "CodeLens catches what I miss" },
  { label: "Ship", detail: "Feature flag, 10%, then 100%" },
];

function BuildPopup({ onDone }: { onDone: () => void }): React.ReactElement {
  const [step, setStep] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (step < BUILD_STEPS.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [step, onDone]);

  if (typeof document === "undefined") return <></>;

  const el = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
      onClick={onDone}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(9,9,11,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }} />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", pointerEvents: "none" }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22, mass: 0.8 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "340px",
          borderRadius: "28px",
          background: "rgba(24,24,27,0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(59,130,246,0.25)",
          boxShadow: "0 0 60px rgba(59,130,246,0.15), 0 0 120px rgba(59,130,246,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
          padding: "28px",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: "-30%", left: "-20%", width: "140%", height: "60%",
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none", borderRadius: "50%",
        }} />
        <p className="text-caption font-mono text-accent uppercase tracking-[0.25em] mb-5 flex items-center justify-center gap-2 relative">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          how I ship every feature
        </p>
        <div className="space-y-2.5 relative">
          {BUILD_STEPS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                i < step
                  ? { scale: 1, opacity: 1, y: 0 }
                  : { scale: 0.85, opacity: 0.12, y: 0 }
              }
              transition={
                i < step
                  ? { type: "spring", stiffness: 500, damping: 18, mass: 0.5, delay: 0.05 }
                  : { duration: 0.2 }
              }
              className={`flex items-center gap-3 px-4 py-2.5 rounded-full border transition-colors ${
                i < step ? "bg-accent/10 border-accent/20" : "bg-card/20 border-card-border/20"
              }`}
            >
              <span className={`text-caption font-mono tabular-nums shrink-0 ${i < step ? "text-accent" : "text-muted/40"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-sm font-semibold flex-1 ${i < step ? "text-foreground" : "text-muted/40"}`}>
                {s.label}
              </span>
              <span className={`text-caption hidden sm:inline ${i < step ? "text-muted/80" : "text-muted/20"}`}>
                {s.detail}
              </span>
              {i < step && (
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="text-green-400 shrink-0"
                >
                  <Check size={14} strokeWidth={3} />
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
        {step >= BUILD_STEPS.length && (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mt-5 text-xs text-muted text-center"
          >
            Every project. Every time.
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );

  return ReactDOM.createPortal(el, document.body);
}

/* ------------------------------------------------------------------ */
/*  Commands                                                           */
/* ------------------------------------------------------------------ */

interface AgentStep {
  name: string;
  detail: string;
  ms: number;
}

interface AgentCommand {
  keyword: string;
  label?: string;
  intent: string;
  confidence: number;
  steps: AgentStep[];
  response: string;
  action?: () => void;
}

function scrollTo(id: string): void {
  // Flag programmatic scroll so top-bar meteor animation doesn't trigger
  window.__agentScrolling = true;
  setTimeout(() => { window.__agentScrolling = false; }, 2000);
  // Dispatch reveal event — AgentRevealParticles blurs the section,
  // fires particles after scroll settles, then deblurs on arrival
  window.dispatchEvent(new CustomEvent("section-reveal", { detail: { sectionId: id } }));
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ------------------------------------------------------------------ */
/*  Fuzzy intent matching for free-text queries                        */
/* ------------------------------------------------------------------ */

interface FuzzyMatch {
  command: AgentCommand;
  score: number;
}

const PROJECT_KEYWORDS: Record<string, string[]> = {
  projects: ["event", "management", "booking", "email", "openevent", "client", "crm", "invoice"],
  projects_codelens: ["code review", "lint", "pattern", "bug", "security", "pr review", "codelens", "static analysis"],
  projects_gogaa: ["cli", "coding agent", "ai coding", "terminal", "provider", "model", "gogaa", "llm"],
  projects_rasad: ["observability", "session", "analytics", "cost", "token", "rasad", "monitoring"],
  rate: ["rate", "price", "pricing", "cost", "charge", "budget", "hourly", "salary", "pay", "compensation", "how much", "expensive"],
  hire: ["hire", "hiring", "recruit", "work with", "engage", "freelance", "contract", "full-time", "available", "looking for"],
  cv: ["resume", "cv", "background", "qualification", "education", "experience", "portfolio"],
  skills: ["skills", "skill", "tech stack", "technology", "what do you know", "expertise", "proficient"],
  contact: ["contact", "reach", "email", "call", "talk", "connect", "meet", "book"],
  chat: ["chat", "ask", "question", "tell me", "explain", "help me", "more info", "details"],
  build: ["build", "ship", "deliver", "process", "workflow", "methodology", "how do you work"],
  tour: ["tour", "journey", "story", "about you", "who are you", "background"],
  stack: ["stack", "tools", "framework", "language", "react", "typescript", "supabase", "next"],
  availability: ["available", "availability", "when", "start", "timeline", "capacity"],
  impact: ["impact", "results", "numbers", "metrics", "achievement"],
  experience: ["experience", "career", "worked", "company", "job", "role", "position"],
};

function fuzzyMatch(query: string, cmds: AgentCommand[]): FuzzyMatch | null {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/);

  let best: FuzzyMatch | null = null;

  for (const [keyword, phrases] of Object.entries(PROJECT_KEYWORDS)) {
    let score = 0;
    for (const phrase of phrases) {
      if (q.includes(phrase)) {
        score += phrase.split(/\s+/).length * 2;
      } else {
        for (const token of tokens) {
          if (token.length >= 3 && phrase.includes(token)) score += 1;
        }
      }
    }
    if (score > 0) {
      // Map compound keys like "projects_codelens" back to "projects"
      const cmdKey = keyword.includes("_") ? keyword.split("_")[0] : keyword;
      const cmd = cmds.find((c) => c.keyword === cmdKey);
      if (cmd && (!best || score > best.score)) {
        // Build a contextual response for project-specific queries
        const projectName = keyword.includes("codelens") ? "CodeLens"
          : keyword.includes("gogaa") ? "Gogaa CLI"
          : keyword.includes("rasad") ? "Rasad"
          : null;

        if (projectName) {
          best = {
            score,
            command: {
              ...cmd,
              intent: "project_match",
              confidence: Math.min(0.95, 0.6 + score * 0.05),
              steps: [
                { name: "tokenize", detail: `${tokens.length} tokens`, ms: 3 },
                { name: "fuzzy_match", detail: `best: ${projectName} · score ${score}`, ms: 38 },
                { name: "route_to_tool", detail: "→ scroll_to_section", ms: 5 },
                { name: "execute", detail: "target: #projects", ms: 110 },
              ],
              response: `Matched "${projectName}" — scrolling to projects. Click the card for the full case study.`,
            },
          };
        } else {
          best = { score, command: { ...cmd, confidence: Math.min(0.95, 0.6 + score * 0.05) } };
        }
      }
    }
  }

  return best && best.score >= 2 ? best : null;
}

const commands: AgentCommand[] = [
  {
    keyword: "hire",
    label: "Hire",
    intent: "hiring_intent",
    confidence: 0.94,
    steps: [
      { name: "tokenize", detail: "1 token", ms: 3 },
      { name: "classify_intent", detail: "label: hiring_intent · conf 0.94", ms: 42 },
      { name: "route_to_tool", detail: "→ scroll_to_section", ms: 6 },
      { name: "execute", detail: "target: #contact", ms: 120 },
    ],
    response: "Hiring intent detected. Moving to Contact. 15-min call waits below.",
    action: () => scrollTo("contact"),
  },
  {
    keyword: "contact",
    intent: "hiring_intent",
    confidence: 0.94,
    steps: [
      { name: "classify_intent", detail: "label: hiring_intent · conf 0.94", ms: 38 },
      { name: "route_to_tool", detail: "→ scroll_to_section", ms: 6 },
      { name: "execute", detail: "target: #contact", ms: 120 },
    ],
    response: "Scrolling to contact section.",
    action: () => scrollTo("contact"),
  },
  {
    keyword: "shami",
    intent: "personal_greeting",
    confidence: 0.99,
    steps: [
      { name: "tokenize", detail: "1 token", ms: 2 },
      { name: "classify_intent", detail: "label: personal_greeting · conf 0.99", ms: 28 },
      { name: "retrieve_context", detail: "identity_card", ms: 14 },
    ],
    response: "Hey, you found it. AI engineer, Lead AI Dev, builder of tools. Thanks for actually exploring. Most don't.",
  },
  {
    keyword: "tour",
    intent: "guided_tour",
    confidence: 0.97,
    steps: [
      { name: "tokenize", detail: "1 token", ms: 2 },
      { name: "classify_intent", detail: "label: guided_tour · conf 0.97", ms: 31 },
      { name: "route_to_tool", detail: "→ navigate", ms: 4 },
      { name: "execute", detail: "target: /journey", ms: 45 },
    ],
    response: "Launching immersive journey. Timeline + a day in my life + parallel systems.",
    // action is handled specially in the component for client-side navigation
  },
  {
    keyword: "call",
    intent: "meeting_request",
    confidence: 0.93,
    steps: [
      { name: "classify_intent", detail: "label: meeting_request · conf 0.93", ms: 38 },
      { name: "route_to_tool", detail: "→ open_booking", ms: 5 },
      { name: "execute", detail: "url: ahtesham.dev.wadwarehouse.com/book", ms: 22 },
    ],
    response: "Opening 15-min intro call scheduler in a new tab.",
    action: () => window.open("https://ahtesham.dev.wadwarehouse.com/book", "_blank", "noopener,noreferrer"),
  },
  {
    keyword: "cv",
    intent: "resume_request",
    confidence: 0.96,
    steps: [
      { name: "classify_intent", detail: "label: resume_request · conf 0.96", ms: 26 },
      { name: "route_to_tool", detail: "→ open_cv_drawer", ms: 4 },
      { name: "execute", detail: "target: cv-drawer", ms: 30 },
    ],
    response: "Opening visual CV. Pro tip: there's a print-ready version too.",
    action: () => openCvDrawer(),
  },
  {
    keyword: "resume",
    intent: "resume_request",
    confidence: 0.96,
    steps: [
      { name: "classify_intent", detail: "label: resume_request · conf 0.96", ms: 26 },
      { name: "route_to_tool", detail: "→ open_cv_drawer", ms: 4 },
      { name: "execute", detail: "target: cv-drawer", ms: 30 },
    ],
    response: "Opening visual CV. Pro tip: there's a print-ready version too.",
    action: () => openCvDrawer(),
  },
  {
    keyword: "build",
    intent: "feature_walkthrough",
    confidence: 0.93,
    steps: [
      { name: "classify_intent", detail: "label: feature_walkthrough · conf 0.93", ms: 32 },
      { name: "load_pipeline", detail: "6-step delivery pipeline", ms: 12 },
    ],
    response: "Rendering the pipeline now.",
    action: () => window.dispatchEvent(new CustomEvent("show-build-popup")),
  },
  {
    keyword: "chat",
    intent: "conversational_query",
    confidence: 0.95,
    steps: [
      { name: "classify_intent", detail: "label: conversational_query · conf 0.95", ms: 31 },
      { name: "route_to_tool", detail: "→ spawn_chat_agent", ms: 6 },
      { name: "execute", detail: "target: /chat", ms: 42 },
    ],
    response: "Launching chat agent. Ask anything about my work.",
    // action is handled specially in the component for fly-to-chat animation
  },
  {
    keyword: "projects",
    intent: "browse_projects",
    confidence: 0.91,
    steps: [
      { name: "classify_intent", detail: "label: browse_projects · conf 0.91", ms: 35 },
      { name: "route_to_tool", detail: "→ scroll_to_section", ms: 5 },
      { name: "execute", detail: "target: #projects", ms: 110 },
    ],
    response: "9 case studies below. Click any card for architecture + results.",
    action: () => scrollTo("projects"),
  },
  {
    keyword: "writing",
    intent: "browse_writing",
    confidence: 0.91,
    steps: [
      { name: "classify_intent", detail: "label: browse_writing · conf 0.91", ms: 33 },
      { name: "route_to_tool", detail: "→ scroll_to_section", ms: 5 },
      { name: "execute", detail: "target: #writing", ms: 100 },
    ],
    response: "Scrolling to writing section.",
    action: () => scrollTo("writing"),
  },
  {
    keyword: "boot",
    intent: "replay_intro",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: replay_intro · conf 0.99", ms: 22 },
      { name: "route_to_tool", detail: "→ reset_session", ms: 8 },
      { name: "execute", detail: "clearing flags…", ms: 40 },
    ],
    response: "Replaying intro sequence...",
    action: () => window.dispatchEvent(new CustomEvent("replay-intro")),
  },
  {
    keyword: "wow",
    intent: "reaction_positive",
    confidence: 0.88,
    steps: [
      { name: "classify_intent", detail: "label: reaction_positive · conf 0.88", ms: 31 },
    ],
    response: "That's the feeling. Every interaction here is wired to something real. Keep poking.",
  },
  {
    keyword: "presence",
    intent: "toggle_presence",
    confidence: 0.98,
    steps: [
      { name: "classify_intent", detail: "label: toggle_presence · conf 0.98", ms: 24 },
      { name: "dispatch_event", detail: "toggle-presence", ms: 3 },
    ],
    response: "Toggled visitor presence. Fake cursors from other cities moving around.",
    action: () => window.dispatchEvent(new CustomEvent("toggle-presence")),
  },
  {
    keyword: "skills",
    intent: "show_skills",
    confidence: 0.96,
    steps: [
      { name: "tokenize", detail: "1 token", ms: 2 },
      { name: "classify_intent", detail: "label: show_skills · conf 0.96", ms: 30 },
      { name: "render_neural_map", detail: "27 nodes · 34 edges · 5 groups", ms: 45 },
    ],
    response: "Opening neural map. Hover nodes to explore connections.",
    action: () => window.dispatchEvent(new CustomEvent("show-skills-modal")),
  },
  {
    keyword: "skill",
    intent: "show_skills",
    confidence: 0.96,
    steps: [
      { name: "tokenize", detail: "1 token", ms: 2 },
      { name: "classify_intent", detail: "label: show_skills · conf 0.96", ms: 30 },
      { name: "render_neural_map", detail: "27 nodes · 34 edges · 5 groups", ms: 45 },
    ],
    response: "Opening neural map. Hover nodes to explore connections.",
    action: () => window.dispatchEvent(new CustomEvent("show-skills-modal")),
  },
  {
    keyword: "rate",
    intent: "pricing_query",
    confidence: 0.95,
    steps: [
      { name: "classify_intent", detail: "label: pricing_query · conf 0.95", ms: 28 },
      { name: "retrieve_context", detail: "pricing_card", ms: 12 },
    ],
    response: "$80-120/hr contract · $8-10K/mo full-time. Full stack ownership — architecture to deployed SaaS.",
  },
  {
    keyword: "stack",
    intent: "tech_stack",
    confidence: 0.94,
    steps: [
      { name: "classify_intent", detail: "label: tech_stack · conf 0.94", ms: 30 },
      { name: "retrieve_context", detail: "stack_card", ms: 14 },
    ],
    response: "TypeScript · React · Next.js · Supabase · Claude API · Docker · GitHub Actions · Cloudflare",
  },
  {
    keyword: "availability",
    intent: "availability_check",
    confidence: 0.93,
    steps: [
      { name: "classify_intent", detail: "label: availability_check · conf 0.93", ms: 26 },
      { name: "retrieve_context", detail: "status_card", ms: 10 },
    ],
    response: "Open to opportunities. Available for full-time, contract, or consulting. Gulf/remote preferred.",
  },
  {
    keyword: "impact",
    intent: "browse_impact",
    confidence: 0.92,
    steps: [
      { name: "classify_intent", detail: "label: browse_impact · conf 0.92", ms: 30 },
      { name: "route_to_tool", detail: "→ scroll_to_section", ms: 5 },
      { name: "execute", detail: "target: #mission", ms: 100 },
    ],
    response: "50+ production systems, 100+ teams on OpenEvent, 150+ events managed.",
    action: () => scrollTo("mission"),
  },
  {
    keyword: "experience",
    intent: "browse_experience",
    confidence: 0.93,
    steps: [
      { name: "classify_intent", detail: "label: browse_experience · conf 0.93", ms: 32 },
      { name: "route_to_tool", detail: "→ scroll_to_section", ms: 5 },
      { name: "execute", detail: "target: #log", ms: 100 },
    ],
    response: "Career timeline: Lead AI Dev at More Life Hospitality, Director at Rouelite, Co-Founder at Wadware House.",
    action: () => scrollTo("log"),
  },
  {
    keyword: "help",
    intent: "show_commands",
    confidence: 1.0,
    steps: [
      { name: "introspect", detail: "loading command registry", ms: 18 },
    ],
    response: "Commands: projects · writing · contact · cv · impact · experience · rate · stack · skills · availability · chat · build · tour · call · help",
  },
];

/* ------------------------------------------------------------------ */
/*  Suggestion chips — home page sections                              */
/* ------------------------------------------------------------------ */

// Chips match homepage section scroll order (one line)
// All suggestion chips mapped to section scroll order
const ALL_CHIPS = [
  { label: "Impact", command: "impact", section: "mission" },
  { label: "Projects", command: "projects", section: "projects" },
  { label: "Career", command: "experience", section: "log" },
  { label: "Contact", command: "contact", section: "contact" },
];

const SECTION_ORDER = ["hero", "mission", "projects", "log", "contact"] as const;

/* ------------------------------------------------------------------ */
/*  Section-aware agent personality                                    */
/* ------------------------------------------------------------------ */

interface AgentPersonality {
  dotColor: string;
  glowColor: string;
  hoverLabel: string;
  tooltip: string;
}

const SECTION_PERSONALITY: Record<string, AgentPersonality> = {
  hero: {
    dotColor: "bg-green-400",
    glowColor: "rgba(74,222,128,0.4)",
    hoverLabel: "agent",
    tooltip: "ask me anything — <accent>I'm live</accent>",
  },
  mission: {
    dotColor: "bg-accent",
    glowColor: "rgba(212,168,67,0.4)",
    hoverLabel: "impact",
    tooltip: "50+ systems shipped — <accent>ask me about any</accent>",
  },
  projects: {
    dotColor: "bg-blue-400",
    glowColor: "rgba(96,165,250,0.4)",
    hoverLabel: "explore",
    tooltip: "click any project, then <accent>ask me why</accent>",
  },
  log: {
    dotColor: "bg-purple-400",
    glowColor: "rgba(192,132,252,0.4)",
    hoverLabel: "career",
    tooltip: "been building since 2019 — <accent>ask anything</accent>",
  },
  contact: {
    dotColor: "bg-accent",
    glowColor: "rgba(212,168,67,0.5)",
    hoverLabel: "connect",
    tooltip: "ready when you are — <accent>hire</accent> or <accent>rate</accent>",
  },
};

/* ------------------------------------------------------------------ */
/*  AgentBar — Button / Panel / Flying-to-Chat                        */
/* ------------------------------------------------------------------ */

type UIState = "hidden" | "button" | "panel" | "processing" | "responding" | "flying-to-chat";

/* ------------------------------------------------------------------ */
/*  Visitor memory — persists in sessionStorage                        */
/* ------------------------------------------------------------------ */
const MEMORY_KEY = "agent-visitor-memory";

interface VisitorMemory {
  sectionsViewed: string[];
  commandsUsed: string[];
  projectsOpened: string[];
  visitCount: number;
}

function loadMemory(): VisitorMemory {
  try {
    const raw = sessionStorage.getItem(MEMORY_KEY);
    if (raw) return JSON.parse(raw) as VisitorMemory;
  } catch { /* noop */ }
  return { sectionsViewed: [], commandsUsed: [], projectsOpened: [], visitCount: 0 };
}

function saveMemory(mem: VisitorMemory): void {
  try { sessionStorage.setItem(MEMORY_KEY, JSON.stringify(mem)); } catch { /* noop */ }
}

function recordSection(id: string): void {
  const mem = loadMemory();
  if (!mem.sectionsViewed.includes(id)) {
    mem.sectionsViewed.push(id);
    saveMemory(mem);
  }
}

function recordCommand(keyword: string): void {
  const mem = loadMemory();
  if (!mem.commandsUsed.includes(keyword)) {
    mem.commandsUsed.push(keyword);
    saveMemory(mem);
  }
}

export function AgentBar(): React.ReactElement {
  const router = useRouter();
  const [uiState, setUiState] = useState<UIState>("hidden");
  const [input, setInput] = useState("");
  const [buffer, setBuffer] = useState("");
  const [activeCmd, setActiveCmd] = useState<AgentCommand | null>(null);
  const [shownSteps, setShownSteps] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [showBuildPopup, setShowBuildPopup] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState<string>("ask me anything — <accent>I'm live</accent>");
  const [buttonReady, setButtonReady] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [viewingProject, setViewingProject] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const shownTooltips = useRef<Set<string>>(new Set());

  // Track which section the user is currently viewing
  useEffect(() => {
    let ticking = false;
    const onScroll = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const probeY = window.scrollY + window.innerHeight * 0.5;
        let current = "hero";
        for (const id of SECTION_ORDER) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= probeY) current = id;
        }
        setActiveSection(current);
        recordSection(current);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Context-aware tooltips — show once per section with conversational personality
  useEffect(() => {
    if (uiState !== "button" || !buttonReady) return;
    // Skip hero — boot tooltip already handles it
    if (activeSection === "hero") return;
    const key = `section-${activeSection}`;
    if (shownTooltips.current.has(key)) return;

    const personality = SECTION_PERSONALITY[activeSection];
    if (!personality) return;

    shownTooltips.current.add(key);
    const showTimer = setTimeout(() => {
      setTooltipText(personality.tooltip);
      setShowTooltip(true);
    }, 1800);
    const hideTimer = setTimeout(() => setShowTooltip(false), 8000);

    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, [activeSection, uiState, buttonReady]);

  // Tooltip after a project modal is opened — nudge toward methodology chips
  useEffect(() => {
    if (!viewingProject) return;
    const hasMethodology = !!(PROJECT_METHODOLOGY[viewingProject]?.length);
    if (!hasMethodology) return;
    if (shownTooltips.current.has(`method-${viewingProject}`)) return;
    shownTooltips.current.add(`method-${viewingProject}`);
    const showTimer = setTimeout(() => {
      setTooltipText("ask <accent>why</accent> I built it this way");
      setShowTooltip(true);
    }, 2500);
    const hideTimer = setTimeout(() => setShowTooltip(false), 8500);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, [viewingProject]);

  /* ── Methodology chips per project ── */
  const PROJECT_METHODOLOGY: Record<string, { label: string; command: AgentCommand }[]> = {
    openevent: [
      { label: "Why human-in-the-loop?", command: {
        keyword: "why-hitl", intent: "methodology_query", confidence: 0.97,
        steps: [
          { name: "classify_intent", detail: "label: methodology_query · conf 0.97", ms: 31 },
          { name: "load_principle", detail: "principle_1: trust_boundary", ms: 12 },
          { name: "retrieve_evidence", detail: "openevent: 100+ clients", ms: 28 },
          { name: "compose_response", detail: "linking principle to outcome", ms: 8 },
        ],
        response: "Full automation fails on the first misread. Event coordination is full of ambiguity. I designed AI to handle extraction and proposal — humans approve before anything touches money. That trust boundary is why 100+ clients adopted in 8 months with zero AI errors.",
      }},
      { label: "Why this architecture?", command: {
        keyword: "why-arch", intent: "architecture_query", confidence: 0.95,
        steps: [
          { name: "classify_intent", detail: "label: architecture_query · conf 0.95", ms: 29 },
          { name: "load_principle", detail: "principle_2: architect_first", ms: 14 },
          { name: "retrieve_evidence", detail: "declarative workflows + pgvector", ms: 22 },
        ],
        response: "JSON/YAML workflows so non-engineers can add steps without deploys. pgvector inside Postgres — no separate vector DB, zero sync lag. Every component is replaceable without rewriting the pipeline.",
      }},
      { label: "How was this shipped?", command: {
        keyword: "how-ship", intent: "process_query", confidence: 0.96,
        steps: [
          { name: "classify_intent", detail: "label: process_query · conf 0.96", ms: 26 },
          { name: "load_principle", detail: "principle_6: feature_flags", ms: 10 },
          { name: "retrieve_evidence", detail: "8 months, 100+ clients, zero downtime", ms: 18 },
        ],
        response: "Architecture doc first (3 days). Sprint-based delivery. Every PR through CodeLens. Dark deploy → 10% rollout → full launch. 8 months from zero to 100+ clients with zero-downtime deploys.",
        action: () => window.dispatchEvent(new CustomEvent("show-build-popup")),
      }},
    ],
    codelens: [
      { label: "Why patterns over AI?", command: {
        keyword: "why-patterns", intent: "methodology_query", confidence: 0.96,
        steps: [
          { name: "classify_intent", detail: "label: methodology_query · conf 0.96", ms: 28 },
          { name: "load_principle", detail: "deterministic_first", ms: 11 },
          { name: "retrieve_evidence", detail: "430 patterns, <1s, 8%→100%", ms: 24 },
        ],
        response: "AI catches novel bugs but hallucinates on known ones. 430 hand-crafted patterns from real PRs run in <1s with zero false positives. AI layer runs after — only for what patterns can't express. When Greptile caught 12 issues I missed, I ran a gap analysis and closed all 12. Coverage: 8% → 100%.",
      }},
      { label: "Why build your own?", command: {
        keyword: "why-build-own", intent: "methodology_query", confidence: 0.94,
        steps: [
          { name: "classify_intent", detail: "label: methodology_query · conf 0.94", ms: 30 },
          { name: "load_principle", detail: "principle_4: consumer_producer", ms: 13 },
          { name: "retrieve_evidence", detail: "351KB, zero deps, runs anywhere", ms: 20 },
        ],
        response: "I'm both consumer and producer of dev tooling. SonarQube needs Java + a server. Commercial SaaS sends your code to a third party. CodeLens is one 351KB file — runs as a pre-commit hook, no cloud dependency, no vendor lock-in.",
      }},
    ],
    "gogaa-cli": [
      { label: "Why 11 providers?", command: {
        keyword: "why-providers", intent: "methodology_query", confidence: 0.95,
        steps: [
          { name: "classify_intent", detail: "label: methodology_query · conf 0.95", ms: 27 },
          { name: "load_principle", detail: "no_vendor_lock", ms: 12 },
          { name: "retrieve_evidence", detail: "11 providers, auto-fallback", ms: 19 },
        ],
        response: "If your provider rate-limits, you stop working. I made the provider a variable — 11 providers behind one streaming interface with automatic fallback. When Claude goes down, it switches to GPT. When GPT goes down, it switches to Groq. You never stop working.",
      }},
      { label: "Why build from scratch?", command: {
        keyword: "why-scratch", intent: "methodology_query", confidence: 0.93,
        steps: [
          { name: "classify_intent", detail: "label: methodology_query · conf 0.93", ms: 32 },
          { name: "load_principle", detail: "principle_4: consumer_producer", ms: 14 },
          { name: "retrieve_evidence", detail: "1,400+ tests, WAL persistence", ms: 21 },
        ],
        response: "Forking means inheriting vendor assumptions. Wrapping means fighting their architecture. I built from scratch so every subsystem — provider, TUI, git, tools, session — is first-class and swappable. 1,400+ tests prove it works.",
      }},
    ],
    rasad: [
      { label: "Why local-first?", command: {
        keyword: "why-local", intent: "methodology_query", confidence: 0.96,
        steps: [
          { name: "classify_intent", detail: "label: methodology_query · conf 0.96", ms: 25 },
          { name: "load_principle", detail: "principle_3: strict_boundaries", ms: 11 },
          { name: "retrieve_evidence", detail: "zero outbound requests", ms: 16 },
        ],
        response: "AI session data contains your code, your prompts, your costs. That data should never leave your machine. Rasad runs 100% local — SQLite, localhost API, zero outbound requests. Your observability data stays yours.",
      }},
      { label: "Why unified observatory?", command: {
        keyword: "why-unified", intent: "methodology_query", confidence: 0.94,
        steps: [
          { name: "classify_intent", detail: "label: methodology_query · conf 0.94", ms: 29 },
          { name: "retrieve_evidence", detail: "4 tools, 656 sessions, one dashboard", ms: 23 },
        ],
        response: "Billing dashboards show cost, not behavior. Custom logging means modifying each tool. Rasad reads session files directly from Claude Code, Gogaa, and Codex — one dashboard for 656 sessions, 38K messages, 14K tool calls. No tool modifications needed.",
      }},
    ],
  };

  // Filter chips: show sections ahead of scroll + contextual suggestions based on visitor memory
  const currentIdx = SECTION_ORDER.indexOf(activeSection as typeof SECTION_ORDER[number]);
  const mem = loadMemory();

  // When viewing a project, show methodology chips instead of section chips
  const methodologyChips = viewingProject ? PROJECT_METHODOLOGY[viewingProject] ?? [] : [];

  const baseChips = methodologyChips.length > 0 ? [] : ALL_CHIPS.filter((chip) => {
    const chipIdx = SECTION_ORDER.indexOf(chip.section as typeof SECTION_ORDER[number]);
    return chipIdx > currentIdx;
  });
  // Add contextual chips based on what visitor has explored
  const contextChips: { label: string; command: string; section: string }[] = [];
  if (!viewingProject) {
    if (mem.sectionsViewed.includes("projects") && !mem.commandsUsed.includes("build")) {
      contextChips.push({ label: "How I ship", command: "build", section: "" });
    }
    if (mem.sectionsViewed.includes("contact") && !mem.commandsUsed.includes("cv")) {
      contextChips.push({ label: "View CV", command: "cv", section: "" });
    }
    if (mem.commandsUsed.length >= 3 && !mem.commandsUsed.includes("chat")) {
      contextChips.push({ label: "Ask anything", command: "chat", section: "" });
    }
    if (!mem.commandsUsed.includes("tour") && mem.sectionsViewed.length >= 3) {
      contextChips.push({ label: "Full journey", command: "tour", section: "" });
    }
  }
  const visibleChips = [...baseChips, ...contextChips].slice(0, 5);

  // Listen for build popup trigger
  useEffect(() => {
    const handler = (): void => setShowBuildPopup(true);
    window.addEventListener("show-build-popup", handler);
    return () => window.removeEventListener("show-build-popup", handler);
  }, []);

  // Track project modal opens for visitor memory + set viewing context
  useEffect(() => {
    const onOpen = (e: Event): void => {
      const slug = (e as CustomEvent<string>).detail;
      if (slug) {
        setViewingProject(slug);
        const m = loadMemory();
        if (!m.projectsOpened.includes(slug)) {
          m.projectsOpened.push(slug);
          saveMemory(m);
        }
      }
    };
    const onClose = (): void => setViewingProject(null);
    window.addEventListener("project-opened", onOpen);
    // Listen for modal close via body attribute change
    const obs = new MutationObserver(() => {
      if (document.body.getAttribute("data-modal-open") !== "true") {
        setViewingProject(null);
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-modal-open"] });
    return () => { window.removeEventListener("project-opened", onOpen); obs.disconnect(); };
  }, []);

  // Listen for agent-button-ready from boot animation
  useEffect(() => {
    const onReady = (): void => {
      setButtonReady(true);
      setUiState("button");
      // Show tooltip after all hero content has fully streamed in
      setTimeout(() => setShowTooltip(true), 4000);
      setTimeout(() => setShowTooltip(false), 10000);
    };
    window.addEventListener("agent-button-ready", onReady);

    // If boot was already seen (returning visitor), show button immediately
    if (sessionStorage.getItem("boot-complete") === "1") {
      setButtonReady(true);
      setUiState("button");
    }

    return () => window.removeEventListener("agent-button-ready", onReady);
  }, []);

  // Listen for replay-intro to hide button
  useEffect(() => {
    const onReplay = (): void => {
      setUiState("hidden");
      setButtonReady(false);
    };
    window.addEventListener("replay-intro", onReplay);
    return () => window.removeEventListener("replay-intro", onReplay);
  }, []);

  // Hide agent when chat widget is open
  const [chatOpen, setChatOpen] = useState(false);
  useEffect(() => {
    const onChatOpen = (): void => setChatOpen(true);
    const onChatClose = (): void => setChatOpen(false);
    window.addEventListener("open-chat-widget", onChatOpen);
    window.addEventListener("close-chat-widget", onChatClose);
    return () => {
      window.removeEventListener("open-chat-widget", onChatOpen);
      window.removeEventListener("close-chat-widget", onChatClose);
    };
  }, []);

  // Global keystroke buffer — typing anywhere triggers commands
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      // Escape closes panel from anywhere (even when input is focused)
      if (e.key === "Escape" && (uiState === "panel" || uiState === "processing" || uiState === "responding")) {
        e.preventDefault();
        setActiveCmd(null);
        setShownSteps(0);
        setShowResponse(false);
        setInput("");
        setUiState("button");
        return;
      }

      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // "/" focuses the panel
      if (e.key === "/" && uiState !== "processing" && uiState !== "responding" && uiState !== "flying-to-chat") {
        e.preventDefault();
        setUiState("panel");
        setTimeout(() => inputRef.current?.focus(), 100);
        return;
      }

      if (e.key.length !== 1) return;
      if (uiState === "processing" || uiState === "responding" || uiState === "flying-to-chat") return;

      setBuffer((prev) => {
        const next = (prev + e.key.toLowerCase()).slice(-12);
        const match = commands.find((c) => next.endsWith(c.keyword));
        if (match) {
          runCommand(match);
          return "";
        }
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [uiState]);

  // Stage the steps one-by-one during processing
  useEffect(() => {
    if (uiState !== "processing" || !activeCmd) return;
    if (shownSteps >= activeCmd.steps.length) {
      const t = setTimeout(() => {
        setShowResponse(true);
        setUiState("responding");
      }, 220);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setShownSteps((n) => n + 1),
      activeCmd.steps[shownSteps].ms + 120,
    );
    return () => clearTimeout(t);
  }, [uiState, activeCmd, shownSteps]);

  // Clean up nav timer on unmount
  useEffect(() => () => { if (navTimerRef.current) clearTimeout(navTimerRef.current); }, []);

  // After response, keep panel visible until user interacts (mouse move / click / scroll)
  // Commands with navigation actions (scroll/navigate) auto-dismiss after a brief read delay
  useEffect(() => {
    if (uiState !== "responding" || !activeCmd) return;

    // Chat command — fly to chat widget (separate flow)
    if (activeCmd.keyword === "chat") {
      const flyTimer = setTimeout(() => {
        setUiState("flying-to-chat");
      }, 800);
      return () => clearTimeout(flyTimer);
    }

    const cmd = activeCmd;
    const hasAction = !!cmd.action || cmd.keyword === "tour";

    const dismiss = (): void => {
      setActiveCmd(null);
      setShownSteps(0);
      setShowResponse(false);
      setInput("");
      setUiState("button");
      // Fire navigation action after panel closes
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
      navTimerRef.current = setTimeout(() => {
        if (cmd.keyword === "tour") router.push("/journey");
        else cmd.action?.();
      }, 400);
    };

    // For commands with a navigation action, auto-dismiss after 2s read time
    // For info-only commands (rate, stack, availability), wait for user interaction
    let autoTimer: ReturnType<typeof setTimeout> | undefined;
    if (hasAction) {
      autoTimer = setTimeout(dismiss, 2000);
    }

    // Always dismiss on mouse move, click, or scroll (after a 600ms grace period)
    let armed = false;
    const armTimer = setTimeout(() => { armed = true; }, 600);

    const onInteract = (): void => {
      if (!armed) return;
      dismiss();
    };

    window.addEventListener("mousemove", onInteract, { once: true });
    window.addEventListener("click", onInteract, { once: true });
    window.addEventListener("scroll", onInteract, { once: true, passive: true });

    return () => {
      clearTimeout(armTimer);
      if (autoTimer) clearTimeout(autoTimer);
      window.removeEventListener("mousemove", onInteract);
      window.removeEventListener("click", onInteract);
      window.removeEventListener("scroll", onInteract);
    };
  }, [uiState, activeCmd]);

  // Reappear as button after being hidden (post-command)
  useEffect(() => {
    if (uiState !== "hidden" || !buttonReady) return;
    const t = setTimeout(() => setUiState("button"), 3000);
    return () => clearTimeout(t);
  }, [uiState, buttonReady]);

  // Flying-to-chat animation completion — glow the chat trigger, then open chat
  useEffect(() => {
    if (uiState !== "flying-to-chat") return;
    // Fire glow at ~85% through animation (bubble reaches chat button)
    const glowTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("agent-flying-to-chat"));
    }, 850);
    // Open chat after bubble fully absorbed
    const openTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-chat-widget"));
      setActiveCmd(null);
      setShownSteps(0);
      setShowResponse(false);
      setInput("");
      setUiState("button");
    }, 1100);
    return () => {
      clearTimeout(glowTimer);
      clearTimeout(openTimer);
    };
  }, [uiState]);

  const runCommand = useCallback((cmd: AgentCommand): void => {
    recordCommand(cmd.keyword);
    setActiveCmd(cmd);
    setShownSteps(0);
    setShowResponse(false);
    setUiState("processing");
  }, []);

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const q = input.trim().toLowerCase();
    if (!q) return;
    // 1. Exact keyword match — instant
    const exact = commands.find((c) => c.keyword === q);
    if (exact) { runCommand(exact); return; }
    // 2. Fuzzy intent match — instant
    const fuzzy = fuzzyMatch(q, commands);
    if (fuzzy) { runCommand(fuzzy.command); return; }
    // 3. LLM classification — async, with real pipeline timings
    classifyWithLLM(q);
  };

  const classifyWithLLM = useCallback(async (query: string): Promise<void> => {
    const t0 = performance.now();

    // Show "thinking" state with first step
    const thinkingCmd: AgentCommand = {
      keyword: query,
      intent: "classifying",
      confidence: 0,
      steps: [
        { name: "tokenize", detail: `${query.split(/\s+/).length} tokens`, ms: 3 },
        { name: "classify_intent", detail: "llm: llama-3.3-70b", ms: 0 },
      ],
      response: "",
    };
    setActiveCmd(thinkingCmd);
    setShownSteps(0);
    setShowResponse(false);
    setUiState("processing");

    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = (await res.json()) as {
        command: string | null;
        confidence: number;
        response?: string;
      };
      const classifyMs = Math.round(performance.now() - t0);

      if (data.command) {
        // LLM mapped to a known command — run it with real timings
        const matched = commands.find((c) => c.keyword === data.command);
        if (matched) {
          runCommand({
            ...matched,
            confidence: data.confidence,
            steps: [
              { name: "tokenize", detail: `${query.split(/\s+/).length} tokens`, ms: 3 },
              { name: "classify_intent", detail: `llm: ${data.command} · conf ${data.confidence.toFixed(2)}`, ms: classifyMs },
              ...(matched.steps.slice(1)),
            ],
          });
          return;
        }
      }

      // No command matched — show branded redirect response
      const response = data.response || "Ahtesham works across a wide range of tech. Book a quick call to discuss.";
      runCommand({
        keyword: query,
        intent: "redirect",
        confidence: data.confidence,
        steps: [
          { name: "tokenize", detail: `${query.split(/\s+/).length} tokens`, ms: 3 },
          { name: "classify_intent", detail: `llm: no exact match · conf ${data.confidence.toFixed(2)}`, ms: classifyMs },
          { name: "compose_redirect", detail: "→ personal response", ms: 8 },
        ],
        response,
        action: () => scrollTo("contact"),
      });
    } catch {
      // Network error — graceful fallback
      runCommand({
        keyword: query,
        intent: "offline_redirect",
        confidence: 0,
        steps: [
          { name: "classify_intent", detail: "agent offline", ms: 0 },
        ],
        response: "Agent is thinking slower than usual. Try 'projects', 'rate', or 'cv' — or book a call to talk directly.",
      });
    }
  }, [runCommand]);

  const onChipClick = (command: string): void => {
    const match = commands.find((c) => c.keyword === command);
    if (match) runCommand(match);
  };

  if (uiState === "hidden" || chatOpen) return <></>;

  const totalMs = activeCmd?.steps.reduce((s, x) => s + x.ms, 0) ?? 0;

  return (
    <>
      {/* ── Agent Button (pill at bottom center) ── */}
      <AnimatePresence>
        {uiState === "button" && buttonReady && (
          <>
            {/* Tooltip — wrapper centers, inner animates */}
            <AnimatePresence>
              {showTooltip && (
                <div className="fixed z-[101] bottom-[68px] left-1/2 -translate-x-1/2 pointer-events-none">
                  {/* Entrance/exit wrapper */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Pulsing inner — breathes to grab attention */}
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        y: [0, -3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="font-mono text-small text-foreground whitespace-nowrap px-4 py-2 rounded-xl bg-card border border-accent/30 shadow-lg relative"
                      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.15), 0 0 15px var(--accent-glow)" }}
                    >
                      <span dangerouslySetInnerHTML={{ __html: tooltipText.replace(/<accent>/g, '<span class="text-accent">').replace(/<\/accent>/g, '</span>') }} />
                      <span className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-card border-r border-b border-accent/30 rotate-45" />
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Button — section-aware pulsing dot, transforms per context */}
            <div className="fixed z-[100] bottom-5 left-1/2 -translate-x-1/2">
              {(() => {
                const p = SECTION_PERSONALITY[activeSection] ?? SECTION_PERSONALITY.hero;
                return (
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowTooltip(false);
                      setUiState("panel");
                      setTimeout(() => inputRef.current?.focus(), 150);
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                    className="group flex items-center cursor-pointer glass rounded-full p-2.5 hover:px-4 hover:gap-2 transition-all duration-300"
                    style={{
                      boxShadow: `0 4px 12px rgba(0,0,0,0.12), 0 0 8px ${p.glowColor}`,
                    }}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${p.dotColor} shrink-0 transition-colors duration-700`}
                      style={{ animation: "green-pulse 2s infinite" }}
                    />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-[80px] transition-all duration-300 whitespace-nowrap font-mono text-small text-muted/60">
                      {p.hoverLabel}
                    </span>
                  </motion.button>
                );
              })()}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ── Panel (expanded command bar) ── */}
      <AnimatePresence>
        {(uiState === "panel" || uiState === "processing" || uiState === "responding") && (
          <div className="fixed z-[100] bottom-5 left-1/2 -translate-x-1/2 w-[calc(100vw-1.5rem)] max-w-[620px]">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Response area (when processing/responding) */}
            <AnimatePresence>
              {(uiState === "processing" || uiState === "responding") && activeCmd && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                  className="mb-2 rounded-xl glass-strong overflow-hidden"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
                >
                  <div className="px-4 py-3 font-mono text-small space-y-1">
                    <p className="text-caption font-mono text-accent uppercase tracking-wider mb-2">
                      shami.agent
                    </p>
                    <p className="text-foreground/80">
                      <span className="text-accent">&#10095; parse</span>
                      <span className="text-muted/60">(&ldquo;</span>
                      <span className="text-foreground">{activeCmd.keyword}</span>
                      <span className="text-muted/60">&rdquo;)</span>
                    </p>

                    {activeCmd.steps.slice(0, shownSteps).map((s, i) => {
                      const isLast = i === activeCmd.steps.length - 1;
                      return (
                        <motion.div
                          key={s.name}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex items-baseline gap-2"
                        >
                          <span className="text-muted/40">{isLast ? "└─" : "├─"}</span>
                          <span className="text-foreground/80">{s.name}</span>
                          <span className="text-green-400 ml-auto shrink-0">&#10003;</span>
                          <span className="text-muted/40 text-caption tabular-nums">{s.ms}ms</span>
                        </motion.div>
                      );
                    })}

                    <AnimatePresence>
                      {showResponse && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                          className="pt-2 mt-2 border-t border-card-border/60"
                        >
                          <p className="text-foreground leading-relaxed">
                            <span className="text-accent">&#10095; response</span>
                            <span className="text-muted/60">:</span>{" "}
                            <span>{activeCmd.response}</span>
                          </p>
                          <p className="text-caption text-muted/40 mt-1 tabular-nums">
                            completed in {totalMs}ms
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suggestion chips — methodology chips when viewing project, section chips otherwise */}
            <AnimatePresence>
              {uiState === "panel" && !activeCmd && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center gap-1.5 mb-2 flex-wrap px-2"
                >
                  {methodologyChips.length > 0
                    ? methodologyChips.map((mc, i) => (
                        <motion.button
                          key={mc.command.keyword}
                          type="button"
                          onClick={() => runCommand(mc.command)}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                          className="px-3 py-1.5 rounded-full glass text-small font-mono text-green-400/70 border-green-500/20 hover:text-green-400 hover:border-green-500/40 hover:bg-green-500/5 transition-all cursor-pointer"
                        >
                          {mc.label}
                        </motion.button>
                      ))
                    : visibleChips.map((chip, i) => (
                        <motion.button
                          key={chip.command}
                          type="button"
                          onClick={() => onChipClick(chip.command)}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                          className="px-3 py-1.5 rounded-full glass text-small font-mono text-muted/70 hover:text-accent hover:border-accent/30 transition-all cursor-pointer"
                        >
                          {chip.label}
                        </motion.button>
                      ))
                  }
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input bar */}
            <form
              onSubmit={onSubmit}
              className="glass-strong rounded-xl overflow-hidden"
              style={{
                boxShadow: "0 4px 30px rgba(0,0,0,0.5), 0 0 60px rgba(0,0,0,0.2)",
              }}
            >
              <div className="flex items-center gap-2 px-4 py-3">
                <span className="text-accent font-mono text-body font-semibold shrink-0">&#10095;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="ask anything..."
                  disabled={uiState === "processing" || uiState === "responding"}
                  className="flex-1 min-w-0 bg-transparent outline-none font-mono text-small placeholder:text-muted/35 text-foreground disabled:opacity-50"
                />
                {!input && (
                  <span className="hidden sm:flex items-center gap-1 shrink-0 font-mono text-caption text-muted/30">
                    writing · cv · rate · skills · chat · help
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setActiveCmd(null);
                    setShownSteps(0);
                    setShowResponse(false);
                    setInput("");
                    setUiState("button");
                  }}
                  aria-label="Close agent panel"
                  className="text-muted/40 hover:text-foreground shrink-0 transition-colors cursor-pointer ml-1"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Flying-to-chat bubble animation ── */}
      <AnimatePresence>
        {uiState === "flying-to-chat" && (
          <motion.div
            ref={flyRef}
            className="fixed z-[100]"
            initial={{
              /* Center-bottom: same position as agent button */
              bottom: 20,
              left: (typeof window !== "undefined" ? window.innerWidth / 2 : 500) - 22,
              width: 44,
              height: 44,
              borderRadius: 9999,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              /* Land exactly on chat trigger: right-5 = 20px from right, w-11 = 44px */
              bottom: 20,
              left: (typeof window !== "undefined" ? window.innerWidth : 1000) - 20 - 44,
              width: 44,
              height: 44,
              borderRadius: 9999,
              opacity: [1, 1, 1, 0.9, 0],
              scale: [1, 1.15, 1, 0.8, 0.2],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 1,
              ease: [0.25, 0.1, 0.25, 1],
              left: { duration: 1, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 1, times: [0, 0.2, 0.6, 0.85, 1] },
              scale: { duration: 1, times: [0, 0.15, 0.5, 0.85, 1] },
            }}
          >
            {/* Inner glowing orb */}
            <motion.div
              className="w-full h-full rounded-full"
              style={{
                background: "radial-gradient(circle at 40% 40%, rgba(74,222,128,0.9) 0%, rgba(74,222,128,0.5) 40%, rgba(74,222,128,0.15) 70%, transparent 100%)",
                boxShadow: "0 0 20px rgba(74,222,128,0.6), 0 0 40px rgba(74,222,128,0.3), 0 0 80px rgba(74,222,128,0.15), inset 0 0 15px rgba(74,222,128,0.3)",
                border: "1.5px solid rgba(74,222,128,0.5)",
              }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(74,222,128,0.6), 0 0 40px rgba(74,222,128,0.3), 0 0 80px rgba(74,222,128,0.15), inset 0 0 15px rgba(74,222,128,0.3)",
                  "0 0 30px rgba(74,222,128,0.8), 0 0 60px rgba(74,222,128,0.4), 0 0 100px rgba(74,222,128,0.2), inset 0 0 20px rgba(74,222,128,0.4)",
                  "0 0 15px rgba(74,222,128,0.5), 0 0 30px rgba(74,222,128,0.2), 0 0 60px rgba(74,222,128,0.1), inset 0 0 10px rgba(74,222,128,0.2)",
                ],
              }}
              transition={{ duration: 1, times: [0, 0.5, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Build pipeline popup */}
      <AnimatePresence>
        {showBuildPopup && (
          <BuildPopup onDone={() => setShowBuildPopup(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
