export interface ProjectData {
  slug: string;
  title: string;
  subtitle: string;
  type: string;
  /** Short 1-2 sentence summary for project cards. Falls back to impact if not set. */
  cardSummary?: string;
  /** Single punchy sentence for full-screen flagship display. */
  oneLiner?: string;
  impact: string;
  problem: string;
  solution: string;
  architecture: string[];
  features: string[];
  techDecisions?: { title: string; description: string }[];
  stack: string[];
  results: string[];
  github?: string;
  /** Gitea repo path (e.g. "shami/gogaa-ts") — shows "Repo" button linking to README showcase */
  giteaRepo?: string;
  live?: string;
  featured?: boolean;
  /** Show "Request Access" button — opens access request form */
  requestAccess?: boolean;
  /** Decision tree: visitor picks what they'd do before seeing the real answer */
  decision?: {
    scenario: string;
    question: string;
    options: string[];
    /** Index into options[] — the "industry standard" answer people usually pick */
    commonChoice: number;
    /** Index into options[] — what Shami actually picked (can match common) */
    myChoice: number;
    reasoning: string;
  };
  /** Before/after impact metrics for the case study */
  measuredImpact?: {
    before: { value: string; unit: string; context: string };
    after: { value: string; unit: string; context: string };
    highlights: { n: string; l: string }[];
  };
  /** Split comparison: my approach vs the standard approach */
  vs?: {
    mine: { title: string; bullets: string[] };
    standard: { title: string; bullets: string[] };
  };
}

export const projects: ProjectData[] = [
  /* ------------------------------------------------------------------ */
  /*  OpenEvent                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "openevent",
    title: "OpenEvent",
    subtitle: "AI-Powered Event Management Platform",
    type: "Production SaaS",
    oneLiner: "AI turns client emails into approved bookings, invoices, and CRM updates.",
    cardSummary: "100+ clients in 8 months, no sales team. AI reads emails, proposes actions, humans approve with one click.",
    impact: "Grew to 100+ clients across 150+ events in 8 months with zero sales team — product-led adoption. Saves each team ~1.5 hours per day. AI classifies emails, proposes actions, and executes after human approval.",
    problem:
      "Event companies drown in emails and manual coordination. Staff spend hours triaging requests, copying data between systems, and chasing approvals. Simple automation breaks on ambiguous language.",
    solution:
      "An AI layer that ingests emails, classifies intent, extracts entities with pgvector context, and proposes actions. Humans approve with one click before anything touches money or commitments. Declarative JSON workflows make the system extensible without code changes.",
    architecture: [
      "Email Ingestion (Gmail / Outlook / IMAP)",
      "AI Intent Classification",
      "Entity Extraction + pgvector Context",
      "Human-in-the-Loop Approval Gate",
      "Declarative Workflow Engine (JSON/YAML)",
      "Execution (Calendar, Stripe, CRM, Email)",
      "Audit Log + Telemetry",
    ],
    features: [
      "Email-to-task pipeline with AI intent classification and entity extraction",
      "Human-in-the-loop: AI drafts, humans approve before any execution",
      "Declarative workflow engine — non-engineers can add steps without code",
      "Semantic search via pgvector for template matching and client history",
      "Full integrations: Calendar, Stripe invoicing, CRM sync, webhooks",
    ],
    techDecisions: [
      {
        title: "Human-in-the-loop by default",
        description: "Event coordination is full of ambiguity. AI proposes, humans approve — this trust boundary is why adoption was immediate. The fully automated competitor clients tried before failed on day two.",
      },
      {
        title: "pgvector inside Postgres",
        description: "No separate vector DB. Embeddings live next to relational data — one query joins both. Zero sync lag, zero extra infra.",
      },
      {
        title: "Declarative workflow engine",
        description: "Workflows are JSON/YAML, not TypeScript. Adding an approval step or integration is a config change, not a deploy.",
      },
    ],
    stack: ["React", "TypeScript", "Supabase", "OpenAI", "pgvector", "Stripe", "Docker"],
    results: [
      "100+ active clients, 150+ events managed",
      "~80% reduction in manual coordination time",
      "Response time dropped from hours to minutes",
      "Full CI/CD with staging and production environments",
    ],
    live: "https://openevent.io",
    featured: true,
    measuredImpact: {
      before: { value: "~1.5", unit: "hrs", context: "per team, per day, reading & triaging email" },
      after: { value: "~15", unit: "min", context: "review AI-drafted actions & approve" },
      highlights: [
        { n: "100+", l: "active clients" },
        { n: "150+", l: "events run" },
        { n: "83%", l: "time saved" },
      ],
    },
    decision: {
      scenario: "An event company gets 100+ ambiguous client emails daily. They want AI to handle it.",
      question: "How do you design the system?",
      options: [
        "Full automation: AI reads, decides, executes",
        "AI drafts action, human approves before execution",
        "Classification only, humans do the rest",
      ],
      commonChoice: 0,
      myChoice: 1,
      reasoning:
        "Full automation fails on the first misread. Event coordination needs judgment. I designed AI to handle extraction and proposal — humans approve before anything touches money. That trust boundary is why clients actually use it.",
    },
    vs: {
      mine: {
        title: "OpenEvent",
        bullets: [
          "AI classifies, extracts, proposes — human approves",
          "JSON/YAML workflows, extensible without code",
          "pgvector inside Postgres, no extra infra",
          "Full audit log with auto-approval learning",
        ],
      },
      standard: {
        title: "Full-automation AI",
        bullets: [
          "AI decides and executes with no human gate",
          "Breaks on ambiguous input, fast trust erosion",
          "Hardcoded workflows, every change = deploy",
          "No audit trail when AI makes wrong call",
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ */
  /*  CodeLens                                                           */
  /* ------------------------------------------------------------------ */
  {
    slug: "codelens",
    title: "CodeLens",
    subtitle: "AI Code Review Engine",
    type: "AI Dev Tool",
    cardSummary: "445 patterns mined from 600+ production PRs. Reviews in under one second, entirely on your machine.",
    oneLiner: "445 bug patterns mined from 600+ real PRs. Under one second. Code never leaves your machine.",
    impact: "445 hand-crafted patterns mined from 600+ production PRs across 9 stacks. Reviews in under one second, entirely on your machine. When a commercial AI reviewer (Greptile) caught 12 issues CodeLens missed, I ran a gap analysis and closed every one — coverage went from 8% to 100%.",
    problem:
      "Existing tools are either fast but shallow (linters catching style, not logic) or deep but cloud-dependent (sending your code to a third party). Neither catches the bugs that actually ship: missing auth guards, silent N+1 queries, cross-file taint paths.",
    solution:
      "Deterministic patterns first, then AI for what patterns can't express. A persistent codebase index (call graph, schema graph) enables cross-file analysis. Source-to-sink taint tracking follows user input to dangerous sinks. Guardian mode injects rules into AI coding assistants to prevent bugs at generation time.",
    architecture: [
      "Git Diff → AST-aware Parser",
      "Persistent Index (call graph + schema graph)",
      "Pattern Scan (~445 patterns, 9 stacks)",
      "Source-to-Sink Taint Tracking",
      "Focused AI Security Probes",
      "PR Risk Score (8 factors)",
      "Self-Learning Noise Filter",
    ],
    features: [
      "~445 patterns mapped to real production failures, tagged with OWASP/CWE",
      "Persistent codebase index with 60ms incremental updates",
      "Source-to-sink taint tracking across files with CWE mapping",
      "Guardian mode: injects rules into Claude Code, Cursor, Copilot at prompt level",
      "Zero runtime deps — single 351KB file, runs anywhere Node runs",
    ],
    techDecisions: [
      {
        title: "Hand-crafted patterns over imported rule sets",
        description: "Existing rule sets cover style, not production failures. Every CodeLens pattern comes from a real bug: missing .limit() on Supabase queries, hooks after conditional returns, catch blocks swallowing errors silently.",
      },
      {
        title: "Persistent index over re-parsing",
        description: "First build: 4s on a 1,622-file codebase. After that: 60ms incremental. This makes cross-file analysis viable as a pre-commit hook.",
      },
      {
        title: "Patterns first, AI second",
        description: "445 deterministic patterns in <1s, then focused AI probes for semantic bugs no regex can catch. Coverage went from 8% to 100% on a head-to-head benchmark against a commercial AI reviewer.",
      },
    ],
    stack: ["TypeScript", "Docker", "esbuild", "Persistent JSON Index", "GitHub Actions", "GHCR"],
    results: [
      "~445 patterns across 9 stacks, validated against real production repos",
      "7-file PR review in 780ms, full 456-file PR in 12s",
      "Zero deps: single 351KB file, Docker image auto-published to GHCR",
      "Glean pipeline processed 660+ PRs, Agent Harvest added 34 patterns",
    ],
    giteaRepo: "shami/codelens",
    featured: true,
    measuredImpact: {
      before: { value: "8%", unit: "", context: "coverage vs commercial AI reviewer (Greptile)" },
      after: { value: "100%", unit: "", context: "all 12 gaps closed after gap analysis" },
      highlights: [
        { n: "445", l: "patterns" },
        { n: "<1s", l: "review time" },
        { n: "351KB", l: "zero deps" },
      ],
    },
    decision: {
      scenario: "Production bugs keep slipping past SonarQube + ESLint + AI review. They span multiple files with user input reaching DB queries unvalidated.",
      question: "What do you build?",
      options: [
        "More ESLint rules",
        "Pay for commercial AI review SaaS",
        "Custom engine with cross-file taint tracking",
      ],
      commonChoice: 1,
      myChoice: 2,
      reasoning:
        "ESLint stays single-file. Commercial SaaS sends code to a third party and still misses schema bugs. I built a hybrid: hand-crafted patterns + persistent call graph + taint tracer. Runs fully local, <1s reviews.",
    },
    vs: {
      mine: {
        title: "CodeLens",
        bullets: [
          "~445 patterns validated against real failures",
          "Persistent index, 60ms incremental updates",
          "Taint tracking across files with CWE mapping",
          "Zero deps, 351KB, runs anywhere Node runs",
        ],
      },
      standard: {
        title: "SonarQube / commercial SaaS",
        bullets: [
          "Generic style rules, not production failures",
          "Cloud-dependent, code leaves the repo",
          "Single-file analysis, no cross-file tracing",
          "Heavy setup: Java runtime, server, database",
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ */
  /*  Gogaa CLI                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "gogaa-cli",
    title: "Gogaa CLI",
    subtitle: "AI Coding Agent — Any Model, Any Provider",
    type: "Developer Tool / CLI",
    featured: true,
    requestAccess: true,
    cardSummary: "11 providers behind one interface. If one goes down, you don't stop working. 1,400+ tests, zero vendor lock-in.",
    oneLiner: "11 providers behind one interface. If one goes down, you don't stop working.",
    impact: "The only open-source AI coding CLI where the provider is a variable — 11 providers with automatic fallback, so rate-limits never stop your work. Production-grade git workflow, polished React Ink TUI, plugin marketplace, and 1,400+ passing tests.",
    problem:
      "Every AI coding tool makes you choose: provider freedom or deep integration. Polished TUI or serious git workflow. MCP support or surgical edits. If your provider rate-limits, you stop working.",
    solution:
      "A TypeScript CLI where the provider is a variable. 11 providers behind one unified streaming interface with automatic fallback. Production-grade git workflow (repo map, SEARCH/REPLACE edits, LLM commits). React Ink TUI with 22 themes. Plugin marketplace, MCP support, parallel agent panes, scheduled triggers, and a companion web terminal.",
    architecture: [
      "Provider Manager (11 providers, auto-fallback)",
      "Tool Registry (24+ tools)",
      "SEARCH/REPLACE Editor",
      "Agentic Loop (streaming, stuck detection, auto-retry)",
      "Git Layer (repo map, LLM commits, watch mode)",
      "React Ink TUI (22 themes, command palette)",
      "Session Layer (WAL persistence, crash recovery)",
    ],
    features: [
      "11 LLM providers with unified streaming and automatic fallback on rate-limits",
      "Production git workflow: tier-aware repo map, surgical edits, LLM commits, watch mode",
      "React Ink TUI with streaming output, inline diffs, 22 themes, plugin marketplace",
      "5-strategy JSON parser brought tool call success from ~70% to ~95%",
      "WAL session persistence — crash mid-task, resume with zero lost work",
    ],
    techDecisions: [
      {
        title: "5-strategy JSON parser",
        description: "Models don't return valid JSON in practice. Progressive fallback parsing (strict → trim → unescape → reconstruct → extract) brought tool call success from ~70% to ~95% on real sessions.",
      },
      {
        title: "React Ink for TUI",
        description: "Proper component model instead of raw ANSI escape codes. Streaming, permission prompts, status bar, and plugin manager are all independent stateful components.",
      },
      {
        title: "WAL session persistence",
        description: "Write-ahead log appends each message as it arrives. Resume by ID after crashes, model switches, or reboots with zero lost work.",
      },
    ],
    stack: ["TypeScript", "Node.js", "React Ink", "Anthropic SDK", "OpenAI SDK", "LSP Protocol", "WebSocket"],
    results: [
      "1,400+ passing tests, 0 failures",
      "11 providers with auto-fallback, 8/9 pass multi-file edit benchmarks",
      "~95% tool call success rate (up from ~70%)",
      "Intent-based lazy context: 3,909 → 24 tokens for simple prompts",
    ],
    giteaRepo: "shami/gogaa-ts",
    measuredImpact: {
      before: { value: "~70%", unit: "", context: "tool call success rate with raw model JSON" },
      after: { value: "~95%", unit: "", context: "after 5-strategy progressive JSON parser" },
      highlights: [
        { n: "1,400+", l: "tests passing" },
        { n: "11", l: "providers" },
        { n: "84%", l: "context saved" },
      ],
    },
    decision: {
      scenario: "Every AI coding CLI is locked to one vendor. If the API goes down, you stop working.",
      question: "What would you build?",
      options: [
        "Fork an existing CLI and add providers",
        "Thin wrapper with better UI",
        "New CLI where the provider is a variable and everything is first-class",
      ],
      commonChoice: 0,
      myChoice: 2,
      reasoning:
        "Forking means inheriting vendor assumptions. Wrapping means fighting their architecture. I built from scratch so every subsystem (provider, TUI, git, tools, session) is first-class and swappable.",
    },
    vs: {
      mine: {
        title: "Gogaa CLI",
        bullets: [
          "11 providers, auto-fallback on rate-limits",
          "Production git: repo map, surgical edits, watch mode",
          "React Ink TUI with plugin marketplace",
          "WAL persistence — crash = zero lost work",
        ],
      },
      standard: {
        title: "Single-vendor CLIs",
        bullets: [
          "Locked to one provider",
          "No cross-tool feature completeness",
          "Spartan TUI, no plugins",
          "Stop working on rate-limits",
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ */
  /*  Rasad                                                              */
  /* ------------------------------------------------------------------ */
  {
    slug: "rasad",
    title: "Rasad",
    subtitle: "AI Session Observatory for Developers",
    type: "Developer Tool / CLI + Web",
    featured: true,
    cardSummary: "656 sessions analyzed — every tool call, every file touch, graded A-F. Your data never leaves your machine.",
    oneLiner: "656 sessions analyzed — every tool call, every file touch, graded A-F. 100% local.",
    impact: "The observability layer for AI-assisted development. 656 sessions across 4 tools, 38K messages, 14K tool calls — every action replayed, every session graded A-F. Found that routine tasks on Opus cost 18x more than Sonnet with no quality difference. 100% local, zero outbound requests.",
    problem:
      "AI coding assistants are black boxes. You don't know how many tokens were burned, whether context was lost mid-session, or if that $87 session could have been three $8 sessions. Zero observability for a major engineering budget line.",
    solution:
      "A local-first CLI + web dashboard that ingests session data from multiple AI tools. SQLite with FTS5 handles 700MB+ with streaming parsers. X-Ray replays sessions action-by-action. Quality grading scores A-F. Model comparison shows cost per session by model. Everything on localhost, zero outbound requests.",
    architecture: [
      "Data Adapters (Claude Code, Gogaa, Codex CLI)",
      "SQLite (WAL mode, FTS5 full-text search)",
      "Streaming Parsers (700MB+ without memory overflow)",
      "Fastify API (localhost, WebSocket live updates)",
      "React Dashboard (15+ views, Recharts)",
      "React Ink TUI (real-time monitoring, alerts)",
      "Quality Scoring Engine (A-F grading)",
    ],
    features: [
      "X-Ray: action-by-action session replay with phase labels and timing",
      "Session Quality grading (A-F) based on efficiency, cost, and self-correction",
      "Model comparison: cost per session by model, head-to-head analysis",
      "Full-text search across 38K+ messages with SQLite FTS5",
      "100% local — zero outbound network requests, data never leaves your machine",
    ],
    techDecisions: [
      {
        title: "SQLite over Postgres for a local tool",
        description: "No database process, no connection strings. WAL mode gives concurrent reads/writes. FTS5 gives full-text search. The whole DB is one file at ~/.rasad/rasad.db.",
      },
      {
        title: "Streaming parsers for ingestion",
        description: "Claude Code session files can reach hundreds of MB. Line-by-line streaming never holds more than one line in memory.",
      },
      {
        title: "Dual interface: web + terminal",
        description: "Dashboard for rich visualizations, TUI for real-time monitoring without leaving the terminal. Same Fastify API backs both.",
      },
    ],
    stack: ["TypeScript", "SQLite", "Fastify", "React 19", "Vite", "Recharts", "React Ink"],
    results: [
      "656 sessions synced from 4 AI tools in one dashboard",
      "38K messages, 14K tool calls indexed with full-text search",
      "First sync: 6.2s for 700MB+. Incremental: <1s",
      "Zero outbound requests — 100% local-first",
    ],
    github: "https://github.com/shami-ah/rasad",
    measuredImpact: {
      before: { value: "$0", unit: "", context: "visibility into AI tool behavior and cost" },
      after: { value: "656", unit: "", context: "sessions analyzed with action-level replay" },
      highlights: [
        { n: "38K", l: "messages indexed" },
        { n: "14K", l: "tool calls tracked" },
        { n: "6.2s", l: "first sync (700MB)" },
      ],
    },
    decision: {
      scenario: "You're spending $500+/day on AI tools with zero visibility into what the AI is doing or whether sessions are efficient.",
      question: "How do you get observability?",
      options: [
        "Check API billing dashboards",
        "Build custom logging into each tool",
        "Build a unified observatory that reads session files directly",
      ],
      commonChoice: 0,
      myChoice: 2,
      reasoning:
        "Billing shows cost, not behavior. Custom logging requires modifying each tool. Rasad sits outside, reads session files directly, gives one dashboard with replay, grading, and cost tracking across every AI tool.",
    },
    vs: {
      mine: {
        title: "Rasad",
        bullets: [
          "Multi-tool: Claude Code + Gogaa + Codex in one view",
          "Action-level X-Ray replay",
          "Session quality grading (A-F)",
          "100% local, data never leaves your machine",
        ],
      },
      standard: {
        title: "API billing dashboards",
        bullets: [
          "Single provider, no cross-tool view",
          "Cost only, no behavioral analysis",
          "No replay or action-level visibility",
          "Data on vendor servers",
        ],
      },
    },
  },

  /* ------------------------------------------------------------------ */
  /*  Command Center                                                     */
  /* ------------------------------------------------------------------ */
  {
    slug: "command-center",
    title: "Command Center",
    subtitle: "Personal AI Operations PWA",
    type: "Developer Tool",
    impact: "A single interface unifying email, calendar, and tasks with AI triage. Dual AI backends (Claude + Gemini), real Gmail/Calendar integration, installable as PWA.",
    problem:
      "Developers juggle Gmail, Calendar, Notion, and separate dashboards per client. Context switching kills productivity. No single tool combines AI triage with real integrations.",
    solution:
      "A PWA that pulls Gmail and Calendar via API, applies dual-AI triage (Claude for reasoning, Gemini for classification), and surfaces everything in one dashboard with real-time Supabase sync across devices.",
    architecture: [
      "PWA Shell (React + TypeScript)",
      "Dual AI: Claude + Gemini",
      "Gmail API + Calendar API",
      "Supabase (Postgres, Auth, Realtime)",
      "Task Board + AI Triage",
    ],
    features: [
      "Unified inbox with AI-powered intent classification and priority scoring",
      "Dual AI: Claude for complex reasoning, Gemini for fast classification",
      "Calendar integration with conflict detection",
      "PWA: installable on desktop and mobile, works offline",
      "Real-time sync across devices via Supabase",
    ],
    techDecisions: [
      {
        title: "Dual AI backends",
        description: "Claude handles complex email reasoning. Gemini handles fast classification. No vendor lock-in, plays to each model's strengths.",
      },
      {
        title: "PWA over native app",
        description: "Single codebase serves web, iOS, Android. Service workers enable offline and push notifications. No App Store approval needed.",
      },
    ],
    stack: ["React", "TypeScript", "Anthropic SDK", "Google Gemini", "Supabase", "Gmail API", "PWA"],
    results: [
      "Replaces 4+ separate tools in daily workflow",
      "AI triage reduces inbox processing by 60%",
      "Installable on desktop and mobile with offline support",
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  Gluten-Free Deals                                                  */
  /* ------------------------------------------------------------------ */
  {
    slug: "gluten-free",
    title: "Gluten-Free Deals & Dining",
    subtitle: "Cross-Platform Consumer App",
    type: "Web + iOS + Android",
    impact: "Cross-platform app aggregating deals from 40+ retailers, finding nearby restaurants, and generating recipes — powered by LLM-generated search queries.",
    problem:
      "Gluten-free consumers search scattered retailer sites for deals, have no way to find nearby safe restaurants, and lack reliable recipe sources. Existing apps cover one aspect, not all three.",
    solution:
      "An LLM generates 200+ targeted search queries per category (brands, retailers, products), concurrent scrapers aggregate deals, GPS finds nearby restaurants, and AI generates personalized recipes. Cross-platform via React Native + Next.js.",
    architecture: [
      "LLM Query Generator (200+ targeted queries)",
      "Concurrent Scraping (SerpAPI + Tavily)",
      "Deduplication & Relevance Scoring",
      "GPS Restaurant Finder (Google Maps)",
      "AI Recipe Generator",
      "Cross-platform UI (React Native + Next.js)",
    ],
    features: [
      "LLM-generated search queries covering 40+ retailers and 30+ brands dynamically",
      "Concurrent dual-API scraping with deduplication and freshness filtering",
      "GPS-based restaurant finder with allergy-safe filtering",
      "AI recipe generation with nutrition facts and substitution tips",
      "Unified experience across Web, iOS, and Android",
    ],
    techDecisions: [
      {
        title: "LLM query generation over hardcoded searches",
        description: "The LLM generates 200+ targeted queries dynamically. Covers new brands and retailers without code changes.",
      },
      {
        title: "React Native + Next.js shared codebase",
        description: "One team ships to three platforms with shared TypeScript business logic.",
      },
    ],
    stack: ["React Native", "Next.js", "Python", "OpenAI", "Firebase", "Google Maps", "SerpAPI"],
    results: [
      "Aggregates deals from 40+ retailers in real time",
      "200+ AI-generated queries per category",
      "Cross-platform: Web, iOS, Android from shared codebase",
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  Dev Environment                                                    */
  /* ------------------------------------------------------------------ */
  {
    slug: "dev-env",
    title: "Portable Dev Environment",
    subtitle: "Containerized Full-Stack Workspace",
    type: "Developer Infrastructure",
    impact: "One-command developer onboarding in 10 minutes. Docker container with full toolchain, AI coding assistant integration, and WISC context engineering that cut token costs by 84%.",
    problem:
      "Dev environments are fragile — different Node versions, missing CLIs, hours of setup. Add AI tooling: Claude Code was burning 72KB of context (35-40K tokens) before a single prompt.",
    solution:
      "A Docker container packaging the full toolchain (Node, Python, Deno, Playwright, 10+ CLIs) with WISC context engineering: lazy-loaded skills, path-scoped rules, compressed agent definitions. 72KB context down to 11.7KB, all capabilities preserved.",
    architecture: [
      "Dockerfile (multi-layer, ARM/x86)",
      "Docker Compose (dev + Postgres + Redis)",
      "Volume Mounts (code, SSH, secrets)",
      "Shell Environment (zsh + oh-my-zsh)",
      "Claude Code Integration (WISC-optimized)",
    ],
    features: [
      "ARM + x86 architecture-aware builds",
      "Full shell environment with Powerlevel10k, autosuggestions, syntax highlighting",
      "Claude Code integration with WISC-optimized lazy loading",
      "Playwright with Chromium for headless E2E inside the container",
      "Secrets mounted at runtime, never baked into images",
    ],
    techDecisions: [
      {
        title: "Volume mounts over baked-in code",
        description: "Code lives on host, changes sync instantly. Deleting a container never loses work.",
      },
      {
        title: "WISC context engineering",
        description: "Write decisions to files, Isolate tasks per conversation, Select context by path, Compress agent definitions. 72KB → 11.7KB (84% reduction), zero capability loss.",
      },
    ],
    stack: ["Docker", "Docker Compose", "Ubuntu", "Node.js", "Playwright", "PostgreSQL", "Redis"],
    results: [
      "10 minutes from zero to first commit",
      "Identical environment across Mac, Linux VPS, and phone SSH",
      "WISC: 72KB → 11.7KB context (84% reduction)",
    ],
  },

  /* ------------------------------------------------------------------ */
  /*  Agent Orchestrator                                                 */
  /* ------------------------------------------------------------------ */
  {
    slug: "agent-orchestrator",
    title: "AI Agent Orchestrator",
    subtitle: "CAMEL Multi-Agent Framework",
    type: "AI Framework",
    impact: "A production-grade multi-agent framework implementing CAMEL: Planner decomposes goals, Workers execute with tools, Validator runs iterative critique loops. 18 files, clean architecture, fully open-source.",
    problem:
      "Most agent frameworks are either toy demos or massive dependency trees that obscure what's happening. Needed something small enough to understand completely but production-grade enough for real tasks.",
    solution:
      "Four agent roles (Planner, Worker, Validator, Orchestrator), a formal task state machine, and CAMEL-inspired iterative critique. The Validator generates structured feedback that gets injected into the Worker's next attempt. Error patterns persist in memory for cross-task learning.",
    architecture: [
      "Orchestrator (DAG-based task execution)",
      "Planner Agent (goal decomposition)",
      "Worker Agent (tool-use loop)",
      "Validator Agent (iterative critique, 3 rounds)",
      "Task State Machine (6 states)",
      "Memory Store (error pattern persistence)",
    ],
    features: [
      "Iterative CAMEL critique: structured feedback loops, up to 3 rounds per task",
      "Cross-task learning: error patterns persist in memory",
      "Task DAG with dependency resolution and parallel execution",
      "Human-in-the-loop approval gates with state-based pausing",
      "Multi-provider: Claude and OpenAI adapters",
    ],
    techDecisions: [
      {
        title: "Iterative critique over single-pass validation",
        description: "Validation feedback pipes directly into the Worker's next attempt. First attempt is often 70% right; three rounds get it to 95%.",
      },
      {
        title: "18 files, zero unnecessary abstraction",
        description: "Every file has one clear responsibility. No DI framework, no plugin system, no config format. Readable in an hour.",
      },
    ],
    stack: ["TypeScript", "Node.js", "Anthropic SDK", "OpenAI SDK", "Zod"],
    results: [
      "Clean 18-file architecture, fully open-source",
      "CAMEL critique loop with iterative refinement",
      "Cross-task learning via error pattern memory",
      "State machine prevents invalid task transitions",
    ],
    github: "https://github.com/shami-ah/ai-agent-orchestrator",
  },

  /* ------------------------------------------------------------------ */
  /*  AI Agent System                                                    */
  /* ------------------------------------------------------------------ */
  {
    slug: "agent-system",
    title: "AI Agent System",
    subtitle: "5 Purpose-Built AI Agents",
    type: "AI Agents",
    featured: true,
    impact: "5 autonomous agents (job search, research, code review, proposals, freelance automation) with real tool-calling, deployed on HuggingFace Spaces at $0/month.",
    problem:
      "Needed AI that could actually DO things — search jobs, research tech, review PRs, draft proposals — each requiring different tools and domain knowledge. Running separate tools was slow.",
    solution:
      "A multi-agent system where each agent has a specific purpose, custom tools (web search, GitHub API, URL fetcher), and tailored prompts. Deployed on HuggingFace Spaces with a portfolio-ready web UI.",
    architecture: [
      "FastAPI Server (5 agent endpoints)",
      "Tool-Calling Engine",
      "Shared Tools (Tavily, URL fetcher, GitHub API)",
      "Agent Definitions (system prompt + tools per use case)",
      "Portfolio Web UI",
    ],
    features: [
      "Job Search Agent: multi-board search, fit evaluation, cover letter drafting",
      "Research Agent: multi-source research with cross-referenced reports",
      "Code Review Agent: fetches GitHub PR diffs, analyzes bugs and security",
      "Upwork Proposal Agent: reads postings, matches skills, drafts proposals",
      "n8n Webhook Agent: receives freelance messages, drafts replies",
    ],
    techDecisions: [
      {
        title: "Groq for inference",
        description: "Free tier, 300 tokens/sec, native tool-calling. Zero inference cost.",
      },
      {
        title: "Agent-per-purpose over general assistant",
        description: "Each agent has a focused prompt and curated tool set. Scoping prevents confusion and hallucination.",
      },
    ],
    stack: ["Python", "FastAPI", "Groq", "Tavily", "GitHub API", "HuggingFace Spaces", "Docker"],
    results: [
      "5 autonomous agents deployed and operational",
      "1-8 tool calls per request, fully automated",
      "$0/month hosting on free tiers",
      "API-first: callable from n8n, PWA, or any HTTP client",
    ],
    live: "https://shami96-deep-agent.hf.space",
  },
];

export function getProject(slug: string): ProjectData | undefined {
  return projects.find((p) => p.slug === slug);
}
