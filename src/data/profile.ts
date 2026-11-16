
export interface ProfileSection {
  id: string;
  category: "profile";
  tags: string[];
  title: string;
  content: string[];
}

export interface ProfileData {
  identity: ProfileSection;
  availability: ProfileSection;
  timezone: ProfileSection;
  rates: ProfileSection;
  process: ProfileSection;
  principles: ProfileSection;
  stack: ProfileSection;
  notInStack: ProfileSection;
}

export const profile: ProfileData = {
  identity: {
    id: "profile-identity",
    category: "profile",
    title: "Identity",
    tags: ["about", "who", "role", "location", "timezone", "based", "remote"],
    content: [
      "Engr. Ahtesham Ahmad is an AI Automation Architect and Lead AI Developer.",
      "His focus is AI engineering: OpenEvent, CodeLens, Gogaa CLI, production workflow automation and developer tools.",
      "He is based in Islamabad, Pakistan (UTC+5) and works remote-first.",
    ],
  },

  availability: {
    id: "profile-availability",
    category: "profile",
    title: "Availability",
    tags: [
      "availability",
      "available",
      "hire",
      "full-time",
      "remote",
      "timezone",
      "response time",
      "relocation",
    ],
    content: [
      "Ahtesham is open to full-time remote roles and 90-day project engagements.",
      "Timezone UTC+5, which overlaps EU mornings and Gulf business hours.",
      "He replies within 24 hours.",
      "The fastest way to reach him is the Book a Call button on the page.",
    ],
  },

  timezone: {
    id: "profile-timezone",
    category: "profile",
    title: "Timezone",
    tags: [
      "timezone",
      "utc",
      "utc+5",
      "islamabad",
      "pakistan",
      "working hours",
    ],
    content: [
      "He is based in Islamabad, Pakistan (UTC+5).",
      "His timezone overlaps EU mornings and Gulf business hours.",
    ],
  },

  rates: {
    id: "profile-rates",
    category: "profile",
    title: "Rates",
    tags: [
      "rate",
      "rates",
      "hourly",
      "price",
      "pricing",
      "cost",
      "budget",
      "salary",
      "contract",
      "charge",
      "project",
    ],
    content: [
      "Contract work is $80 to $120 per hour for direct engagements.",
      "Project-based work starts from $3k for scoped deliveries and scales with complexity.",
      "Full-time roles: $4k to $10k per month depending on scope, location and impact.",
      "Rates vary by engagement type.",
      "The best next step is a 15-min call via the Book a Call button.",
    ],
  },

  process: {
    id: "profile-process",
    category: "profile",
    title: "Process",
    tags: [
      "process",
      "how he works",
      "workflow",
      "delivery",
      "sprints",
      "demos",
      "run",
      "client",
      "project",
      "engagement",
      "discovery",
    ],
    content: [
      "Every engagement starts with an architecture document (1 to 3 days of discovery).",
      "Delivery is sprint-based with weekly demos.",
      "CodeLens runs on every pull request, so findings ship alongside every change.",
      "Clients get full transparency: shared staging, the Supabase dashboard and PR-by-PR visibility.",
    ],
  },

  principles: {
    id: "profile-principles",
    category: "profile",
    title: "Principles",
    tags: [
      "principles",
      "approach",
      "philosophy",
      "human-in-the-loop",
    ],
    content: [
      "Human-in-the-loop by default for anything that touches money or commitments.",
      "Architect first, code second.",
      "Strict at system boundaries, trust internal invariants.",
      "Both a consumer and a producer of AI tooling.",
      "One task per agent session, no context contamination.",
      "Deploy behind feature flags: 10% rollout, monitor, then full.",
    ],
  },

 
  stack: {
    id: "profile-stack",
    category: "profile",
    title: "Technology Stack and Technical Skills",
    tags: [
      "stack",
      "tech stack",
      "technology stack",
      "technical stack",
      "technologies",
      "technology",
      "technical skills",
      "tools",
      "languages",
      "programming languages",
      "frameworks",
      "libraries",
      "frontend",
      "backend",
      "full-stack",
      "infrastructure",
      "AI",
      "development tools",
    ],
    content: [
      "His technology stack, tech stack, and technical skills include AI engineering, full-stack development, programming languages, frameworks, libraries, and infrastructure tools.",
      "AI stack: Claude (Opus, Sonnet), OpenAI (GPT-4o, o1), RAG (pgvector, Pinecone), LangChain, multi-agent orchestration, human-in-the-loop.",
      "Full-stack technologies: React, Next.js, React Native (Expo), TypeScript, Python, FastAPI, Supabase, Stripe, Docker.",
      "Infrastructure tools: GitHub Actions CI/CD, Docker Compose, Traefik, Sentry, Grafana, n8n, Cloudflare, Vercel.",
      "Kubernetes, AWS, Azure and GCP managed services are not part of his current technology stack.",
      "He runs Docker Compose and Traefik on self-managed servers instead of Kubernetes, and can adopt it if a role requires it.",
    ],
  },


  notInStack: {
    id: "profile-not-in-stack",
    category: "profile",
    title: "NOT in Stack",
    tags: [
      "not in stack",
      "kubernetes",
      "aws",
      "azure",
      "gcp",
      "cloud infrastructure",
    ],
    content: [
      "Kubernetes, AWS, Azure and GCP managed services are not part of his current stack.",
      "He runs Docker Compose and Traefik on self-managed servers instead of Kubernetes, and can adopt them if a role requires it.",
    ],
  },
};
