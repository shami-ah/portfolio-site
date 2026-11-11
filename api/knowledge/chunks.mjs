
export const knowledgeChunks = [
  // ─── OPENEVENT ──────────────────────────────────────────
  {
    id: "openevent-overview",
    project: "OpenEvent",
    category: "overview",
    tags: ["events", "automation", "email", "business"],
    text: `
OpenEvent is an AI-powered event operations platform.
It helps teams automate repetitive event-management work.
It processes incoming emails, understands their intent, extracts
important information, and prepares actions for human review.
The platform has supported 100+ active clients and processed
150+ events in eight months.
    `.trim(),
  },
  {
    id: "openevent-technical",
    project: "OpenEvent",
    category: "technical",
    tags: ["architecture", "pgvector", "human-in-the-loop", "integrations"],
    text: `
OpenEvent uses email ingestion through Gmail, Outlook, and IMAP.
Its AI pipeline performs intent classification and entity extraction.
It uses pgvector to retrieve historical context and supports
declarative JSON/YAML workflows. Integrations include Calendar,
Stripe, and CRM systems. Human approval is required before actions
involving money or commitments. Its technology stack includes
React, TypeScript, Supabase, OpenAI, pgvector, Stripe, and Docker.
    `.trim(),
  },
  {
    id: "openevent-impact",
    project: "OpenEvent",
    category: "results",
    tags: ["metrics", "time-saving", "productivity", "90 minutes", "83%"],
    text: `
OpenEvent results (same figures as the portfolio's projects.ts):
Before OpenEvent, each event team spent about 1.5 hours (90 minutes)
a day reading and triaging booking emails. With OpenEvent they spend
about 15 minutes reviewing the AI-drafted actions and approving them,
roughly 83% less manual coordination time.
River Soellner, Founder of More Life Hospitality, says the AI layer
saves the team about 90 minutes a day (client testimonial).
OpenEvent grew to 100+ active clients and 150+ events in eight months
with no sales team. The platform has since grown into memberships,
wallets, gift cards and in-venue POS.
    `.trim(),
  },

  // ─── CODELENS ───────────────────────────────────────────
  {
    id: "codelens-overview",
    project: "CodeLens",
    category: "overview",
    tags: ["code-review", "security", "static-analysis"],
    text: `
CodeLens is a local code-review engine that identifies potential
bugs and security issues in software projects. It analyzes code
across multiple technology stacks and provides fast feedback
without requiring a large runtime dependency.
    `.trim(),
  },
  {
    id: "codelens-technical",
    project: "CodeLens",
    category: "technical",
    tags: ["AST", "taint-analysis", "OWASP", "CWE", "patterns"],
    text: `
CodeLens uses AST-aware parsing, a persistent call and schema index,
and source-to-sink taint tracking. It checks code against security
patterns related to OWASP and CWE. The knowledge base records
about 544 detection patterns across nine stacks. Its engine is approximately
351 KB and has zero runtime dependencies.
    `.trim(),
  },
  {
    id: "codelens-impact",
    project: "CodeLens",
    category: "results",
    tags: ["metrics", "pull-requests", "coverage", "security"],
    text: `
CodeLens patterns were learned from 3,360+ production pull
requests across nine technology stacks. Analysis completes in
under one second. A gap analysis against Greptile identified
12 missed issues. Pattern improvements increased coverage from
8% to 100% for the evaluated issue set.
    `.trim(),
  },

  // ─── GOGAA CLI ──────────────────────────────────────────
  {
    id: "gogaa-overview",
    project: "Gogaa CLI",
    category: "overview",
    tags: ["CLI", "coding-agent", "open-source", "AI"],
    text: `
Gogaa CLI is an open-source AI coding agent built with TypeScript.
It helps developers work with AI models directly from the terminal.
It supports multiple LLM providers and can automatically fall back
to another provider when one is unavailable.
    `.trim(),
  },
  {
    id: "gogaa-technical",
    project: "Gogaa CLI",
    category: "technical",
    tags: ["providers", "tools", "MCP", "plugins", "terminal"],
    text: `
Gogaa CLI supports 11 LLM providers, more than 24 tools,
22 themes, a plugin marketplace, and MCP integration.
It includes a React Ink terminal interface and WAL-based
session persistence. Its JSON parsing improvements increased
tool-call parsing success from approximately 70% to 95%.
    `.trim(),
  },
  {
    id: "gogaa-impact",
    project: "Gogaa CLI",
    category: "results",
    tags: ["tests", "benchmarks", "metrics"],
    text: `
Gogaa CLI has more than 1,400 tests. In multi-file editing
benchmarks, it succeeded in eight out of nine cases.
Its automatic provider fallback helps maintain continuity
when an AI provider is unavailable.
    `.trim(),
  },

  // ─── RASAD ──────────────────────────────────────────────
  {
    id: "rasad-overview",
    project: "Rasad",
    category: "overview",
    tags: ["AI", "observability", "sessions", "local"],
    text: `
Rasad is a local AI session observability tool. It helps developers
inspect and understand AI coding-agent activity across different
tools. It collects session data and makes conversations and tool
activity searchable.
    `.trim(),
  },
  {
    id: "rasad-technical",
    project: "Rasad",
    category: "technical",
    tags: ["SQLite", "FTS5", "Fastify", "React", "privacy"],
    text: `
Rasad uses SQLite FTS5 for full-text search, Fastify for its
backend, and React for its interface. It supports data from
four AI tools. Its architecture keeps data local and makes
no outbound requests.
    `.trim(),
  },
  {
    id: "rasad-impact",
    project: "Rasad",
    category: "results",
    tags: ["metrics", "sessions", "messages", "ingestion"],
    text: `
Rasad has processed 656 sessions, more than 38,000 messages,
and more than 14,000 tool calls. It has handled over 700 MB
of data, with a first sync taking approximately 6.2 seconds.
    `.trim(),
  },

  // ─── COMMAND CENTER ─────────────────────────────────────
  {
    id: "command-center-overview",
    project: "Command Center",
    category: "overview",
    tags: ["PWA", "productivity", "email", "calendar", "tasks"],
    text: `
Command Center is a productivity application that brings Gmail,
Calendar, and tasks into one interface. It helps users manage
their daily work from a unified workspace.
    `.trim(),
  },
  {
    id: "command-center-technical",
    project: "Command Center",
    category: "technical",
    tags: ["Claude", "Gemini", "Supabase", "offline"],
    text: `
Command Center uses two AI systems, Claude and Gemini,
alongside Supabase. It is an installable Progressive Web App
with offline support. Its inbox triage workflow reduces
email-processing effort by approximately 60%.
    `.trim(),
  },

  // ─── GLUTEN-FREE DEALS & DINING ──────────────────────────
  {
    id: "gluten-free-overview",
    project: "Gluten-Free Deals & Dining",
    category: "overview",
    tags: ["mobile", "food", "restaurants", "gluten-free"],
    text: `
Gluten-Free Deals & Dining helps users discover gluten-free
products, deals, restaurants, and recipes. It combines product
discovery with location-based restaurant information.
    `.trim(),
  },
  {
    id: "gluten-free-technical",
    project: "Gluten-Free Deals & Dining",
    category: "technical",
    tags: ["React Native", "Next.js", "retailers", "LLM"],
    text: `
The platform covers more than 40 retailers and 30 brands.
It uses more than 200 LLM-generated queries per category
to support product discovery. Its technology includes
React Native and Next.js, with GPS-based restaurant discovery.
    `.trim(),
  },

  // ─── PORTABLE DEV ENVIRONMENT ───────────────────────────
  {
    id: "portable-dev-overview",
    project: "Portable Dev Environment",
    category: "overview",
    tags: ["Docker", "developer-tools", "environment"],
    text: `
Portable Dev Environment provides developers with a consistent,
ready-to-use development setup. Its goal is to reduce setup
time and make development environments easier to reproduce.
    `.trim(),
  },
  {
    id: "portable-dev-technical",
    project: "Portable Dev Environment",
    category: "technical",
    tags: ["Docker", "Node", "Python", "Deno", "Postgres", "Redis"],
    text: `
The environment supports Node.js, Python, Deno, and Playwright,
along with PostgreSQL and Redis. Docker is used to make the
environment portable and consistent. Its onboarding process
takes approximately 10 minutes.
    `.trim(),
  },
  {
    id: "portable-dev-impact",
    project: "Portable Dev Environment",
    category: "results",
    tags: ["WISC", "context", "optimization", "metrics"],
    text: `
The project reduced WISC context size from 72 KB to 11.7 KB,
an approximately 84% reduction. This helps make development
context more compact and efficient.
    `.trim(),
  },

  // ─── AI AGENT ORCHESTRATOR ───────────────────────────────
  {
    id: "orchestrator-overview",
    project: "AI Agent Orchestrator",
    category: "overview",
    tags: ["multi-agent", "orchestration", "AI"],
    text: `
AI Agent Orchestrator is a multi-agent system inspired by CAMEL.
It coordinates specialized AI agents to plan work, execute tasks,
and validate results rather than relying on one agent for everything.
    `.trim(),
  },
  {
    id: "orchestrator-technical",
    project: "AI Agent Orchestrator",
    category: "technical",
    tags: ["Planner", "Worker", "Validator", "DAG", "state-machine"],
    text: `
The architecture uses Planner, Worker, and Validator roles.
It includes an 18-file architecture, task DAG, state machine,
memory, and a three-round critique process. Its technology
includes TypeScript, Node.js, Anthropic, OpenAI, and Zod.
    `.trim(),
  },

  // ─── AI AGENT SYSTEM ────────────────────────────────────
  {
    id: "ai-agent-system-overview",
    project: "AI Agent System",
    category: "overview",
    tags: ["autonomous-agents", "automation", "AI"],
    text: `
AI Agent System is a collection of five autonomous agents.
The agents support job searching, research, code review,
Upwork proposal writing, and n8n webhook workflows.
    `.trim(),
  },
  {
    id: "ai-agent-system-technical",
    project: "AI Agent System",
    category: "technical",
    tags: ["FastAPI", "Groq", "Tavily", "GitHub", "HuggingFace"],
    text: `
The system uses FastAPI, Groq, Tavily, the GitHub API,
and Hugging Face Spaces. It provides multiple focused agents
for automating different research and development tasks.
Its hosting setup has a reported monthly cost of $0.
    `.trim(),
  },
];
