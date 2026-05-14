/* ── Agent Commands — pure data & logic, no React ── */

import { openCvDrawer } from "@/components/cv-drawer";

declare global {
  // eslint-disable-next-line no-var
  var __agentScrolling: boolean | undefined;
}

export interface AgentStep {
  name: string;
  detail: string;
  ms: number;
}

export interface AgentCommand {
  keyword: string;
  label?: string;
  intent: string;
  confidence: number;
  steps: AgentStep[];
  response: string;
  action?: () => void;
  // routeToChat removed — unified agent handles all queries inline
}

export function scrollTo(id: string): void {
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

export interface FuzzyMatch {
  command: AgentCommand;
  score: number;
}

export const PROJECT_KEYWORDS: Record<string, string[]> = {
  projects: ["show me your projects", "your projects", "portfolio", "what you built", "what have you built"],
  openevent: ["event", "management", "booking", "openevent", "open event", "client", "crm", "invoice", "email automation", "event platform"],
  codelens: ["code review", "lint", "pattern", "bug", "security", "pr review", "codelens", "code lens", "static analysis", "code quality"],
  gogaa: ["coding agent", "ai coding", "terminal agent", "provider", "gogaa", "llm tool", "ai cli", "coding cli"],
  rasad: ["observability", "session analytics", "cost tracking", "token usage", "rasad", "monitoring ai", "ai observatory", "session replay"],
  rate: ["rate", "price", "pricing", "cost", "charge", "budget", "hourly", "salary", "pay", "compensation", "how much", "expensive", "fee", "quote"],
  hire: ["hire", "hiring", "recruit", "work with", "engage", "freelance", "contract", "full-time", "looking for", "need a developer", "need an engineer"],
  cv: ["resume", "cv", "qualification", "education", "degree"],
  contact: ["contact", "reach", "email", "call", "talk", "connect", "meet", "book a call", "get in touch"],
  chat: ["chat", "question", "explain", "help me", "more info", "tell me more"],
  build: ["build process", "ship", "deliver", "methodology", "how do you work", "development process"],
  tour: ["tour", "journey", "story", "who are you", "about you", "about yourself", "what do you do"],
  stack: ["stack", "tools", "framework", "language", "react", "typescript", "supabase", "next", "python", "docker", "react native"],
  availability: ["available", "availability", "when can you start", "timeline", "capacity", "schedule"],
  impact: ["impact", "results", "numbers", "metrics", "achievement"],
  experience: ["career", "worked at", "work at", "work in", "worked in", "company", "job history", "role", "position", "years of experience", "your work", "rouelite", "rouelite techno", "more life", "more life hospitality", "wadware", "wadware house", "outlier", "rws", "translated"],
  skills: ["skills", "tech stack", "technology", "what do you know", "expertise", "proficient", "capable"],
  agent: ["what is this", "what are you", "who are you", "what can you do", "what's this agent", "what is this agent", "what does this do", "how does this work", "what's the purpose", "purpose of this", "use of this", "what's this for", "help", "what can i do", "what can i ask", "instructions", "guide", "how to use"],
};

// Common words that should NOT count as meaningful token matches
const STOP_WORDS = new Set(["the","a","an","is","are","was","were","do","does","did","how","what","why","who","when","where","can","you","your","his","her","its","my","our","their","this","that","with","for","from","have","has","had","not","but","and","or","if","in","on","at","to","of","by","about","more","any","all","also","just","very","too"]);

export function fuzzyMatch(query: string, cmds: AgentCommand[]): FuzzyMatch | null {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter((t) => t.length >= 3 && !STOP_WORDS.has(t));

  let best: FuzzyMatch | null = null;

  for (const [keyword, phrases] of Object.entries(PROJECT_KEYWORDS)) {
    let score = 0;
    for (const phrase of phrases) {
      // Full phrase match — high confidence
      if (q.includes(phrase)) {
        score += phrase.split(/\s+/).length * 3;
      } else {
        // Token match — only meaningful tokens, require length >= 4
        for (const token of tokens) {
          if (token.length >= 4 && phrase.includes(token)) score += 1;
        }
      }
    }
    if (score > 0) {
      const cmd = cmds.find((c) => c.keyword === keyword);
      if (cmd && (!best || score > best.score)) {
        best = { score, command: { ...cmd, confidence: Math.min(0.95, 0.6 + score * 0.05) } };
      }
    }
  }

  // Raise threshold — need strong signal to match
  return best && best.score >= 3 ? best : null;
}

export const commands: AgentCommand[] = [
  {
    keyword: "whoami",
    intent: "identity_query",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: identity_query · conf 0.99", ms: 8 },
      { name: "retrieve_context", detail: "identity_card", ms: 12 },
    ],
    response: "Ahtesham Ahmad — Full-Stack + AI Engineer. Islamabad, remote-first.",
    action: () => window.dispatchEvent(new CustomEvent("show-whoami")),
  },
  {
    keyword: "hi",
    intent: "greeting",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: greeting · conf 0.99", ms: 12 },
    ],
    response: "Hey! I'm Ahtesham's portfolio agent. Try: projects, rate, skills, or just ask anything.",
  },
  {
    keyword: "hello",
    intent: "greeting",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: greeting · conf 0.99", ms: 12 },
    ],
    response: "Hey! I'm Ahtesham's portfolio agent. Try: projects, rate, skills, or just ask anything.",
  },
  {
    keyword: "hey",
    intent: "greeting",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: greeting · conf 0.99", ms: 12 },
    ],
    response: "Hey! I'm Ahtesham's portfolio agent. Try: projects, rate, skills, or just ask anything.",
  },
  {
    keyword: "agent",
    intent: "meta_query",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: meta_query · conf 0.99", ms: 5 },
      { name: "load_context", detail: "agent_identity", ms: 8 },
    ],
    response: "I'm Ahtesham's portfolio agent — built into this site. I can show you his projects, explain his architecture decisions, share his rates and availability, walk you through his career, or answer anything about his work. Try: projects, rate, hire, skills, or ask a question.",
  },
  {
    keyword: "help",
    intent: "meta_query",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: meta_query · conf 0.99", ms: 5 },
    ],
    response: "Here's what I can do: projects → see what he's built, rate → pricing, hire → work together, skills → tech stack, whoami → quick bio, tour → his journey. Or just ask a question — I'll answer it.",
  },
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
      { name: "activate_thread", detail: "switching to conversational mode", ms: 8 },
    ],
    response: "Thread mode active. Ask anything — I have full context on Ahtesham's work.",
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
    response: "4 flagship projects + 5 side projects below. Click any card for the full case study.",
    action: () => scrollTo("projects"),
  },
  {
    keyword: "openevent",
    intent: "project_detail",
    confidence: 0.97,
    steps: [
      { name: "classify_intent", detail: "label: project_detail · conf 0.97", ms: 24 },
      { name: "retrieve_context", detail: "openevent: 100+ clients", ms: 18 },
    ],
    response: "OpenEvent — AI event management SaaS. Emails come in, AI classifies and extracts entities, humans approve, workflows execute. 100+ clients, 150+ events, saves 1.5hrs/day per team. Ask me more about it.",
    action: () => scrollTo("projects"),
  },
  {
    keyword: "codelens",
    intent: "project_detail",
    confidence: 0.97,
    steps: [
      { name: "classify_intent", detail: "label: project_detail · conf 0.97", ms: 24 },
      { name: "retrieve_context", detail: "codelens: 430 patterns", ms: 16 },
    ],
    response: "CodeLens — AI code review engine. 430 hand-crafted patterns, source-to-sink taint tracking, sub-second scans. Single 351KB file, zero deps. Currently private beta. Ask me more about it.",
    action: () => scrollTo("projects"),
  },
  {
    keyword: "gogaa",
    intent: "project_detail",
    confidence: 0.97,
    steps: [
      { name: "classify_intent", detail: "label: project_detail · conf 0.97", ms: 24 },
      { name: "retrieve_context", detail: "gogaa: 11 providers", ms: 14 },
    ],
    response: "Gogaa CLI — open-source AI coding agent. 11 LLM providers with auto-fallback, full Claude Code UI parity, 1,400+ tests, React Ink TUI. Ask me more about it.",
    action: () => scrollTo("projects"),
  },
  {
    keyword: "rasad",
    intent: "project_detail",
    confidence: 0.97,
    steps: [
      { name: "classify_intent", detail: "label: project_detail · conf 0.97", ms: 24 },
      { name: "retrieve_context", detail: "rasad: 656 sessions", ms: 12 },
    ],
    response: "Rasad — AI session observatory. 656 sessions across 4 tools, X-Ray replay, quality grading A-F. 100% local, zero outbound requests. Ask me more about it.",
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
    keyword: "dance",
    intent: "easter_egg",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: easter_egg · conf 0.99", ms: 5 },
      { name: "activate_mood", detail: "mood: dancing", ms: 3 },
    ],
    response: "Can't stop, won't stop.",
    action: () => window.dispatchEvent(new CustomEvent("emoji-mood", { detail: "dancing" })),
  },
  {
    keyword: "sleep",
    intent: "easter_egg",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: easter_egg · conf 0.99", ms: 5 },
      { name: "activate_mood", detail: "mood: sleeping", ms: 3 },
    ],
    response: "zzz... wake me when you need me.",
    action: () => window.dispatchEvent(new CustomEvent("emoji-mood", { detail: "sleeping" })),
  },
  {
    keyword: "surprise",
    intent: "easter_egg",
    confidence: 0.99,
    steps: [
      { name: "classify_intent", detail: "label: easter_egg · conf 0.99", ms: 5 },
      { name: "activate_mood", detail: "mood: surprised", ms: 3 },
    ],
    response: "Wait — you found this?!",
    action: () => window.dispatchEvent(new CustomEvent("emoji-mood", { detail: "surprised" })),
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
      { name: "retrieve_context", detail: "pricing_table", ms: 14 },
    ],
    response: "Contract: $80-120/hr. Project-based: from $3k. Full-time: $4k-10k/mo. Rates vary by scope — best to discuss on a 15-min call.",
  },
  {
    keyword: "stack",
    intent: "tech_stack",
    confidence: 0.94,
    steps: [
      { name: "classify_intent", detail: "label: tech_stack · conf 0.94", ms: 30 },
      { name: "retrieve_context", detail: "stack_inventory", ms: 18 },
    ],
    response: "AI: Claude, OpenAI, RAG (pgvector), multi-agent orchestration. Full-stack: React, Next.js, TypeScript, Python, Supabase, Stripe, Docker. Infra: GitHub Actions, Traefik, Cloudflare.",
  },
  {
    keyword: "availability",
    intent: "availability_check",
    confidence: 0.93,
    steps: [
      { name: "classify_intent", detail: "label: availability_check · conf 0.93", ms: 26 },
      { name: "retrieve_context", detail: "availability_status", ms: 10 },
    ],
    response: "Open to full-time remote roles and 90-day project engagements. UTC+5, overlaps EU mornings + Gulf business hours. Can start within a week.",
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
    action: () => scrollTo("projects"),
  },
  {
    keyword: "experience",
    intent: "career_query",
    confidence: 0.95,
    steps: [
      { name: "classify_intent", detail: "label: career_query · conf 0.95", ms: 28 },
      { name: "retrieve_context", detail: "career_timeline", ms: 16 },
    ],
    response: "Lead AI Developer at More Life Hospitality (2025–now). Director IT at Rouelite Techno (2022–2024). AI Consultant at Wadware House (2019–now). 250+ projects, 40+ returning clients.",
    action: () => scrollTo("log"),
  },
  {
    keyword: "career",
    intent: "browse_career",
    confidence: 0.93,
    steps: [
      { name: "classify_intent", detail: "label: browse_career · conf 0.93", ms: 32 },
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
    response: "Navigate: projects · impact · experience · contact · cv · skills · build · tour. Or just ask anything — I have full context.",
  },
];

/* ------------------------------------------------------------------ */
/*  Suggestion chips — home page sections                              */
/* ------------------------------------------------------------------ */

// Chips match homepage section scroll order (one line)
// All suggestion chips mapped to section scroll order
export const ALL_CHIPS = [
  { label: "Projects", command: "projects", section: "projects" },
  { label: "Career", command: "career", section: "log" },
  { label: "Contact", command: "contact", section: "contact" },
];

export const SECTION_ORDER = ["hero", "projects", "log", "contact"] as const;

/* ------------------------------------------------------------------ */
/*  Section-aware agent personality                                    */
/* ------------------------------------------------------------------ */

export interface AgentPersonality {
  dotColor: string;
  glowColor: string;
  hoverLabel: string;
}

export const SECTION_PERSONALITY: Record<string, AgentPersonality> = {
  hero: {
    dotColor: "bg-green-400",
    glowColor: "rgba(74,222,128,0.4)",
    hoverLabel: "agent",
  },
  projects: {
    dotColor: "bg-blue-400",
    glowColor: "rgba(96,165,250,0.4)",
    hoverLabel: "explore",
  },
  log: {
    dotColor: "bg-purple-400",
    glowColor: "rgba(192,132,252,0.4)",
    hoverLabel: "career",
  },
  contact: {
    dotColor: "bg-accent",
    glowColor: "rgba(160,120,104,0.5)",
    hoverLabel: "connect",
  },
};

/* ── Section-specific chips & methodology ── */

export const PROJECT_METHODOLOGY: Record<string, { label: string; command: AgentCommand }[]> = {
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

export const SECTION_CHIPS: Record<string, { label: string; command: string }[]> = {
  hero: [
    { label: "whoami", command: "whoami" },
    { label: "Projects", command: "projects" },
    { label: "How I ship", command: "build" },
  ],
  projects: [
    { label: "Skills", command: "skills" },
    { label: "Chat", command: "chat" },
    { label: "See career →", command: "career" },
  ],
  log: [
    { label: "Rate", command: "rate" },
    { label: "Full journey", command: "tour" },
    { label: "Get in touch →", command: "contact" },
  ],
  contact: [
    { label: "Book a call", command: "call" },
    { label: "Availability", command: "availability" },
    { label: "View CV", command: "cv" },
  ],
};

export const SECTION_INPUT: Record<string, { placeholder: string }> = {
  hero: { placeholder: "ask anything about Ahtesham's work..." },
  projects: { placeholder: "ask about any project..." },
  log: { placeholder: "ask about experience..." },
  contact: { placeholder: "ask about availability, rate..." },
};
