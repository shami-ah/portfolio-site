/** Knowledge base for the Chat-as-CV page. Each entry has keywords that
 *  are scored against the user's query; the highest-scoring entry wins.
 *  Not a real LLM, but feels like one for ~30 predictable queries. */

export interface KbEntry {
  id: string;
  keywords: string[];
  response: string;
  tags?: string[];
}

export const starters = [
  "What's your rate?",
  "Tell me about CodeLens",
  "Are you available right now?",
  "Which tech are you strongest in?",
  "Have you worked with Stripe?",
  "What do you say no to?",
];

export const kb: KbEntry[] = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "yo", "sup"],
    response:
      "Hey. I'm Ahtesham. 5 years of production AI. Ask me about my work, my rate, my tools — whatever helps you decide if we should talk.",
    tags: ["intro"],
  },
  {
    id: "rate",
    keywords: ["rate", "price", "cost", "how much", "budget", "charge", "pricing"],
    response:
      "Project work: tier-based, starting at around $3k for scoped deliveries. Full-time roles: flexible depending on scope, equity, and impact. Easiest way to dial in numbers is a 15-min call.",
    tags: ["commercial"],
  },
  {
    id: "availability",
    keywords: ["available", "availability", "hire", "hiring", "capacity", "free", "open", "when can you"],
    response:
      "Open to both full-time remote roles and 90-day project engagements. My calendar is shared at calendly.com/shami8024/30min — pick any open slot.",
    tags: ["commercial"],
  },
  {
    id: "timezone",
    keywords: ["timezone", "hours", "when do you work", "location", "where are you"],
    response:
      "Pakistan (UTC+5). Overlaps cleanly with EU mornings and full Gulf business hours. Async-first by design: my own tooling means I don't need a meeting to make progress.",
    tags: ["working"],
  },
  {
    id: "stack",
    keywords: ["stack", "tech", "technology", "languages", "framework", "strongest"],
    response:
      "Two halves: (1) AI orchestration — Claude, OpenAI, multi-agent systems with human approval gates, RAG on pgvector, LangChain. (2) Full-stack TypeScript — React, Next.js, Supabase (Postgres + Edge + RLS), Stripe, Docker. Python for data and agent backends.",
    tags: ["technical"],
  },
  {
    id: "codelens",
    keywords: ["codelens", "code lens", "code review", "reviewer", "linter", "static analysis"],
    response:
      "CodeLens is my AI code review engine — 305 hand-crafted patterns across 9 stacks, source-to-sink taint tracking, PR risk scoring, and Guardian mode that injects rules into Claude Code / Cursor / Copilot so bugs are caught at generation time, not review time. Runs fully local, sub-second, zero runtime deps.",
    tags: ["product"],
  },
  {
    id: "gogaa",
    keywords: ["gogaa", "cli", "coding agent", "aider", "claude code alternative"],
    response:
      "Gogaa CLI is an open-source AI coding agent I built because every existing tool made you choose — provider freedom or deep integration, polished TUI or serious git workflow. 11 providers with auto-fallback, full Aider parity (repo map, SEARCH/REPLACE, watch mode, LLM commits), plugin marketplace, parallel panes, scheduled triggers. 1,418 tests passing.",
    tags: ["product"],
  },
  {
    id: "openevent",
    keywords: ["openevent", "event", "saas", "client", "saas product"],
    response:
      "OpenEvent is the production SaaS I architect at More Life Hospitality. Email → AI classification → entity extraction → human approval → workflow execution. Live with 100+ clients across 150+ events, saves each team roughly 1.5 hours a day of manual email triage.",
    tags: ["product"],
  },
  {
    id: "stripe",
    keywords: ["stripe", "payment", "billing", "webhook", "checkout"],
    response:
      "Yes — Stripe is wired into OpenEvent for invoicing, subscription billing, and multi-tenant payouts. I've built full checkout flows, customer portal integration, and hardened webhook handlers against replay and duplicate deliveries.",
    tags: ["technical"],
  },
  {
    id: "supabase",
    keywords: ["supabase", "postgres", "rls", "realtime", "edge functions"],
    response:
      "Supabase is my default backend. I've shipped production systems with Edge Functions, Postgres with tight RLS, pgvector for semantic search, and realtime channels. Staging + prod split with CI-driven migrations.",
    tags: ["technical"],
  },
  {
    id: "ai-orchestration",
    keywords: ["agent", "multi-agent", "orchestration", "ai agents", "langchain", "llm", "workflow"],
    response:
      "I design AI systems where humans stay in the loop by default. Common pattern: intent classification → entity extraction → AI proposes action → human approves → workflow engine executes → audit log. Never full automation on things that touch money or commitments.",
    tags: ["technical"],
  },
  {
    id: "rag",
    keywords: ["rag", "embedding", "vector", "pgvector", "pinecone", "retrieval"],
    response:
      "RAG pipelines: usually pgvector inside Postgres for small-to-mid corpora, Pinecone for scale. Default pattern: chunk → embed → index → query embedding + hybrid keyword → rerank → context assembly → generation with citations. Consistency over recall for most business use cases.",
    tags: ["technical"],
  },
  {
    id: "process",
    keywords: ["how do you work", "process", "methodology", "workflow", "collaboration"],
    response:
      "Architecture document first (1-3 day discovery). Then sprint-based delivery with weekly demos. CodeLens runs on every PR. You see findings alongside every change. Transparency by default: shared staging, Supabase dashboard access, PR-by-PR visibility.",
    tags: ["working"],
  },
  {
    id: "say-no",
    keywords: ["say no", "won't do", "wouldn't do", "avoid", "don't like", "refuse"],
    response:
      "Throwaway prototypes without a production path. Systems designed for full autonomy where human oversight matters (I'll propose a human-in-the-loop variant instead). Any work on surveillance tooling.",
    tags: ["working"],
  },
  {
    id: "experience",
    keywords: ["experience", "years", "background", "history", "past"],
    response:
      "5+ years. Started freelance on Upwork/Fiverr in 2019. Director of IT & R&D at Rouelite Techno 2022-2024 (10-person team, CRM serving 500+ daily). RLHF/SFT evaluation on frontier models at Outlier/RWS/Translated. Since Sep 2025: Lead AI Developer at More Life Hospitality GmbH.",
    tags: ["background"],
  },
  {
    id: "team",
    keywords: ["team", "lead", "manage", "leadership", "people"],
    response:
      "Led engineering teams of 3-8 people across cross-functional delivery. Comfortable owning the architecture and still writing code. Not looking for a purely managerial role — I stay hands-on.",
    tags: ["background"],
  },
  {
    id: "response-time",
    keywords: ["response time", "reply", "how fast", "how quickly", "slow"],
    response:
      "Usually under 24 hours. Faster if you book a call directly — that lands in my calendar with a reminder.",
    tags: ["working"],
  },
  {
    id: "open-source",
    keywords: ["open source", "opensource", "github", "public", "contribute"],
    response:
      "Gogaa CLI will hit npm soon. Smaller open-source experiments on github.com/shami-ah. CodeLens is private while I evaluate a commercial release.",
    tags: ["product"],
  },
  {
    id: "contact",
    keywords: ["contact", "reach", "email", "get in touch", "how to contact"],
    response:
      "Email: shami8024@gmail.com · Calendly: calendly.com/shami8024/30min · LinkedIn: linkedin.com/in/ahtesham · GitHub: github.com/shami-ah. Fastest path is the calendar link.",
    tags: ["commercial"],
  },
  {
    id: "relocation",
    keywords: ["relocate", "relocation", "move", "on-site", "onsite", "in-person", "office"],
    response:
      "Remote full-time is my preference. Open to occasional on-site in Gulf/EU. Permanent relocation only for the right role and conditions.",
    tags: ["working"],
  },
  {
    id: "strength",
    keywords: ["strength", "superpower", "best at", "unique", "differentiator", "why you"],
    response:
      "I'm both a consumer AND a builder of AI tooling. Most engineers pick between \"ships features\" and \"builds tools\" — I do both. When existing tools don't match my standards, I build the tool, then use it on client work. That loop is the moat.",
    tags: ["background"],
  },
];

function tokenize(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
}

export function findAnswer(query: string): KbEntry | null {
  const tokens = tokenize(query);
  if (tokens.length === 0) return null;

  let bestScore = 0;
  let best: KbEntry | null = null;

  for (const entry of kb) {
    let score = 0;
    for (const kw of entry.keywords) {
      const kwTokens = tokenize(kw);
      // Exact multi-word match
      if (query.toLowerCase().includes(kw.toLowerCase())) {
        score += kwTokens.length * 3;
      }
      // Individual token overlap
      for (const kt of kwTokens) {
        if (tokens.includes(kt)) score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore >= 2 ? best : null;
}
