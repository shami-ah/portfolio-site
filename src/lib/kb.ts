/** Knowledge base for the Chat-as-CV page. Each entry has keywords that
 *  are scored against the user's query; the highest-scoring entry wins.
 *  Uses word-boundary matching (so "hi" doesn't match "which"). */

export interface KbEntry {
  id: string;
  keywords: string[];
  response: string;
  tags?: string[];
}

export const starters = [
  "What's your rate?",
  "Which stack do you use?",
  "Tell me about CodeLens",
  "Are you available right now?",
  "Have you worked with Stripe?",
  "How do you work with clients?",
];

export const kb: KbEntry[] = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "hola", "greetings", "good morning", "good evening", "howdy"],
    response:
      "Hey. I'm an AI interface to Ahtesham's work. Ask me about his rate, stack, tools, projects, availability — whatever helps you decide if you two should talk.",
    tags: ["intro"],
  },
  {
    id: "identity",
    keywords: ["who are you", "what is this", "what is", "who", "about you", "introduce"],
    response:
      "I'm a scoped AI assistant trained on Ahtesham Ahmad's portfolio. 5+ years shipping production AI, lead AI dev at More Life Hospitality, builder of CodeLens and gogaa CLI. Ask me anything from rate to architecture decisions.",
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
      "Project work is tier-based, starting around $3k for scoped deliveries and scaling with complexity. Full-time roles are flexible depending on scope, equity, and impact. Easiest way to dial in the number is a 15-min call.",
    tags: ["commercial"],
  },
  {
    id: "availability",
    keywords: [
      "available", "availability", "hire", "hiring", "capacity", "free",
      "open", "when can you", "when can", "start", "start date", "bandwidth",
      "can you work", "take on", "new project", "new work",
    ],
    response:
      "Open to both full-time remote roles and 90-day project engagements. Use the Book a Call button to pick any open slot.",
    tags: ["commercial"],
  },
  {
    id: "timezone",
    keywords: [
      "timezone", "time zone", "hours", "when do you work", "location",
      "where are you", "based", "country", "city", "pakistan", "pkt",
      "overlap", "meeting", "utc",
    ],
    response:
      "Based in Pakistan (UTC+5). Overlaps cleanly with EU mornings and full Gulf business hours. Async-first by design — my tooling keeps progress going without meetings.",
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
      "Two halves: (1) AI orchestration — Claude, OpenAI, multi-agent systems with human approval gates, RAG on pgvector, LangChain. (2) Full-stack TypeScript — React, Next.js, Supabase (Postgres + Edge + RLS), Stripe, Docker. Python for data pipelines and agent backends.",
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
      "CodeLens is my AI code review engine — 305 hand-crafted patterns across 9 stacks, source-to-sink taint tracking, PR risk scoring, and Guardian mode that injects rules into Claude Code / Cursor / Copilot so bugs are caught at generation time, not review time. Runs fully local, sub-second, zero runtime deps.",
    tags: ["product"],
  },
  {
    id: "gogaa",
    keywords: [
      "gogaa", "cli", "coding agent", "aider", "claude code", "alternative",
      "terminal agent", "ai cli",
    ],
    response:
      "Gogaa CLI is my open-source AI coding agent. 11 providers with auto-fallback, full Aider parity (repo map, SEARCH/REPLACE, watch mode, LLM commits), plugin marketplace, parallel panes, scheduled triggers. 1,418 tests passing. Built it because every other tool made you choose between provider freedom and deep integration.",
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
      "Yes — Stripe is wired into OpenEvent for invoicing, subscription billing, and multi-tenant payouts. I've built full checkout flows, customer portal integration, and hardened webhook handlers against replay and duplicate deliveries.",
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
      "Architecture document first (1-3 day discovery). Then sprint-based delivery with weekly demos. CodeLens runs on every PR — you see findings alongside every change. Transparency by default: shared staging, Supabase dashboard access, PR-by-PR visibility.",
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
    ],
    response:
      "5+ years. Started freelance on Upwork/Fiverr in 2019. Director of IT & R&D at Rouelite Techno 2022-2024 (10-person team, CRM serving 500+ daily). RLHF/SFT evaluation on frontier models at Outlier/RWS/Translated. Since Sep 2025: Lead AI Developer at More Life Hospitality GmbH.",
    tags: ["background"],
  },
  {
    id: "team",
    keywords: [
      "team", "lead", "leading", "manage", "management", "leadership",
      "people", "reports", "direct reports",
    ],
    response:
      "Led engineering teams of 3-10 people across cross-functional delivery. Comfortable owning architecture and still writing code. Not looking for a purely managerial role — I stay hands-on.",
    tags: ["background"],
  },
  {
    id: "response-time",
    keywords: [
      "response time", "reply", "how fast", "how quickly", "slow",
      "turnaround", "quick",
    ],
    response:
      "Usually under 24 hours. Faster if you book a call directly — that lands in my calendar with a reminder.",
    tags: ["working"],
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
      "Email: shami8024@gmail.com · LinkedIn: linkedin.com/in/ahtesham · GitHub: github.com/shami-ah. Fastest path is the Book a Call button above.",
    tags: ["commercial"],
  },
  {
    id: "booking",
    keywords: ["book", "booking", "schedule", "call", "meeting", "meet", "calendly"],
    response:
      "Use the Book a Call button to schedule a 15-min intro call. Google Meet, open slots weekdays, no commitment.",
    tags: ["commercial"],
  },
  {
    id: "linkedin",
    keywords: ["linkedin", "linked in", "linked-in"],
    response: "LinkedIn: linkedin.com/in/ahtesham. Feel free to connect — mention where you found the portfolio.",
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
      "I'm both a consumer AND a builder of AI tooling. Most engineers pick between 'ships features' and 'builds tools' — I do both. When existing tools don't match my standards, I build the tool, then use it on client work. That loop is the moat.",
    tags: ["background"],
  },
  {
    id: "references",
    keywords: ["reference", "references", "testimonial", "testimonials", "clients say", "recommendation"],
    response:
      "Testimonials from River Soellner (More Life founder, hired full-time after Upwork), Mouad B. (project management work, France), and META AI course client are on the portfolio. Happy to connect you directly with any of them after a call.",
    tags: ["background"],
  },
  {
    id: "why-hire",
    keywords: ["why hire", "why should", "convince", "sell me", "pitch"],
    response:
      "Because you don't just need someone who writes code. You need someone who designs the system, holds it accountable to real production failure modes (taint tracking, human gates, RLS, feature flags), and owns the outcome. Most AI demos break in production. Mine don't.",
    tags: ["commercial"],
  },
  {
    id: "english",
    keywords: ["english", "language skill", "communication", "fluent", "speak", "writing"],
    response:
      "Fluent English, working German. Strong written comms — all my systems have specs, audit logs, and README-first design. Async-friendly by default.",
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
      "Gogaa runs 1,418 tests. Every OpenEvent PR must pass CI (CodeLens + unit + e2e). Test-first for regressions; pragmatic scaffold-first for new features. Playwright for browser e2e.",
    tags: ["technical"],
  },
  {
    id: "docker",
    keywords: ["docker", "container", "containers", "devops", "infrastructure"],
    response:
      "My dev environment runs in a Docker container — same setup on Mac, Linux VPS, or SSH from my phone. Docker Compose for multi-service local dev. GitHub Actions builds multi-arch images (ARM + x86) for production.",
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
      const kwLower = kw.toLowerCase();
      const kwTokens = tokenize(kw);
      if (kwTokens.length === 0) continue;

      if (kwTokens.length === 1) {
        // Single-word keyword: require exact token match (word-boundary safe)
        if (tokens.includes(kwTokens[0])) {
          score += 3;
        }
      } else {
        // Multi-word keyword: require exact phrase match with word boundaries
        const re = new RegExp(`\\b${escapeRegex(kwLower)}\\b`);
        if (re.test(lowered)) {
          score += kwTokens.length * 3;
        }
        // Partial credit: count how many of its tokens are in the query
        let partialHits = 0;
        for (const kt of kwTokens) {
          if (tokens.includes(kt)) partialHits += 1;
        }
        if (partialHits === kwTokens.length) {
          score += kwTokens.length; // all tokens present, even out of order
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
