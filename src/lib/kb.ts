/** Knowledge base for the portfolio chat widget. Each entry has keywords
 *  scored against the user query; highest-scoring entry wins.
 *  Uses word-boundary matching (so "hi" doesn't match "which"). */

const BOOK_URL = "https://ahtesham.dev.wadwarehouse.com/book";

export interface KbAction {
  label: string;
  href?: string;
  event?: string; // dispatches window custom event
}

export interface KbEntry {
  id: string;
  keywords: string[];
  response: string;
  tags?: string[];
  actions?: KbAction[];
}

export const starters = [
  "What's your rate?",
  "Which stack do you use?",
  "Tell me about CodeLens",
  "Tell me about Rasad",
  "Are you available right now?",
  "How do you work with clients?",
];

export const kb: KbEntry[] = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "hola", "greetings", "good morning", "good evening", "howdy"],
    response:
      "Hey. I'm an AI interface to Ahtesham's work. Ask me about his rate, stack, tools, projects, or availability.",
    tags: ["intro"],
  },
  {
    id: "identity",
    keywords: ["who are you", "what is this", "what is", "who", "about you", "introduce"],
    response:
      "I'm a scoped AI assistant trained on Ahtesham Ahmad's portfolio. AI engineer and Lead AI Developer at More Life Hospitality, builder of CodeLens and Gogaa CLI. Ask me anything from rate to architecture decisions.",
    tags: ["intro"],
  },
  {
    id: "rate",
    keywords: [
      "rate", "rates", "price", "pricing", "cost", "costs", "fee", "fees",
      "budget", "how much", "charge", "charges", "quote", "quotes", "money",
      "expensive", "cheap", "affordable", "hourly", "per hour",
    ],
    response:
      "Contract: $80–120/hr for direct engagements. Project-based: starting from $3k for scoped deliveries, scales with complexity. Full-time: $4k–10k/mo depending on scope, location, and impact. Rates vary by engagement type — best to discuss on a quick call.",
    tags: ["commercial"],
    actions: [
      { label: "Book a 15-min call", href: BOOK_URL },
    ],
  },
  {
    id: "availability",
    keywords: [
      "available", "availability", "hire", "hiring", "capacity", "free",
      "open", "when can you", "when can", "start", "start date", "bandwidth",
      "can you work", "take on", "new project", "new work",
    ],
    response:
      "Open to both full-time remote roles and 90-day project engagements. Currently available to start within a week.",
    tags: ["commercial"],
    actions: [
      { label: "Book a 15-min call", href: BOOK_URL },
      { label: "View CV", event: "open-cv-drawer" },
    ],
  },
  {
    id: "timezone",
    keywords: [
      "timezone", "time zone", "hours", "when do you work", "location",
      "where are you", "based", "country", "city", "pakistan", "pkt",
      "overlap", "meeting", "utc",
    ],
    response:
      "Based in Pakistan (UTC+5). Overlaps cleanly with EU mornings and full Gulf business hours. Async-first by design. My tooling keeps progress going without meetings.",
    tags: ["working"],
  },
  {
    id: "stack",
    keywords: [
      "stack", "tech stack", "tech", "technology", "technologies",
      "languages", "language", "framework", "frameworks", "tools you use",
      "what do you use", "what tech", "which tech", "strongest", "best at",
      "what stack", "which stack",
    ],
    response:
      "Two halves: (1) AI orchestration with Claude, OpenAI, multi-agent systems, human approval gates, RAG on pgvector, LangChain. (2) Full-stack TypeScript with React, Next.js, Supabase (Postgres + Edge + RLS), Stripe, Docker. Python for data pipelines and agent backends.",
    tags: ["technical"],
  },
  {
    id: "react",
    keywords: ["react", "nextjs", "next.js", "frontend", "front-end", "spa", "ssr"],
    response:
      "React + Next.js is my default frontend. Shipped production React across OpenEvent, Command Center, gluten-free PWA, and multiple client projects. Comfortable with App Router, server components, Tailwind, shadcn/ui.",
    tags: ["technical"],
  },
  {
    id: "typescript",
    keywords: ["typescript", "ts", "type safety", "types"],
    response:
      "TypeScript is the primary language. Strict mode everywhere. No any. Use satisfies over as for assertions. Every new project starts with strict tsconfig + CodeLens guardrails to catch type gaps early.",
    tags: ["technical"],
  },
  {
    id: "python",
    keywords: ["python", "py", "fastapi", "flask", "django"],
    response:
      "Python for data pipelines, agent backends, and ML evaluation. FastAPI for HTTP layers. Used across the deep-agents HuggingFace app, RAG pipelines, VQA agent, and 500+ RLHF evaluation sessions on frontier models.",
    tags: ["technical"],
  },
  {
    id: "codelens",
    keywords: [
      "codelens", "code lens", "code-lens", "code review", "reviewer",
      "linter", "static analysis", "analyze code", "code quality",
    ],
    response:
      "CodeLens is my AI code review engine. 430 hand-crafted patterns across 9 stacks, source-to-sink taint tracking, PR risk scoring, and Guardian mode that injects rules into Claude Code / Cursor / Copilot so bugs are caught at generation time, not review time. Runs fully local, sub-second, zero runtime deps.",
    tags: ["product"],
  },
  {
    id: "gogaa",
    keywords: [
      "gogaa", "cli", "coding agent", "aider", "claude code", "alternative",
      "terminal agent", "ai cli",
    ],
    response:
      "Gogaa CLI is my open-source AI coding agent. 11 providers with auto-fallback, full Aider parity (repo map, SEARCH/REPLACE, watch mode, LLM commits), plugin marketplace, parallel panes, scheduled triggers. 1,400+ tests passing. Built it because every other tool made you choose between provider freedom and deep integration.",
    tags: ["product"],
  },
  {
    id: "openevent",
    keywords: [
      "openevent", "open event", "event", "saas", "client project",
      "saas product", "more life", "morelife", "hospitality",
    ],
    response:
      "OpenEvent is the production SaaS I architect at More Life Hospitality. Email → AI classification → entity extraction → human approval → workflow execution. Live with 100+ clients across 150+ events, saves each team roughly 1.5 hours a day of manual email triage.",
    tags: ["product"],
  },
  {
    id: "stripe",
    keywords: [
      "stripe", "payment", "payments", "billing", "webhook", "webhooks",
      "checkout", "subscription", "subscriptions", "invoicing", "invoices",
    ],
    response:
      "Yes. Stripe is wired into OpenEvent for invoicing, subscription billing, and multi-tenant payouts. I've built full checkout flows, customer portal integration, and hardened webhook handlers against replay and duplicate deliveries.",
    tags: ["technical"],
  },
  {
    id: "supabase",
    keywords: [
      "supabase", "postgres", "postgresql", "rls", "row level security",
      "realtime", "real-time", "edge function", "edge functions", "database",
    ],
    response:
      "Supabase is my default backend. Production systems with Edge Functions, Postgres with tight RLS, pgvector for semantic search, and realtime channels. Staging + prod split with CI-driven migrations.",
    tags: ["technical"],
  },
  {
    id: "ai-orchestration",
    keywords: [
      "agent", "agents", "multi-agent", "multiagent", "orchestration",
      "ai agents", "langchain", "llm", "llms", "workflow", "pipeline",
      "automation",
    ],
    response:
      "I design AI systems where humans stay in the loop by default. Common pattern: intent classification → entity extraction → AI proposes action → human approves → workflow engine executes → audit log. Never full automation on things that touch money or commitments.",
    tags: ["technical"],
  },
  {
    id: "rag",
    keywords: [
      "rag", "embedding", "embeddings", "vector", "vectors", "pgvector",
      "pinecone", "retrieval", "semantic search", "similarity",
    ],
    response:
      "RAG pipelines: usually pgvector inside Postgres for small-to-mid corpora, Pinecone for scale. Default pattern: chunk → embed → index → query embedding + hybrid keyword → rerank → context assembly → generation with citations. Consistency over recall for most business use cases.",
    tags: ["technical"],
  },
  {
    id: "claude",
    keywords: ["claude", "anthropic", "sonnet", "opus"],
    response:
      "Claude (Anthropic) is my primary LLM for complex reasoning. Sonnet for most production, Opus for architecture and deep code review. Every commit co-authored via Claude Code for Zed / CLI workflows.",
    tags: ["technical"],
  },
  {
    id: "openai",
    keywords: ["openai", "gpt", "gpt-4", "gpt4", "gpt-5"],
    response:
      "OpenAI models used across OpenEvent for classification (fast) and RAG generation (higher-quality). Structured outputs + function calling in production. Comfortable with the full API surface including fine-tuning.",
    tags: ["technical"],
  },
  {
    id: "process",
    keywords: [
      "how do you work", "process", "methodology", "workflow",
      "collaboration", "how you work", "working with you", "work with you",
      "work together", "sprint", "delivery",
    ],
    response:
      "Architecture document first (1-3 day discovery). Then sprint-based delivery with weekly demos. CodeLens runs on every PR so you see findings alongside every change. Transparency by default: shared staging, Supabase dashboard access, PR-by-PR visibility.",
    tags: ["working"],
  },
  {
    id: "say-no",
    keywords: [
      "say no", "wont do", "won't do", "wouldn't do", "avoid", "refuse",
      "not willing", "decline", "reject",
    ],
    response:
      "Throwaway prototypes without a production path. Systems designed for full autonomy where human oversight matters (I'll propose a human-in-the-loop variant instead). Any work on surveillance tooling.",
    tags: ["working"],
  },
  {
    id: "experience",
    keywords: [
      "experience", "years", "background", "history", "past", "career",
      "journey", "cv", "resume", "bio",
      "rouelite", "rouelite techno", "more life", "more life hospitality",
      "wadware", "wadware house", "outlier", "rws", "translated",
      "worked at", "work at", "work in",
    ],
    response:
      "Engineering since 2019, deep into AI since 2022. 50+ production systems shipped for real businesses across 250+ total client projects on Upwork and direct clients. Director of IT & R&D at Rouelite Techno 2022-2024, where I introduced AI into operations, reducing manual work by 70%. 500+ RLHF/SFT evaluation sessions on frontier models at Outlier/RWS/Translated. Since Sep 2025: Lead AI Developer at More Life Hospitality GmbH, shipping OpenEvent to 100+ clients.",
    tags: ["background"],
    actions: [
      { label: "View CV", event: "open-cv-drawer" },
    ],
  },
  {
    id: "team",
    keywords: [
      "team", "lead", "leading", "manage", "management", "leadership",
      "people", "reports", "direct reports",
    ],
    response:
      "Led engineering teams of 3-10 people across cross-functional delivery. Comfortable owning architecture and still writing code. Not looking for a purely managerial role. I stay hands-on.",
    tags: ["background"],
  },
  {
    id: "response-time",
    keywords: [
      "response time", "reply", "how fast", "how quickly", "slow",
      "turnaround", "quick",
    ],
    response:
      "Usually under 24 hours. Faster if you book a call directly, that lands in my calendar with a reminder.",
    tags: ["working"],
    actions: [
      { label: "Book a 15-min call", href: BOOK_URL },
    ],
  },
  {
    id: "open-source",
    keywords: [
      "open source", "opensource", "open-source", "github", "public",
      "contribute", "oss", "repos", "repositories",
    ],
    response:
      "Gogaa CLI hits npm soon. Smaller open-source experiments at github.com/shami-ah. CodeLens stays private while I evaluate a commercial release.",
    tags: ["product"],
  },
  {
    id: "contact",
    keywords: [
      "contact", "reach", "email", "get in touch", "message", "phone",
      "how to contact", "how can i", "reach out", "connect",
    ],
    response:
      "Email: shami8024@gmail.com · LinkedIn: linkedin.com/in/ahtesham · GitHub: github.com/shami-ah",
    tags: ["commercial"],
    actions: [
      { label: "Book a 15-min call", href: BOOK_URL },
      { label: "View CV", event: "open-cv-drawer" },
    ],
  },
  {
    id: "booking",
    keywords: ["book", "booking", "schedule", "call", "meeting", "meet", "calendly"],
    response:
      "15-min intro call, Google Meet, weekday open slots, no commitment. Pick any slot that works for you.",
    tags: ["commercial"],
    actions: [
      { label: "Book a 15-min call", href: BOOK_URL },
    ],
  },
  {
    id: "linkedin",
    keywords: ["linkedin", "linked in", "linked-in"],
    response: "LinkedIn: linkedin.com/in/ahtesham. Feel free to connect, mention where you found the portfolio.",
    tags: ["commercial"],
  },
  {
    id: "relocation",
    keywords: [
      "relocate", "relocation", "move", "moving", "on-site", "onsite",
      "on site", "in-person", "in person", "office", "remote",
    ],
    response:
      "Remote full-time is my preference. Open to occasional on-site in Gulf/EU. Permanent relocation only for the right role and conditions.",
    tags: ["working"],
  },
  {
    id: "strength",
    keywords: [
      "strength", "strengths", "superpower", "unique", "differentiator",
      "why you", "stand out", "different", "special",
    ],
    response:
      "I'm both a consumer AND a builder of AI tooling. Most engineers pick between 'ships features' and 'builds tools'. I do both. When existing tools don't match my standards, I build the tool, then use it on client work. That loop is the moat.",
    tags: ["background"],
  },
  {
    id: "references",
    keywords: ["reference", "references", "testimonial", "testimonials", "clients say", "recommendation"],
    response:
      "Testimonials from River Soellner (More Life founder, hired full-time after Upwork), Mouad B. (project management work, France), and META AI course client are on the portfolio. Happy to connect you directly with any of them after a call.",
    tags: ["background"],
    actions: [
      { label: "Book a 15-min call", href: BOOK_URL },
    ],
  },
  {
    id: "why-hire",
    keywords: ["why hire", "why should", "convince", "sell me", "pitch"],
    response:
      "Because you don't just need someone who writes code. You need someone who designs the system, holds it accountable to real production failure modes (taint tracking, human gates, RLS, feature flags), and owns the outcome. Most AI demos break in production. Mine don't.",
    tags: ["commercial"],
    actions: [
      { label: "Book a 15-min call", href: BOOK_URL },
      { label: "See the work", event: "scroll-projects" },
    ],
  },
  {
    id: "english",
    keywords: ["english", "language skill", "communication", "fluent", "speak", "writing"],
    response:
      "Fluent English, working German. Strong written comms. All my systems have specs, audit logs, and README-first design. Async-friendly by default.",
    tags: ["working"],
  },
  {
    id: "security",
    keywords: ["security", "secure", "compliance", "gdpr", "audit", "pentest"],
    response:
      "Security by default: RLS on every Supabase table, taint tracking via CodeLens, webhook signature verification with replay protection, no secrets in code, audit logs on every sensitive mutation. GDPR-aware (client in EU).",
    tags: ["technical"],
  },
  {
    id: "testing",
    keywords: ["test", "testing", "tests", "qa", "ci", "coverage"],
    response:
      "Gogaa runs 1,400+ tests. Every OpenEvent PR must pass CI (CodeLens + unit + e2e). Test-first for regressions; pragmatic scaffold-first for new features. Playwright for browser e2e.",
    tags: ["technical"],
  },
  {
    id: "docker",
    keywords: ["docker", "container", "containers", "devops", "infrastructure"],
    response:
      "My dev environment runs in a Docker container, same setup on Mac, Linux VPS, or SSH from my phone. Docker Compose for multi-service local dev. GitHub Actions builds multi-arch images (ARM + x86) for production.",
    tags: ["technical"],
  },
  {
    id: "ci-cd",
    keywords: ["ci/cd", "cicd", "continuous integration", "deployment", "deploy", "github actions", "pipeline"],
    response:
      "GitHub Actions for every repo. Every PR: build + lint + CodeLens review + staging deploy. Main branch deploys to production behind a feature flag. Sentry + Grafana watched during rollouts.",
    tags: ["technical"],
  },
  {
    id: "mobile",
    keywords: ["mobile", "ios", "android", "react native", "expo", "app"],
    response:
      "React Native via Expo for cross-platform. Shipped a gluten-free deals/dining app with Next.js web + RN mobile. PWA is my default when possible (installable, push notifications, no app store).",
    tags: ["technical"],
  },

  {
    id: "rasad",
    keywords: [
      "rasad", "observatory", "observability", "session", "sessions",
      "x-ray", "xray", "token cost", "token usage", "ai cost",
      "grading", "session quality",
    ],
    response:
      "Rasad is an AI session observatory. 656 sessions analyzed across 4 tools, 38K messages, 14K tool calls — every action replayed, every session graded A-F. Found that Opus costs 18x more than Sonnet for routine tasks. X-Ray mode replays sessions action-by-action. 100% local, zero outbound requests. Open-source on GitHub.",
    tags: ["product"],
  },
  {
    id: "command-center",
    keywords: [
      "command center", "command-center", "pwa", "inbox", "triage",
      "gmail", "calendar", "personal dashboard",
    ],
    response:
      "Command Center is a personal AI operations PWA. Pulls Gmail and Calendar via API, applies dual-AI triage (Claude for reasoning, Gemini for classification), surfaces everything in one dashboard. Installable on desktop and mobile, works offline, syncs across devices via Supabase. Replaces 4+ separate tools, reduces inbox processing by 60%.",
    tags: ["product"],
  },
  {
    id: "gluten-free",
    keywords: [
      "gluten", "gluten-free", "gluten free", "deals", "dining",
      "restaurant", "recipe", "food", "consumer app",
    ],
    response:
      "Gluten-Free Deals & Dining is a cross-platform consumer app. An LLM generates 200+ targeted search queries, concurrent scrapers aggregate deals from 40+ retailers, GPS finds nearby safe restaurants, and AI generates personalized recipes. Shared React Native + Next.js codebase serves Web, iOS, and Android.",
    tags: ["product"],
  },
  {
    id: "dev-env",
    keywords: [
      "dev environment", "dev env", "portable", "containerized",
      "workspace", "onboarding", "wisc", "context engineering",
    ],
    response:
      "Portable Dev Environment: a Docker container packaging the full toolchain with WISC context engineering. Cut Claude Code context from 72KB to 11.7KB (84% reduction) with zero capability loss. One-command onboarding in 10 minutes, identical setup across Mac, Linux VPS, and phone SSH.",
    tags: ["product"],
  },
  {
    id: "agent-orchestrator",
    keywords: [
      "orchestrator", "camel", "multi-agent framework", "planner",
      "validator", "task state", "critique",
    ],
    response:
      "AI Agent Orchestrator implements the CAMEL multi-agent framework. 4 roles (Planner, Worker, Validator, Orchestrator), iterative critique loops (70% → 95% accuracy in 3 rounds), cross-task learning via error pattern memory. Clean 18-file architecture, fully open-source on GitHub.",
    tags: ["product"],
  },
  {
    id: "agent-system",
    keywords: [
      "agent system", "deep agents", "huggingface", "hugging face",
      "job search agent", "research agent", "proposal agent",
      "5 agents", "five agents",
    ],
    response:
      "AI Agent System: 5 purpose-built agents deployed on HuggingFace Spaces. Job Search, Research, Code Review, Upwork Proposal, and n8n Webhook agents — each with real tool-calling (Tavily, GitHub API). Groq inference at $0/month hosting cost. Live and operational.",
    tags: ["product"],
  },

  /* ── New entries ── */

  {
    id: "portfolio",
    keywords: [
      "portfolio", "this website", "this site", "how did you build",
      "built this", "website", "site tech", "what powers",
    ],
    response:
      "This portfolio is Next.js 16 + React 19 + TypeScript + Tailwind + Framer Motion + Supabase. The boot sequence, particle system, and word-by-word streaming are all custom. The AI agent bar processes commands locally, and this chat uses Groq's Llama 3.3 70B with a portfolio-scoped system prompt. Deployed on Cloudflare Pages.",
    tags: ["technical"],
  },
  {
    id: "education",
    keywords: [
      "education", "degree", "university", "college", "certification",
      "certifications", "school", "study", "studied", "qualification",
    ],
    response:
      "BSc Engineering. Self-taught in AI/ML beyond formal education. 500+ RLHF evaluation sessions on frontier models (practical, hands-on AI training). I believe in learning by shipping, not collecting certificates.",
    tags: ["background"],
  },
  {
    id: "freelance",
    keywords: [
      "freelance", "freelancer", "upwork", "fiverr", "contract",
      "contractor", "consulting", "consultant", "independent",
    ],
    response:
      "250+ projects on Upwork with 100% job success score and 40+ returning clients. Open to both short contracts and long-term engagements. Typical project: scoped architecture doc → sprint delivery → production handoff.",
    tags: ["commercial"],
    actions: [
      { label: "Book a 15-min call", href: BOOK_URL },
    ],
  },
  {
    id: "ai-safety",
    keywords: [
      "ai safety", "responsible ai", "ethical", "ethics", "bias",
      "alignment", "guardrails", "trust", "responsible",
    ],
    response:
      "Human-in-the-loop is non-negotiable for anything touching money, commitments, or personal data. Every AI action is auditable. I build approval gates, confidence thresholds, and fallback paths into every system. No black boxes in production.",
    tags: ["technical"],
  },
  {
    id: "trial",
    keywords: [
      "trial", "trial project", "test project", "proof of concept",
      "poc", "pilot", "sample", "demo project",
    ],
    response:
      "Happy to start with a scoped proof of concept. Typical POC is 1-2 weeks, fixed scope, clear deliverable. If it works, we scale. If it doesn't, you've lost a week, not a quarter.",
    tags: ["commercial"],
    actions: [
      { label: "Book a 15-min call", href: BOOK_URL },
    ],
  },
];

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function findAnswer(query: string): KbEntry | null {
  const lowered = query.toLowerCase();
  const tokens = tokenize(query);
  if (tokens.length === 0) return null;

  let bestScore = 0;
  let best: KbEntry | null = null;

  for (const entry of kb) {
    let score = 0;
    for (const kw of entry.keywords) {
      const kwTokens = tokenize(kw);
      if (kwTokens.length === 0) continue;

      if (kwTokens.length === 1) {
        if (tokens.includes(kwTokens[0])) {
          score += 3;
        }
      } else {
        const re = new RegExp(`\\b${escapeRegex(kw.toLowerCase())}\\b`);
        if (re.test(lowered)) {
          score += kwTokens.length * 3;
        }
        let partialHits = 0;
        for (const kt of kwTokens) {
          if (tokens.includes(kt)) partialHits += 1;
        }
        if (partialHits === kwTokens.length) {
          score += kwTokens.length;
        } else {
          score += partialHits * 0.5;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore >= 3 ? best : null;
}
