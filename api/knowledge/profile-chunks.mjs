// Profile facts the chatbot needs for hiring questions (identity, availability,
// rates, process, principles, stack). Copied from the old PORTFOLIO_CONTEXT prompt
// on main so these answers are not lost. TODO (handover Phase 1.1): move to
// src/data/profile.ts and generate these chunks from it. No URLs or contact
// details here on purpose: the bot must not output links.

export const profileChunks = [
  {
    id: "profile-identity",
    category: "profile",
    tags: ["about", "who", "role", "location", "timezone", "based", "remote"],
    text: `
Profile · Identity: Engr. Ahtesham Ahmad is an AI Automation Architect
and Lead AI Developer. His focus is AI engineering: OpenEvent, CodeLens,
Gogaa CLI, production workflow automation and developer tools.
He is based in Islamabad, Pakistan (UTC+5) and works remote-first.
    `.trim(),
  },
  {
    id: "profile-availability",
    category: "profile",
    tags: ["availability", "available", "hire", "full-time", "remote", "timezone", "response time", "relocation"],
    text: `
Profile · Availability: Ahtesham is open to full-time remote roles and
90-day project engagements. Timezone UTC+5, which overlaps EU mornings
and Gulf business hours. He replies within 24 hours; the fastest way to
reach him is the Book a Call button on the page.
    `.trim(),
  },
  {
    id: "profile-rates",
    category: "profile",
    tags: ["rate", "rates", "hourly", "price", "pricing", "cost", "budget", "salary", "contract", "charge", "fee", "fees", "project"],
    text: `
Profile · Rates: Contract work is $80 to $120 per hour for direct
engagements. Project-based work starts from $3k for scoped deliveries
and scales with complexity. Full-time roles: $4k to $10k per month
depending on scope, location and impact. Rates vary by engagement type;
the best next step is a 15-min call via the Book a Call button.
    `.trim(),
  },
  {
    id: "profile-process",
    category: "profile",
    tags: ["process", "how he works", "workflow", "delivery", "sprints", "demos", "run", "client", "project", "engagement", "discovery"],
    text: `
Profile · Process: Every engagement starts with an architecture document
(1 to 3 days of discovery). Delivery is sprint-based with weekly demos.
CodeLens runs on every pull request, so findings ship alongside every
change. Clients get full transparency: shared staging, the Supabase
dashboard and PR-by-PR visibility.
    `.trim(),
  },
  {
    id: "profile-principles",
    category: "profile",
    tags: ["principles", "approach", "philosophy", "human-in-the-loop"],
    text: `
Profile · Principles: Human-in-the-loop by default for anything that
touches money or commitments. Architect first, code second. Strict at
system boundaries, trust internal invariants. Both a consumer and a
producer of AI tooling. One task per agent session, no context
contamination. Deploy behind feature flags: 10% rollout, monitor, then full.
    `.trim(),
  },
  {
    id: "profile-stack",
    category: "profile",
    tags: ["stack", "technologies", "tools", "languages", "frameworks", "kubernetes", "aws", "azure", "gcp", "cloud"],
    text: `
Profile · Stack: AI: Claude (Opus, Sonnet), OpenAI (GPT-4o, o1), RAG
(pgvector, Pinecone), LangChain, multi-agent orchestration,
human-in-the-loop. Full-stack: React, Next.js, React Native (Expo),
TypeScript, Python, FastAPI, Supabase, Stripe, Docker. Infra: GitHub
Actions CI/CD, Docker Compose, Traefik, Sentry, Grafana, n8n, Cloudflare,
Vercel. NOT in his stack: Kubernetes, AWS, Azure and GCP managed
services. He runs Docker Compose and Traefik on self-managed servers
instead of Kubernetes, and can adopt them if a role requires it.
    `.trim(),
  },
];
