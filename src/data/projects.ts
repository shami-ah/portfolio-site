export interface ProjectData {
  slug: string;
  title: string;
  subtitle: string;
  type: string;
  impact: string;
  problem: string;
  solution: string;
  architecture: string[];
  features: string[];
  techDecisions?: { title: string; description: string }[];
  stack: string[];
  results: string[];
  github?: string;
  live?: string;
  featured?: boolean;
}

export const projects: ProjectData[] = [
  {
    slug: "codelens",
    title: "CodeLens",
    subtitle: "Universal AI Code Review System (v0.3.2)",
    type: "AI Dev Tool",
    impact: "275 patterns across 9 stacks, tested against real open-source repos. Reviews in under 1 second, entirely on your machine. Guardian mode prevents bugs before they're written.",
    problem:
      "Commercial code review tools are slow, cloud-dependent, expensive, and do either pattern matching or AI reasoning. Never both. Teams need fast, private, accurate reviews that also catch security vulnerabilities, missing test coverage, and risky PRs without sending code to third-party servers.",
    solution:
      "A hybrid review engine combining 275 deterministic patterns across 9 stacks with AI reasoning in a multi-pass pipeline. v0.3.0 auto-detects AI agents (Claude Code, Cursor, Windsurf, Copilot, Codex) and injects guardian rules automatically — zero manual config. Tested against real open-source repos (vercel/next.js, discourse/discourse, monicahq/monica, spring-petclinic). Security taint tracking, PR risk scoring, self-learning FP suppression, and zero runtime dependencies. v0.3.2 adds 3 new react-supabase-ts patterns from production gap analysis: hardcoded .limit(N) without paginated drain, mock-data-in-production hooks, missing Sentry in edge function catch blocks.",
    architecture: [
      "Git Diff",
      "AST-aware File Parser",
      "Persistent Index (call graph + schema graph + type graph + column registry)",
      "Incremental Update (60ms)",
      "Pass 0-2: Pre-flight, Layer Analysis, Cross-file Tracing",
      "Pass 3: Pattern Scan (272 patterns, 9 stacks) + AI Agent Auto-Detection",
      "Pass 3.5: Taint Tracking + Test Coverage + Dep Vulns",
      "Pass 4: Self-Validation + PR Risk Score",
      "AI Reasoning Layer (Claude / Codex / Gemini)",
      "Self-Learning Feedback Loop",
    ],
    features: [
      "275 patterns across 9 stacks (TS, Python, Go, Java, Ruby, PHP, Next.js, FastAPI, Spring Boot) with OWASP/CWE mapping",
      "Security taint tracking: traces user input through API to DB to output, flags unsanitized paths",
      "PR Risk Score: weighted 1-10 rating across 8 factors (auth changes, schema mods, missing tests, etc.)",
      "Code explanation: codelens explain <file> shows callers, callees, data flow, and risk analysis using the index",
      "Test coverage gap detection: flags code changes with no corresponding test updates",
      "Dependency vulnerability scanning against 42+ known CVEs",
      "Persistent codebase index with 62K+ edges in the call graph",
      "Self-learning noise filter using TF-IDF similarity, zero external dependencies",
      "Guardian mode: shift-left prevention — loads patterns into AI agent context to prevent bugs during code generation. Patterns updated from real PR gap analysis (Greptile vs CodeLens) to close blind spots.",
      "Guard command: fast incremental check for editor hooks and CI/CD pre-commit gates",
      "Dual mode: Terminal for instant checks, AI Agent mode for deep reasoning",
      "Auto AI agent integration: codelens setup detects Claude Code, Cursor, Windsurf, Copilot, and Codex — injects guardian/review rules automatically",
      "All new modules tested against real repos: vercel/next.js, discourse/discourse, monicahq/monica, spring-petclinic, tiangolo/fastapi-template",
      "Docker distribution: docker run --rm -v $(pwd):/project ghcr.io/shami-ah/codelens review — zero setup, source obfuscated",
      "Auto-publish pipeline: push to main triggers GitHub Actions → builds multi-arch image → publishes to GHCR",
    ],
    techDecisions: [
      {
        title: "Zero runtime dependencies",
        description: "Regex-only parsers instead of heavy AST frameworks. No Java or Python runtime needed unlike SonarQube. Runs anywhere Node runs.",
      },
      {
        title: "Persistent codebase index",
        description: "Call graph, schema graph, and column registry stored in .code-review/ for instant incremental reviews instead of re-parsing the entire repo.",
      },
      {
        title: "Source-to-sink taint tracking",
        description: "v0.2 added a 222-line taint tracker that traces data from user input sources through the codebase to dangerous sinks (SQL, exec, innerHTML). Detects sanitizer functions and maps findings to CWE/OWASP.",
      },
      {
        title: "Weighted PR risk scoring",
        description: "8-factor scoring: auth logic changes, DB schema mods, missing tests, dependency changes, config file edits, error handling removal, API surface changes, and file count. Gives teams a 1-10 risk score per PR.",
      },
      {
        title: "Self-learning noise filter",
        description: "Tracks which findings developers fix vs ignore. Uses TF-IDF similarity to auto-suppress false positives. No cloud ML, fully local.",
      },
      {
        title: "Docker distribution with source obfuscation",
        description: "Multi-stage Docker build: TypeScript compiles, esbuild bundles + minifies into a single 351KB file. Final image contains only the opaque bundle — no source code, no node_modules. Auto-published to GHCR on every push.",
      },
    ],
    stack: ["TypeScript", "Docker", "esbuild", "Regex Parsers", "Persistent JSON Index", "GitHub Actions", "Claude Code Adapter", "GHCR"],
    results: [
      "275 patterns across 9 stacks, tested against 5 real open-source repos",
      "First index: 4.0s on a 1,622-file production codebase",
      "Incremental update: 60ms",
      "7-file review: 780ms",
      "Full PR (456 files): 12s",
      "Docker distribution: one-command usage via GHCR, source code obfuscated via esbuild bundling",
      "Zero runtime dependencies — entire tool compiles to a single 351KB minified file",
      "Multi-repo benchmarks: TypeScript, Next.js, Django",
    ],
    // github: "https://github.com/shami-ah/codelens", // Private — evaluating commercial release
    featured: true,
  },
  {
    slug: "openevent",
    title: "OpenEvent",
    subtitle: "AI-Powered Event Management Platform",
    type: "Production SaaS",
    impact: "Automated 80% of manual event coordination, cutting team response time from hours to minutes.",
    problem:
      "Event management companies drown in emails, manual booking, and scattered spreadsheets. Staff spend hours triaging requests, copying data between systems, and chasing approvals. The work is repetitive but requires judgment that simple automation can't handle.",
    solution:
      "An AI-powered platform where emails are ingested, classified by intent, turned into tasks, and routed through human-in-the-loop approval workflows. The AI proposes actions; humans review and approve with one click. Approved actions trigger real integrations: calendar bookings, Stripe invoices, CRM updates.",
    architecture: [
      "Client Email (Gmail / Outlook / IMAP)",
      "Thread Deduplication & Ingestion",
      "AI Intent Classification (GPT)",
      "Entity Extraction + pgvector Enrichment",
      "Prioritized Task Inbox",
      "Human Review (approve / edit / reject)",
      "Declarative Workflow Engine (JSON/YAML)",
      "Execution (Calendar, Stripe, CRM, Email)",
      "Audit Log + Telemetry",
    ],
    features: [
      "Email-to-task pipeline: ingests, deduplicates threads, extracts intent and entities automatically",
      "Human-in-the-loop workflows: AI drafts actions, humans approve or edit before execution",
      "Declarative workflow engine: JSON/YAML definitions with conditionals, parallel nodes, and LLM steps",
      "Semantic search via pgvector for template matching and historical context lookup",
      "Full integrations: Google/Outlook Calendar, Stripe invoicing, CRM sync, webhooks",
    ],
    techDecisions: [
      {
        title: "Supabase Edge Functions for AI",
        description: "LLM calls, entity extraction, and workflow triggers run on Deno-based edge functions. Fast cold starts, built-in auth, and direct database access.",
      },
      {
        title: "pgvector over external vector DB",
        description: "Kept vector search inside Postgres to avoid another service dependency. Simpler ops, single source of truth, good enough performance for our scale.",
      },
      {
        title: "Declarative workflows over code",
        description: "JSON/YAML workflow definitions instead of hardcoded logic. Non-engineers can modify workflows. Supports conditionals, parallel execution, and human review gates.",
      },
    ],
    stack: ["React", "TypeScript", "Supabase", "OpenAI", "pgvector", "Stripe", "Docker", "GitHub Actions"],
    results: [
      "80% reduction in manual event coordination tasks",
      "Response time dropped from hours to minutes",
      "Serving active clients in production",
      "Full CI/CD pipeline with staging and production environments",
    ],
    featured: true,
  },
  {
    slug: "command-center",
    title: "Command Center",
    subtitle: "Personal AI Operations PWA",
    type: "Developer Tool",
    impact: "A single interface to manage email, calendar, tasks, and AI workflows from one place. Used daily as a personal productivity system.",
    problem:
      "Developers and freelancers juggle too many tools: Gmail for email, Google Calendar for scheduling, Notion for notes, separate dashboards for each client. Context switching kills productivity. No single tool combines AI-powered triage with real integrations.",
    solution:
      "A progressive web app that unifies email, calendar, and task management with AI-powered triage. Built as a personal command center with dual AI backends (Anthropic Claude + Google Gemini), Supabase real-time backend, and native Gmail/Calendar API integration. PWA architecture enables installable mobile and desktop experience with push notifications.",
    architecture: [
      "PWA Shell (React + TypeScript)",
      "Dual AI: Anthropic Claude + Google Gemini",
      "Gmail API (inbox sync, thread management)",
      "Google Calendar API (events, availability)",
      "Supabase (Postgres, Auth, Realtime, Edge Functions)",
      "AI Triage & Priority Classification",
      "Task Board (projects, assignments, deadlines)",
      "Push Notification Service Worker",
      "Unified Dashboard",
    ],
    features: [
      "Unified inbox pulling from Gmail with AI-powered intent classification and priority scoring",
      "Calendar integration showing availability, scheduling, and conflict detection",
      "Dual AI triage: Anthropic Claude for complex reasoning, Gemini for fast classification",
      "Task board with project grouping, deadlines, and status tracking",
      "Supabase Realtime for live sync across devices — changes appear instantly",
      "AI-generated email responses with one-click send or edit",
      "Progressive Web App: installable on desktop and mobile, works offline, push notifications",
      "Slack and Telegram integration for notification routing",
    ],
    techDecisions: [
      {
        title: "Dual AI backends over single provider",
        description: "Claude handles complex email reasoning and response drafting. Gemini handles fast classification and triage. Using both avoids vendor lock-in and plays to each model's strengths.",
      },
      {
        title: "PWA over native mobile app",
        description: "Single codebase serves web, iOS, and Android. Service workers enable offline support and push notifications. No App Store approval needed for rapid iteration.",
      },
      {
        title: "Supabase Realtime over polling",
        description: "WebSocket-based sync means changes appear instantly across devices. No polling interval, no stale data. Built-in auth handles session management.",
      },
    ],
    stack: ["React", "TypeScript", "Anthropic SDK", "Google Gemini", "Supabase", "Gmail API", "Calendar API", "PWA"],
    results: [
      "Single interface replacing 4+ separate tools (Gmail, Calendar, Notion, Slack)",
      "AI-powered email triage reduces inbox processing by 60%",
      "PWA installable on desktop and mobile with offline support",
      "Used daily as the primary personal productivity system",
    ],
    github: "https://github.com/shami-ah/shami-command-center",
  },
  {
    slug: "gluten-free",
    title: "Gluten-Free Deals & Dining",
    subtitle: "Cross-Platform Consumer App",
    type: "Web + iOS + Android",
    impact: "Unified experience for gluten-free shoppers with deals from 40+ retailers, restaurant finder, and AI recipe generation.",
    problem:
      "Gluten-free consumers waste hours searching for deals across scattered retailer sites, have no easy way to find nearby safe restaurants, and lack reliable recipe sources. Existing apps cover one aspect (deals OR restaurants) but never all three in one place.",
    solution:
      "A cross-platform app that uses LLMs to auto-generate 200+ search queries, aggregates deals via concurrent scraping with deduplication, finds nearby GF restaurants using GPS, and generates personalized recipes on demand. The LLM query generator is the key innovation — it turns 'gluten-free deals' into 200+ targeted queries covering specific brands, retailers, and product categories.",
    architecture: [
      "LLM Query Generator (200+ targeted queries)",
      "Concurrent Scraping (SerpAPI + Tavily)",
      "Deduplication & Relevance Scoring Engine",
      "Firebase Firestore Persistence",
      "GPS Restaurant Finder (Google Maps)",
      "AI Recipe Generator (OpenAI)",
      "Cross-platform UI (React Native + Next.js)",
    ],
    features: [
      "LLM-generated 200+ search queries covering 40+ retailers and 30+ brands — not hardcoded, generated fresh per category",
      "Concurrent scraping via SerpAPI + Tavily with deduplication, relevance scoring, and freshness filtering",
      "GPS-based restaurant finder with Google Maps integration, ratings, and allergy-safe filtering",
      "AI recipe generation with ingredients, nutrition facts, substitution tips, and dietary compliance",
      "Unified experience across Web, iOS, and Android via React Native + Next.js shared codebase",
      "Real-time deal updates via Firebase Firestore listeners — no manual refresh needed",
    ],
    techDecisions: [
      {
        title: "LLM query generation over hardcoded searches",
        description: "Instead of maintaining a static list of search queries, the LLM generates 200+ targeted queries dynamically. Covers new brands and retailers without code changes. One prompt generates queries for an entire product category.",
      },
      {
        title: "Dual search API strategy",
        description: "SerpAPI handles Google/Bing results for broad coverage. Tavily handles AI-optimized search for specific deal extraction. Running both concurrently maximizes deal discovery.",
      },
      {
        title: "React Native + Next.js shared codebase",
        description: "React Native for iOS/Android with Expo. Next.js for web. Shared TypeScript business logic and API clients across platforms. One team ships to three platforms.",
      },
    ],
    stack: ["React Native", "Next.js", "Python", "OpenAI", "Firebase", "Google Maps", "SerpAPI", "Tavily"],
    results: [
      "Aggregates deals from 40+ retailers in real time",
      "200+ AI-generated search queries per category — covers brands no hardcoded system would catch",
      "Cross-platform: Web, iOS, and Android from shared codebase",
      "Modular microservices enabling weekly feature rollouts",
    ],
  },
  {
    slug: "rag-pipeline",
    title: "RAG Pipeline",
    subtitle: "Domain-Specific Question Answering",
    type: "AI Infrastructure",
    impact: "Scalable knowledge retrieval from unstructured documents with context-aware LLM responses. Sub-second retrieval from thousands of document chunks.",
    problem:
      "Organizations have critical knowledge locked in PDFs, docs, and internal wikis. Keyword search fails on natural language questions — employees search for 'how do I process a refund?' and get nothing because the doc title is 'Payment Operations SOP'. Staff waste hours searching instead of getting answers.",
    solution:
      "A Retrieval-Augmented Generation pipeline that chunks documents with context-preserving overlap, generates embeddings via Hugging Face transformers, stores them in Pinecone for vector similarity search, and retrieves the most relevant context before passing it to GPT-4 for answer generation. The pipeline handles document updates incrementally — no full re-indexing needed.",
    architecture: [
      "Document Ingestion (PDF, docs, wiki)",
      "Chunking & Preprocessing (overlap-aware)",
      "Embedding Generation (Hugging Face)",
      "Pinecone Vector Storage",
      "Semantic Similarity Search (top-k retrieval)",
      "Context Assembly (multi-chunk fusion)",
      "GPT-4 Answer Generation (with source citations)",
      "Streamlit UI",
    ],
    features: [
      "Overlap-aware chunking pipeline that preserves context across chunk boundaries",
      "Pinecone for real-time vector similarity search at scale with metadata filtering",
      "OpenAI GPT-4 for context-aware answer generation with source citations",
      "Multi-chunk fusion: assembles multiple relevant chunks into coherent context windows",
      "Incremental updates: add new documents without re-indexing the entire corpus",
      "Streamlit interface for live testing, document upload, and answer quality evaluation",
    ],
    techDecisions: [
      {
        title: "Pinecone over self-hosted FAISS",
        description: "Pinecone handles scaling, replication, and metadata filtering out of the box. For production workloads, managed infrastructure beats self-hosted FAISS that needs custom scaling logic.",
      },
      {
        title: "Overlap-aware chunking over naive splitting",
        description: "Chunks overlap by 20% to preserve context at boundaries. A sentence split across two chunks is still searchable. This significantly improves retrieval accuracy for natural language queries.",
      },
      {
        title: "Source citations in answers",
        description: "Every generated answer includes references to the source chunks. Users can verify answers against the original document — builds trust and catches hallucinations.",
      },
    ],
    stack: ["Python", "Pinecone", "OpenAI GPT-4", "LangChain", "Hugging Face", "Streamlit"],
    results: [
      "Sub-second retrieval from thousands of document chunks",
      "Context-aware answers with source citations vs raw LLM hallucination",
      "Deployed for customer support and internal knowledge base use cases",
      "Incremental indexing: new documents available for search in seconds",
    ],
    github: "https://github.com/shami-ah/rag-gpt-pinecone",
  },
  {
    slug: "vqa-agent",
    title: "Multimodal VQA Agent",
    subtitle: "Visual Question Answering",
    type: "AI Research",
    impact: "GenAI agent that answers natural language questions about images using multimodal architecture. Combines vision encoders with LLM reasoning for context-aware answers.",
    problem:
      "Users need to ask questions about images (accessibility, education, customer service) but most AI systems only handle text. Bridging vision and language requires specialized architectures that extract visual features and map them to natural language understanding. Off-the-shelf models lack domain-specific reasoning.",
    solution:
      "A multimodal agent combining BLIP-2 for image understanding with LLMs for language reasoning. The vision encoder extracts image features, RAG components enrich context with domain knowledge, and prompt chains enable multi-step reasoning. The system handles follow-up questions by maintaining conversation context across image features.",
    architecture: [
      "Image Input (upload or URL)",
      "BLIP-2 Vision Encoder (feature extraction)",
      "Visual Feature Embedding",
      "LLM Reasoning (OpenAI GPT-4)",
      "RAG Context Enrichment (domain knowledge)",
      "Prompt Chain Assembly (multi-step reasoning)",
      "Answer Generation (with confidence scoring)",
      "Streamlit Interface (upload, ask, iterate)",
    ],
    features: [
      "BLIP-2 vision encoder extracts rich image features for LLM consumption",
      "Multi-step prompt chains: decompose complex questions into sub-queries for accurate answers",
      "RAG-enriched context: augments visual understanding with domain-specific knowledge bases",
      "Conversation memory: follow-up questions maintain context from previous image analysis",
      "Confidence scoring: flags low-confidence answers for human review",
      "Real-time Streamlit interface for image upload, questioning, and answer evaluation",
    ],
    techDecisions: [
      {
        title: "BLIP-2 over CLIP for vision encoding",
        description: "BLIP-2's Q-Former bridges the modality gap more effectively than CLIP's contrastive approach. Better at extracting features that map to natural language questions rather than just image-text similarity.",
      },
      {
        title: "Prompt chains over single-shot queries",
        description: "Complex questions like 'What safety hazards are in this image?' are decomposed into sub-queries: identify objects, assess positions, evaluate risks. Multi-step reasoning produces more accurate and detailed answers.",
      },
      {
        title: "RAG enrichment for domain-specific accuracy",
        description: "Visual features alone miss domain context. RAG retrieves relevant documentation (safety guidelines, product specs, medical references) to ground the LLM's reasoning in verified knowledge.",
      },
    ],
    stack: ["Python", "BLIP-2", "OpenAI GPT-4", "Hugging Face", "LangChain", "Streamlit"],
    results: [
      "Handles natural language questions about arbitrary images with multi-step reasoning",
      "Domain-specific accuracy via RAG enrichment — not just generic image captioning",
      "Applicable to accessibility, education, quality inspection, and image-based customer service",
      "Evaluated on general and domain-specific image-question datasets",
    ],
    github: "https://github.com/shami-ah/VQA_Dataset",
  },
  {
    slug: "dev-env",
    title: "Portable Dev Environment",
    subtitle: "Containerized Full-Stack Developer Workspace",
    type: "Developer Infrastructure",
    impact: "One-command developer onboarding. New team members go from zero to productive in 10 minutes instead of hours of manual setup.",
    problem:
      "Developer environments are fragile. Different Node versions, missing CLIs, OS-specific quirks, and hours of setup when onboarding new team members or restoring a machine. The 'works on my machine' problem persists even in 2026.",
    solution:
      "A Docker-based portable development environment that packages the entire toolchain — Node.js, Python, Deno, 10+ developer CLIs, shell configuration, Playwright for E2E testing, and database services — into a reproducible container. Volume mounts keep code and configuration on the host while the container provides identical tooling across Mac, Linux, and VPS environments.",
    architecture: [
      "Dockerfile (multi-layer, architecture-aware ARM/x86)",
      "Docker Compose (dev + Postgres + Redis)",
      "Volume Mounts (code, SSH, Claude Code config, secrets)",
      "Shell Environment (zsh + oh-my-zsh + Powerlevel10k)",
      "Node 24 + pnpm + TypeScript + Deno",
      "Playwright + Chromium (headless E2E + mockups)",
      "CLI Suite (claude, gh, supabase, vercel)",
      "Secrets Management (mounted at runtime, never in image)",
    ],
    features: [
      "Architecture-aware builds: runs natively on Apple Silicon (ARM) and x86 Linux without modification",
      "Full shell environment: zsh, oh-my-zsh, Powerlevel10k, autosuggestions, syntax highlighting — identical feel to native terminal",
      "Claude Code integration: skills, rules, memory, and project-level config all work inside the container",
      "Multi-account GitHub: switch between personal and client identities with one command",
      "Playwright with Chromium: headless browser for mockup generation and E2E testing inside the container",
      "Database services: Postgres 15 and Redis 7 as companion containers on a shared network",
      "Secrets never baked into images: API keys mounted read-only at runtime from host",
      "One-command onboarding: clone, setup.sh, start.sh — new developer productive in 10 minutes",
    ],
    techDecisions: [
      {
        title: "Volume mounts over baked-in code",
        description: "Code lives on the host filesystem, not inside the container. Changes sync instantly both ways. Deleting a container never loses work.",
      },
      {
        title: "NVM symlinks for non-interactive compatibility",
        description: "NVM only loads in interactive shells. All node binaries are symlinked to /usr/local/bin so tools like Claude Code, pnpm, and Playwright work in any context.",
      },
      {
        title: "Copy auth files instead of mounting",
        description: "Claude Code's .claude.json is copied at container entry rather than live-mounted. Prevents file corruption when the host process writes simultaneously.",
      },
    ],
    stack: ["Docker", "Docker Compose", "Ubuntu", "Node.js", "Playwright", "PostgreSQL", "Redis", "zsh"],
    results: [
      "Developer onboarding: 10 minutes from zero to first commit",
      "15+ CLI tools, 3 languages, 2 database services in one docker compose up",
      "Identical environment across Mac, Linux VPS, and phone-based SSH development",
      "Mac restore recovery: Docker Desktop install + clone + setup.sh = fully operational",
    ],
    github: "https://github.com/shami-ah/dev-env",
  },
  {
    slug: "gogaa-cli",
    title: "Gogaa CLI",
    subtitle: "AI Coding Agent — Any Model, Any Provider",
    type: "Developer Tool / CLI",
    featured: true,
    impact: "Production-grade AI coding agent built from scratch in TypeScript. 17 tools, 11 providers, full agentic loop with streaming — Claude Code parity at a fraction of the cost via MiniMax M2.7 (~90% cheaper than Sonnet).",
    problem:
      "Claude Code locks you into Anthropic. Cursor locks you into a GUI. When a model is down, rate-limited, or too expensive for a task, there's no fallback — you're stuck. Teams running intensive agentic sessions hit $100+/month per developer with no way to route cheaper models for simpler tasks.",
    solution:
      "A TypeScript CLI agent that works with any LLM provider through a unified streaming interface. One tool, 11 providers — Anthropic, OpenAI, MiniMax, Groq, Google, DeepSeek, Mistral, xAI, OpenRouter, Together, Ollama. Auto-discovers the best available model. MiniMax M2.7 delivers near-Sonnet coding quality at ~90% lower cost. Anthropic tool search (defer_loading) cuts context token usage by ~85% on large tool sets.",
    architecture: [
      "Provider Manager (11 providers, unified streaming interface)",
      "Tool Registry (17 tools — file, bash, grep, glob, web, memory, agent, semantic search)",
      "Agentic Loop (streaming, tool calls, stuck detection, auto-retry)",
      "Context Manager (js-tiktoken, semantic compaction at 85%)",
      "Anthropic Tool Search (BM25 deferred loading for 10+ tool sets)",
      "Session Layer (WAL persistence, save/resume)",
      "Self-Learning Engine (tool reliability, error patterns, model performance)",
      "React Ink TUI (streaming, permission prompts, status bar, markdown renderer)",
    ],
    features: [
      "11 LLM providers with unified streaming: Anthropic, OpenAI, MiniMax, Groq, Google, DeepSeek, Mistral, xAI, OpenRouter, Together, Ollama",
      "MiniMax M2.7 integration: OpenAI-compatible API, 1M context, ~90% cheaper than Claude Sonnet, beats Sonnet 4.5 on SWE-bench Multilingual",
      "Anthropic tool search: auto-injects BM25 deferred loading when tool count >10, reducing context by ~85% (45k+ tokens saved per request in a 17-tool session)",
      "17 built-in tools: file-read/write/edit, bash, grep, glob, web-search, web-fetch, image-read, PDF-read, sub-agent, memory (save/list/recall), compare, semantic search, project index",
      "React Ink TUI: streaming output, numbered permission prompts, collapsible tool summaries, running timer, cost per exchange",
      "Bash sandboxing: destructive command denylist + path allowlist + audit log to ~/.gogaa/audit/",
      "Session persistence with WAL crash recovery — resume any conversation by ID",
      "Self-learning engine: tracks tool reliability and error patterns, improves tool descriptions over time",
      "Cost budget enforcement: configurable $ cap, warns at 80%, stops at 100%",
      "Plan mode: read-only tool restriction for safe exploration before committing",
    ],
    techDecisions: [
      {
        title: "MiniMax over OpenRouter for cost optimization",
        description: "MiniMax M2.7 has a direct API (not aggregated), 1M context window, OpenAI-compatible endpoint, and consistently outperforms Claude Sonnet 4.5 on SWE-bench Multilingual. At ~$0.30/$1.20 per 1M tokens vs Sonnet's $3/$15, it's the best cost-quality tradeoff for agentic coding sessions.",
      },
      {
        title: "Anthropic tool search (defer_loading) for context efficiency",
        description: "Loading all 17 tool definitions upfront consumes ~10-15k context tokens before any work starts. The Anthropic BM25 tool search tool defers non-core tools (web, memory, agent, compare) and loads only the 3-5 relevant ones per request. At 17 tools, this saves ~45k tokens per session over a typical agentic run.",
      },
      {
        title: "React Ink over raw ANSI for TUI",
        description: "React Ink provides a component model for terminal UI — the same mental model as web React, but rendering to stdout. State updates re-render only the changed components. Streaming output, permission prompts, and background job status all work as independent stateful components without manual cursor management.",
      },
    ],
    stack: ["TypeScript", "Node.js", "React Ink", "Anthropic SDK", "OpenAI SDK", "js-tiktoken", "MiniMax", "Groq", "Google Gemini"],
    results: [
      "17 tools, 11 providers, 28 slash commands — Claude Code feature parity in a single open-source binary",
      "MiniMax M2.7 cuts per-session cost by ~90% vs Anthropic Sonnet with no quality regression on coding tasks",
      "Anthropic tool search reduces context token usage by ~85% on large tool sets (17-tool session: ~45k tokens saved per request)",
      "All 29 tests passing, 8 security audit findings resolved, full bash sandboxing + audit log",
      "Session persistence with WAL crash recovery — zero lost work across model switches or network failures",
    ],
    github: "https://github.com/shami-ah/gogaa-ts",
  },
];

export function getProject(slug: string): ProjectData | undefined {
  return projects.find((p) => p.slug === slug);
}
