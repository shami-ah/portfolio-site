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
    oneLiner:
      "AI turns client emails into approved bookings, invoices, and CRM updates.",
    cardSummary:
      "100+ clients in 8 months. AI handles repetitive event coordination while people stay in control of important decisions.",
    impact:
      "Grew to 100+ clients across 150+ events in 8 months with no dedicated sales team. Teams save about 1.5 hours per day by letting AI organize incoming requests, prepare actions, and handle repetitive coordination.",
    problem:
      "Event companies spend hours managing emails, copying information between systems, coordinating bookings, and waiting for approvals. Simple automation often struggles when customer requests are unclear or incomplete.",
    solution:
      "OpenEvent reads incoming emails, understands what the customer needs, prepares the right actions, and lets a person approve them before anything important happens. It can then update bookings, invoices, calendars, CRM records, and other connected systems automatically.",
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
      "Turns incoming emails into organized tasks and suggested actions",
      "AI prepares actions while people approve important decisions",
      "Flexible workflows allow new business processes without rebuilding the system",
      "Searches client history and previous information to improve AI suggestions",
      "Connects calendars, invoicing, CRM systems, email, and webhooks",
    ],
    techDecisions: [
      {
        title: "Human approval for important actions",
        description:
          "Event coordination often contains ambiguous requests. AI prepares the action, but a person approves it before money or commitments are affected. This creates a safer and more trustworthy workflow.",
      },
      {
        title: "One database for business data and AI context",
        description:
          "Business information and AI search data live together in Postgres. This keeps the system simpler and avoids synchronizing a separate database.",
      },
      {
        title: "Flexible workflows",
        description:
          "Business workflows are stored as configuration rather than being hardcoded. This makes it easier to add approval steps or integrations without changing the core application.",
      },
    ],
    stack: [
      "React",
      "TypeScript",
      "Supabase",
      "OpenAI",
      "pgvector",
      "Stripe",
      "Docker",
    ],
    results: [
      "100+ active clients across 150+ events",
      "~80% reduction in manual coordination time",
      "Response time reduced from hours to minutes",
      "Separate staging and production environments with automated deployment",
    ],
    live: "https://openevent.io",
    featured: true,
    measuredImpact: {
      before: {
        value: "~1.5",
        unit: "hrs",
        context: "per team, per day, reading and organizing email",
      },
      after: {
        value: "~15",
        unit: "min",
        context: "reviewing AI-prepared actions and approving them",
      },
      highlights: [
        { n: "100+", l: "active clients" },
        { n: "150+", l: "events run" },
        { n: "83%", l: "time saved" },
      ],
    },
    decision: {
      scenario:
        "An event company receives 100+ customer emails every day and wants AI to help manage them.",
      question: "How should the system handle important customer requests?",
      options: [
        "Let AI read, decide, and execute everything automatically",
        "Let AI prepare the action and have a person approve it",
        "Use AI only to classify emails and let people handle everything else",
      ],
      commonChoice: 0,
      myChoice: 1,
      reasoning:
        "Important event requests can be ambiguous. AI handles the repetitive work of understanding and preparing actions, while a person approves anything that affects money or customer commitments.",
    },
    vs: {
      mine: {
        title: "OpenEvent",
        bullets: [
          "AI understands requests and prepares actions for approval",
          "Flexible workflows can be extended without rebuilding the product",
          "Business and AI context stay in one database",
          "Clear audit trail for important actions",
        ],
      },
      standard: {
        title: "Fully automated AI",
        bullets: [
          "AI makes decisions and executes them automatically",
          "Ambiguous requests can lead to incorrect actions",
          "Business changes often require code changes",
          "Harder to understand what happened after a mistake",
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
<<<<<<< Updated upstream
    cardSummary: "470 patterns mined from 860+ production PRs. Reviews in under one second, entirely on your machine.",
    oneLiner: "470 bug patterns mined from 860+ real PRs. Under one second. Code never leaves your machine.",
    impact: "470 hand-crafted patterns mined from 860+ production PRs across 9 stacks. Reviews in under one second, entirely on your machine. When a commercial AI reviewer (Greptile) caught 12 issues CodeLens missed, I ran a gap analysis and closed every one — coverage went from 8% to 100%.",
=======
    cardSummary:
      "544 real-world bug patterns from 860+ production PRs. Reviews code in under one second while keeping it on your machine.",
    oneLiner:
      "544 bug patterns from 860+ real PRs. Reviews in under one second. Code stays on your machine.",
    impact:
      "CodeLens analyzes code for real production problems using 544 patterns collected from 860+ production pull requests. Reviews can run in under one second, while the code stays on the developer's machine.",
>>>>>>> Stashed changes
    problem:
      "Many code-review tools focus on style or rely on cloud-based analysis. They can miss problems that involve multiple files, security checks, database usage, or how information moves through an application.",
    solution:
      "CodeLens combines fast rule-based checks with AI analysis. It understands how different parts of a codebase connect, follows potentially risky data across files, and highlights issues before they reach production.",
    architecture: [
      "Git Diff → AST-aware Parser",
      "Persistent Index (call graph + schema graph)",
      "Pattern Scan (~470 patterns, 9 stacks)",
      "Source-to-Sink Taint Tracking",
      "Focused AI Security Probes",
      "PR Risk Score (8 factors)",
      "Self-Learning Noise Filter",
    ],
    features: [
<<<<<<< Updated upstream
      "~470 patterns mapped to real production failures, tagged with OWASP/CWE",
      "Persistent codebase index with 60ms incremental updates",
      "Source-to-sink taint tracking across files with CWE mapping",
      "Guardian mode: injects rules into Claude Code, Cursor, Copilot at prompt level",
      "Zero runtime deps — single 351KB file, runs anywhere Node runs",
=======
      "544 patterns based on real production failures",
      "Keeps a searchable map of the codebase for faster analysis",
      "Tracks potentially dangerous data across multiple files",
      "Can provide rules to AI coding assistants to prevent common bugs",
      "Runs as a lightweight tool without requiring a large runtime setup",
>>>>>>> Stashed changes
    ],
    techDecisions: [
      {
        title: "Real production problems over generic rules",
        description:
          "The review patterns are based on bugs that actually appeared in production code, including missing security checks, unsafe database queries, and silently ignored errors.",
      },
      {
        title: "Remember the codebase instead of rebuilding the map",
        description:
          "CodeLens keeps an index of the project so later reviews only update what changed. A first build can take seconds, while incremental updates can complete in milliseconds.",
      },
      {
<<<<<<< Updated upstream
        title: "Patterns first, AI second",
        description: "470 deterministic patterns in <1s, then focused AI probes for semantic bugs no regex can catch. Coverage went from 8% to 100% on a head-to-head benchmark against a commercial AI reviewer.",
=======
        title: "Fast checks first, AI where it adds value",
        description:
          "Deterministic patterns handle known problems quickly. AI is then used for issues that require deeper understanding and cannot be reliably described by simple rules.",
>>>>>>> Stashed changes
      },
    ],
    stack: [
      "TypeScript",
      "Docker",
      "esbuild",
      "Persistent JSON Index",
      "GitHub Actions",
      "GHCR",
    ],
    results: [
<<<<<<< Updated upstream
      "~470 patterns across 9 stacks, validated against real production repos",
      "7-file PR review in 780ms, full 456-file PR in 12s",
      "Zero deps: single 351KB file, Docker image auto-published to GHCR",
      "Glean pipeline processed 860+ PRs, Agent Harvest added 34 patterns",
=======
      "~544 patterns across 9 technology stacks",
      "7-file PR review in 780ms, full 456-file PR in 12s",
      "Single 351KB file with no runtime dependencies",
      "3,360+ PRs processed through the analysis pipeline",
>>>>>>> Stashed changes
    ],
    giteaRepo: "shami/codelens",
    featured: true,
    measuredImpact: {
      before: {
        value: "8%",
        unit: "",
        context: "coverage compared with a commercial AI reviewer",
      },
      after: {
        value: "100%",
        unit: "",
        context: "coverage after analyzing and closing the identified gaps",
      },
      highlights: [
        { n: "470", l: "patterns" },
        { n: "<1s", l: "review time" },
        { n: "351KB", l: "tool size" },
      ],
    },
    decision: {
      scenario:
        "Production bugs keep getting through existing code-quality and AI review tools, especially problems involving multiple files.",
      question: "What kind of solution should you build?",
      options: [
        "Add more rules to an existing linting tool",
        "Use a commercial AI code-review service",
        "Build a custom review engine that understands the whole codebase",
      ],
      commonChoice: 1,
      myChoice: 2,
      reasoning:
        "Simple linting rules cannot understand many cross-file problems, while cloud-based tools require sending code to another service. CodeLens combines fast checks with deeper analysis and can run locally.",
    },
    vs: {
      mine: {
        title: "CodeLens",
        bullets: [
<<<<<<< Updated upstream
          "~470 patterns validated against real failures",
          "Persistent index, 60ms incremental updates",
          "Taint tracking across files with CWE mapping",
          "Zero deps, 351KB, runs anywhere Node runs",
=======
          "544 patterns based on real production failures",
          "Keeps a reusable map of the codebase",
          "Can trace risky data across multiple files",
          "Runs locally as a lightweight tool",
>>>>>>> Stashed changes
        ],
      },
      standard: {
        title: "Traditional code review tools",
        bullets: [
          "Often focus on generic style and common rules",
          "May require cloud-based analysis",
          "Limited understanding across multiple files",
          "Can require heavier infrastructure",
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
    cardSummary:
      "11 AI providers behind one interface. If one provider has a problem, work can continue automatically. 1,400+ tests and no vendor lock-in.",
    oneLiner:
      "11 AI providers behind one interface. If one goes down, you don't have to stop working.",
    impact:
      "Gogaa gives developers one AI coding workspace that can work with 11 different AI providers. Automatic fallback helps keep work moving when a provider reaches a limit or becomes unavailable, while 1,400+ tests help keep the product reliable.",
    problem:
      "Developers often have to choose between a polished AI coding experience and freedom to use different AI providers. When a provider reaches a limit or becomes unavailable, the workflow can stop completely.",
    solution:
      "Gogaa provides one coding workspace that can connect to multiple AI providers. It can automatically switch providers when needed while also providing Git workflows, plugins, tool integrations, session recovery, and a terminal-based interface.",
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
      "11 AI providers through one consistent interface",
      "Automatically switches providers when rate limits occur",
      "Git workflow with repository understanding, targeted edits, and generated commits",
      "Terminal interface with themes, plugins, and streaming responses",
      "Can recover interrupted sessions without losing previous work",
    ],
    techDecisions: [
      {
        title: "Reliable handling of model responses",
        description:
          "AI models do not always return perfectly formatted data. Multiple parsing strategies make tool calls more reliable and increased successful tool calls from about 70% to about 95% in real sessions.",
      },
      {
        title: "Component-based terminal interface",
        description:
          "The terminal experience uses reusable components for streaming output, permissions, status information, and plugin management instead of one large block of terminal code.",
      },
      {
        title: "Recoverable sessions",
        description:
          "Every message is saved as it arrives so an interrupted task can continue after a crash, restart, or model change without losing the previous work.",
      },
    ],
    stack: [
      "TypeScript",
      "Node.js",
      "React Ink",
      "Anthropic SDK",
      "OpenAI SDK",
      "LSP Protocol",
      "WebSocket",
    ],
    results: [
      "1,400+ passing tests with 0 failures",
      "11 AI providers with automatic fallback",
      "Tool call success improved from ~70% to ~95%",
      "Context usage reduced from 3,909 to 24 tokens for simple prompts",
    ],
    giteaRepo: "shami/gogaa-ts",
    measuredImpact: {
      before: {
        value: "~70%",
        unit: "",
        context: "tool call success rate with raw model responses",
      },
      after: {
        value: "~95%",
        unit: "",
        context: "after adding progressive response handling",
      },
      highlights: [
        { n: "1,400+", l: "tests passing" },
        { n: "11", l: "AI providers" },
        { n: "84%", l: "context saved" },
      ],
    },
    decision: {
      scenario:
        "A developer depends on one AI provider and their coding workflow stops whenever that provider reaches a limit or becomes unavailable.",
      question: "How should the product handle this?",
      options: [
        "Add more providers to an existing coding tool",
        "Build a simple wrapper around multiple providers",
        "Build one coding workspace where providers can be switched automatically",
      ],
      commonChoice: 0,
      myChoice: 2,
      reasoning:
        "A provider should not determine whether the whole workflow can continue. Gogaa treats the provider as replaceable while keeping the rest of the coding experience consistent.",
    },
    vs: {
      mine: {
        title: "Gogaa CLI",
        bullets: [
          "11 AI providers with automatic fallback",
          "Complete Git workflow for coding tasks",
          "Terminal interface with plugins and themes",
          "Interrupted sessions can be recovered",
        ],
      },
      standard: {
        title: "Single-provider AI tools",
        bullets: [
          "Usually tied to one AI provider",
          "Work can stop when that provider is unavailable",
          "Limited flexibility between providers",
          "Less control over the underlying workflow",
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
    cardSummary:
      "656 AI coding sessions analyzed. See what the AI did, how much it used, and where time or money was spent — while keeping data local.",
    oneLiner:
      "656 sessions analyzed — every tool call, every file touch, graded A-F. 100% local.",
    impact:
      "Rasad gives developers visibility into AI-assisted coding work. It has analyzed 656 sessions across 4 tools, including 38K messages and 14K tool calls, so developers can understand what happened during AI sessions and compare efficiency and cost.",
    problem:
      "AI coding assistants can feel like black boxes. It can be difficult to see what the AI did during a session, how much context it used, whether it corrected itself, or whether a task could have been completed more efficiently.",
    solution:
      "Rasad collects local session data from multiple AI tools and presents it in one dashboard. Developers can replay sessions step by step, search previous activity, compare models, review session quality, and understand AI usage without sending the underlying data to a cloud service.",
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
      "Step-by-step replay of AI sessions with timing and activity details",
      "Session quality grading from A-F based on efficiency, cost, and self-correction",
      "Compare AI models by session cost and performance",
      "Search across more than 38K messages",
      "Keeps data entirely on the local machine with no outbound requests",
    ],
    techDecisions: [
      {
        title: "Local database for a local-first product",
        description:
          "SQLite keeps the application simple and avoids running a separate database service. It also supports fast search and concurrent activity while keeping the data in one local file.",
      },
      {
        title: "Streaming large session files",
        description:
          "AI session files can become hundreds of megabytes. The application processes them gradually instead of loading the entire file into memory at once.",
      },
      {
        title: "Dashboard plus terminal interface",
        description:
          "The dashboard provides detailed visual analysis, while the terminal interface gives developers quick access to live monitoring and alerts.",
      },
    ],
    stack: [
      "TypeScript",
      "SQLite",
      "Fastify",
      "React 19",
      "Vite",
      "Recharts",
      "React Ink",
    ],
    results: [
      "656 sessions collected from 4 AI tools",
      "38K messages and 14K tool calls indexed",
      "First sync processes 700MB+ in 6.2 seconds",
      "Zero outbound requests — data stays local",
    ],
    github: "https://github.com/shami-ah/rasad",
    measuredImpact: {
      before: {
        value: "$0",
        unit: "",
        context: "visibility into AI tool behavior and cost",
      },
      after: {
        value: "656",
        unit: "",
        context: "sessions analyzed with detailed activity replay",
      },
      highlights: [
        { n: "38K", l: "messages indexed" },
        { n: "14K", l: "tool calls tracked" },
        { n: "6.2s", l: "first sync (700MB)" },
      ],
    },
    decision: {
      scenario:
        "A team uses AI coding tools heavily but cannot clearly see what the AI is doing, how sessions perform, or where money is being spent.",
      question: "How can the team get useful visibility?",
      options: [
        "Use each provider's billing dashboard",
        "Add custom logging to every AI tool",
        "Build one local dashboard that reads session data from different tools",
      ],
      commonChoice: 0,
      myChoice: 2,
      reasoning:
        "Billing dashboards show cost but not the actual work performed. Custom logging requires changes to every tool. Rasad reads the available session data and brings activity, replay, quality, and cost information into one place.",
    },
    vs: {
      mine: {
        title: "Rasad",
        bullets: [
          "Multiple AI tools in one dashboard",
          "Step-by-step activity replay",
          "Session quality grading",
          "Data stays on the local machine",
        ],
      },
      standard: {
        title: "AI provider dashboards",
        bullets: [
          "Usually limited to one provider",
          "Focus mainly on usage and cost",
          "Little visibility into the actual workflow",
          "Data is managed by the provider",
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
    impact:
      "A single workspace that brings email, calendar, and tasks together with AI-powered organization. It helps reduce context switching by putting everyday work in one place.",
    problem:
      "People often move between Gmail, calendars, task managers, and separate dashboards throughout the day. Constantly switching between tools makes it harder to stay focused.",
    solution:
      "Command Center brings email, calendar, and tasks into one installable workspace. AI helps organize incoming work, identify priorities, and surface useful information while keeping everything synchronized across devices.",
    architecture: [
      "PWA Shell (React + TypeScript)",
      "Dual AI: Claude + Gemini",
      "Gmail API + Calendar API",
      "Supabase (Postgres, Auth, Realtime)",
      "Task Board + AI Triage",
    ],
    features: [
      "One workspace for email, tasks, and calendar information",
      "AI organizes incoming work and identifies priorities",
      "Calendar integration with conflict detection",
      "Installable on desktop and mobile with offline support",
      "Real-time synchronization across devices",
    ],
    techDecisions: [
      {
        title: "Two AI models for different jobs",
        description:
          "One model handles more complex reasoning while another handles faster classification. This balances capability and response speed.",
      },
      {
        title: "Installable web app instead of separate native apps",
        description:
          "A single application can work across desktop and mobile while still supporting offline features and notifications.",
      },
    ],
    stack: [
      "React",
      "TypeScript",
      "Anthropic SDK",
      "Google Gemini",
      "Supabase",
      "Gmail API",
      "PWA",
    ],
    results: [
      "Replaces 4+ separate tools in the daily workflow",
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
    impact:
      "A consumer app that brings deals, nearby restaurant discovery, and recipe ideas into one place for people looking for gluten-free options.",
    problem:
      "People looking for gluten-free products often have to search many retailer websites, restaurant listings, and recipe sources separately. Existing solutions usually focus on only one of these needs.",
    solution:
      "The app collects product deals from multiple retailers, helps users discover nearby restaurants, and generates personalized recipe ideas. AI helps create targeted searches so the system can discover relevant information across many sources.",
    architecture: [
      "LLM Query Generator (200+ targeted queries)",
      "Concurrent Scraping (SerpAPI + Tavily)",
      "Deduplication & Relevance Scoring",
      "GPS Restaurant Finder (Google Maps)",
      "AI Recipe Generator",
      "Cross-platform UI (React Native + Next.js)",
    ],
    features: [
      "Searches deals across 40+ retailers and 30+ brands",
      "Combines information from multiple sources and removes duplicates",
      "Finds nearby restaurants using location-based search",
      "Generates recipe ideas with nutrition information and substitutions",
      "One experience across Web, iOS, and Android",
    ],
    techDecisions: [
      {
        title: "AI-generated search coverage",
        description:
          "AI creates targeted search queries dynamically, allowing the system to cover new brands and retailers without manually adding every search query.",
      },
      {
        title: "Shared application logic across platforms",
        description:
          "React Native and Next.js share TypeScript business logic so the product can serve web and mobile users from a common foundation.",
      },
    ],
    stack: [
      "React Native",
      "Next.js",
      "Python",
      "OpenAI",
      "Firebase",
      "Google Maps",
      "SerpAPI",
    ],
    results: [
      "Deals aggregated from 40+ retailers",
      "200+ AI-generated search queries per category",
      "Web, iOS, and Android from a shared codebase",
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
    impact:
      "A ready-to-use development environment that gets a developer from setup to first commit in about 10 minutes while keeping tools and project configuration consistent.",
    problem:
      "Setting up development environments can take hours and often leads to different versions of tools across machines. AI coding tools can also consume large amounts of context before a task even begins.",
    solution:
      "A portable development environment packages the required tools into one Docker-based workspace. It also uses a context-management approach that reduces unnecessary AI context while keeping the required capabilities available.",
    architecture: [
      "Dockerfile (multi-layer, ARM/x86)",
      "Docker Compose (dev + Postgres + Redis)",
      "Volume Mounts (code, SSH, secrets)",
      "Shell Environment (zsh + oh-my-zsh)",
      "Claude Code Integration (WISC-optimized)",
    ],
    features: [
      "Works across ARM and x86 machines",
      "Complete terminal environment with productivity tools",
      "AI coding assistant integration with optimized context loading",
      "Playwright and Chromium available for automated browser testing",
      "Secrets are provided at runtime instead of being stored inside images",
    ],
    techDecisions: [
      {
        title: "Keep project code outside the container",
        description:
          "Project files remain on the host machine and are mounted into the workspace. This keeps changes immediately available and prevents deleting a container from deleting project work.",
      },
      {
        title: "Load AI context only when needed",
        description:
          "Project decisions, rules, and agent instructions are separated and loaded according to the task. This reduced context from 72KB to 11.7KB while keeping the required capabilities.",
      },
    ],
    stack: [
      "Docker",
      "Docker Compose",
      "Ubuntu",
      "Node.js",
      "Playwright",
      "PostgreSQL",
      "Redis",
    ],
    results: [
      "About 10 minutes from a fresh machine to first commit",
      "Consistent environment across Mac, Linux VPS, and phone SSH",
      "AI context reduced from 72KB to 11.7KB",
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
    impact:
      "A structured AI workflow where separate agents plan tasks, perform the work, check the result, and improve it when needed.",
    problem:
      "Many AI agent examples are either very small demonstrations or large frameworks that are difficult to understand. The goal was to create something small enough to understand while still supporting real multi-step tasks.",
    solution:
      "The system separates planning, execution, validation, and coordination into clear roles. A validator reviews the result and sends feedback back to the worker for another attempt when necessary.",
    architecture: [
      "Orchestrator (DAG-based task execution)",
      "Planner Agent (goal decomposition)",
      "Worker Agent (tool-use loop)",
      "Validator Agent (iterative critique, 3 rounds)",
      "Task State Machine (6 states)",
      "Memory Store (error pattern persistence)",
    ],
    features: [
      "AI can review its own work and improve it through multiple rounds",
      "Past error patterns can be remembered for future tasks",
      "Complex tasks can be broken into dependent steps and run efficiently",
      "Important actions can pause for human approval",
      "Works with multiple AI providers",
    ],
    techDecisions: [
      {
        title: "Multiple review rounds instead of one final check",
        description:
          "Feedback from validation is sent back to the worker so it can improve the next attempt rather than simply receiving a pass or fail result.",
      },
      {
        title: "Small architecture with clear responsibilities",
        description:
          "Each part of the system has one clear responsibility. This keeps the framework understandable without unnecessary abstraction.",
      },
    ],
    stack: [
      "TypeScript",
      "Node.js",
      "Anthropic SDK",
      "OpenAI SDK",
      "Zod",
    ],
    results: [
      "Clean 18-file architecture",
      "AI work can be reviewed and refined through multiple rounds",
      "Past error patterns can improve future tasks",
      "State management prevents invalid workflow transitions",
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
    impact:
      "Five specialized AI assistants that handle practical tasks such as job searching, research, code review, proposal writing, and freelance communication.",
    problem:
      "Different business tasks need different information, tools, and instructions. Using one general assistant for everything can make workflows slower and less focused.",
    solution:
      "The system gives each AI agent one clear purpose, the tools it needs, and instructions designed for that specific task. The agents can search information, work with GitHub, fetch web pages, and connect to other workflows.",
    architecture: [
      "FastAPI Server (5 agent endpoints)",
      "Tool-Calling Engine",
      "Shared Tools (Tavily, URL fetcher, GitHub API)",
      "Agent Definitions (system prompt + tools per use case)",
      "Portfolio Web UI",
    ],
    features: [
      "Job Search Agent: finds jobs, evaluates fit, and prepares applications",
      "Research Agent: gathers information from multiple sources",
      "Code Review Agent: reviews GitHub pull requests for bugs and security issues",
      "Proposal Agent: analyzes freelance opportunities and prepares proposals",
      "Freelance Communication Agent: receives messages and prepares replies",
    ],
    techDecisions: [
      {
        title: "AI specialized for one task at a time",
        description:
          "Each agent has a focused purpose and a smaller set of tools. This makes the workflow easier to control and reduces unnecessary instructions.",
      },
      {
        title: "Low-cost AI infrastructure",
        description:
          "The system uses an inference provider with a free tier so the agents can run without a large ongoing infrastructure cost.",
      },
    ],
    stack: [
      "Python",
      "FastAPI",
      "Groq",
      "Tavily",
      "GitHub API",
      "HuggingFace Spaces",
      "Docker",
    ],
    results: [
      "5 specialized AI agents deployed and operational",
      "1-8 automated tool calls per request",
      "$0/month hosting using free tiers",
      "Can connect to n8n, web apps, and other HTTP-based workflows",
    ],
    live: "https://shami96-deep-agent.hf.space",
  },
];

export function getProject(slug: string): ProjectData | undefined {
  return projects.find((p) => p.slug === slug);
}