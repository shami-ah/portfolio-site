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
    subtitle: "Universal AI Code Review System (v0.2.1)",
    type: "Open Source",
    impact: "242 patterns across 9 stacks, tested against real open-source repos. Reviews in under 1 second, entirely on your machine. Guardian mode prevents bugs before they're written.",
    problem:
      "Commercial code review tools are slow, cloud-dependent, expensive, and do either pattern matching or AI reasoning. Never both. Teams need fast, private, accurate reviews that also catch security vulnerabilities, missing test coverage, and risky PRs without sending code to third-party servers.",
    solution:
      "A hybrid review engine combining 242 deterministic patterns across 9 stacks with AI reasoning in a multi-pass pipeline. v0.2.1 expanded from 4 to 9 stacks (adding Next.js, FastAPI, Rails, Laravel, Spring Boot), each tested against real open-source repos (vercel/next.js, discourse/discourse, monicahq/monica, spring-petclinic). Guardian mode prevents bugs at generation time by loading critical patterns into AI agent context. Security taint tracking, PR risk scoring, self-learning FP suppression, and zero runtime dependencies.",
    architecture: [
      "Git Diff",
      "AST-aware File Parser",
      "Persistent Index (call graph + schema graph + type graph + column registry)",
      "Incremental Update (60ms)",
      "Pass 0-2: Pre-flight, Layer Analysis, Cross-file Tracing",
      "Pass 3: Pattern Scan (242 patterns, 9 stacks)",
      "Pass 3.5: Taint Tracking + Test Coverage + Dep Vulns",
      "Pass 4: Self-Validation + PR Risk Score",
      "AI Reasoning Layer (Claude / Codex / Gemini)",
      "Self-Learning Feedback Loop",
    ],
    features: [
      "242 patterns across 9 stacks (TS, Python, Go, Java, Ruby, PHP, Next.js, FastAPI, Spring Boot) with OWASP/CWE mapping",
      "Security taint tracking: traces user input through API to DB to output, flags unsanitized paths",
      "PR Risk Score: weighted 1-10 rating across 8 factors (auth changes, schema mods, missing tests, etc.)",
      "Code explanation: codelens explain <file> shows callers, callees, data flow, and risk analysis using the index",
      "Test coverage gap detection: flags code changes with no corresponding test updates",
      "Dependency vulnerability scanning against 42+ known CVEs",
      "Persistent codebase index with 62K+ edges in the call graph",
      "Self-learning noise filter using TF-IDF similarity, zero external dependencies",
      "Guardian mode: shift-left prevention — loads patterns into AI agent context to prevent bugs during code generation",
      "Guard command: fast incremental check for editor hooks and CI/CD pre-commit gates",
      "Dual mode: Terminal for instant checks, AI Agent mode for deep reasoning",
      "Adapters for Claude Code, Codex CLI, Gemini, and Cursor",
      "All new modules tested against real repos: vercel/next.js, discourse/discourse, monicahq/monica, spring-petclinic, tiangolo/fastapi-template",
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
    ],
    stack: ["TypeScript", "Regex Parsers", "Persistent JSON Index", "GitHub Actions", "Claude Code Adapter", "npm"],
    results: [
      "242 patterns across 9 stacks, tested against 5 real open-source repos",
      "First index: 4.0s on a 1,622-file production codebase",
      "Incremental update: 60ms",
      "7-file review: 780ms",
      "Full PR (456 files): 12s",
      "Multi-repo benchmarks: TypeScript, Next.js, Django",
      "MIT licensed, 100% local, zero cloud dependencies",
    ],
    github: "https://github.com/shami-ah/codelens",
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
    impact: "A single interface to manage email, calendar, tasks, and AI workflows from one place.",
    problem:
      "Developers and freelancers juggle too many tools: Gmail for email, Google Calendar for scheduling, Notion for notes, separate dashboards for each client. Context switching kills productivity.",
    solution:
      "A progressive web app that unifies email, calendar, and task management with AI-powered triage. Built as a personal command center with the Anthropic SDK, Google AI, Supabase backend, and Gmail/Calendar API integration.",
    architecture: [
      "PWA Shell (React + TypeScript)",
      "Anthropic SDK + Google AI",
      "Gmail API Integration",
      "Google Calendar API",
      "Supabase Backend",
      "AI Triage & Classification",
      "Unified Dashboard",
    ],
    features: [
      "Unified inbox pulling from Gmail with AI-powered classification",
      "Calendar integration showing availability and scheduling",
      "AI triage using Anthropic Claude for email prioritization",
      "Supabase backend for persistent storage and real-time sync",
      "Progressive Web App: installable, works offline, push notifications",
    ],
    stack: ["React", "TypeScript", "Anthropic SDK", "Google AI", "Supabase", "Gmail API", "Calendar API"],
    results: [
      "Single interface replacing 4+ separate tools",
      "AI-powered email triage reduces inbox processing time",
      "PWA installable on desktop and mobile",
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
      "Gluten-free consumers waste hours searching for deals across scattered retailer sites, have no easy way to find nearby safe restaurants, and lack reliable recipe sources.",
    solution:
      "A cross-platform app that uses LLMs to auto-generate 200+ search queries, aggregates deals via concurrent scraping, finds nearby GF restaurants using GPS, and generates recipes on demand.",
    architecture: [
      "LLM Query Generator (200+ targeted queries)",
      "Concurrent Scraping (SerpAPI + Tavily)",
      "Deduplication & Scoring Engine",
      "Firebase Firestore Persistence",
      "GPS Restaurant Finder (Google Maps)",
      "AI Recipe Generator (OpenAI)",
      "Cross-platform UI (React Native + Next.js)",
    ],
    features: [
      "LLM-generated 200+ search queries covering 40+ retailers and 30+ brands",
      "Concurrent scraping via SerpAPI + Tavily with deduplication and scoring",
      "GPS-based restaurant finder with Google Maps integration and ratings",
      "AI recipe generation with ingredients, nutrition, and substitution tips",
      "Unified experience across Web, iOS, and Android via React Native + Next.js",
    ],
    stack: ["React Native", "Next.js", "Python", "OpenAI", "Firebase", "Google Maps", "SerpAPI"],
    results: [
      "Aggregates deals from 40+ retailers in real time",
      "Cross-platform: Web, iOS, and Android from shared codebase",
      "Modular microservices enabling weekly feature rollouts",
    ],
  },
  {
    slug: "rag-pipeline",
    title: "RAG Pipeline",
    subtitle: "Domain-Specific Question Answering",
    type: "AI Infrastructure",
    impact: "Scalable knowledge retrieval from unstructured documents with context-aware LLM responses.",
    problem:
      "Organizations have critical knowledge locked in PDFs, docs, and internal wikis. Keyword search fails on natural language questions. Staff waste time searching instead of getting answers.",
    solution:
      "A Retrieval-Augmented Generation pipeline that chunks documents, generates embeddings, stores them in Pinecone, and retrieves the most relevant context before passing it to GPT-4 for answer generation.",
    architecture: [
      "Document Ingestion (PDF, docs, wiki)",
      "Chunking & Preprocessing",
      "Embedding Generation (Hugging Face)",
      "Pinecone Vector Storage",
      "Semantic Similarity Search",
      "Context Assembly",
      "GPT-4 Answer Generation",
      "Streamlit UI",
    ],
    features: [
      "Chunking pipeline with FAISS-compatible transformers and context preservation",
      "Pinecone for real-time vector similarity search at scale",
      "OpenAI GPT-4 for context-aware answer generation",
      "Handles long-form queries by assembling multiple relevant chunks",
      "Streamlit interface for live testing and demos",
    ],
    stack: ["Python", "Pinecone", "OpenAI GPT-4", "LangChain", "Hugging Face", "Streamlit"],
    results: [
      "Sub-second retrieval from thousands of document chunks",
      "Accurate context-aware answers vs raw LLM hallucination",
      "Deployed for customer support and internal knowledge base use cases",
    ],
    github: "https://github.com/shami-ah/rag-gpt-pinecone",
  },
  {
    slug: "vqa-agent",
    title: "Multimodal VQA Agent",
    subtitle: "Visual Question Answering",
    type: "AI Research",
    impact: "GenAI agent that answers natural language questions about images using multimodal architecture.",
    problem:
      "Users need to ask questions about images (accessibility, education, customer service) but most AI systems only handle text. Bridging vision and language requires specialized architectures.",
    solution:
      "A multimodal agent combining BLIP-2 for image understanding with LLMs for language reasoning. Includes RAG components for contextual enrichment and prompt chains for multi-step reasoning.",
    architecture: [
      "Image Input",
      "BLIP-2 Vision Encoder",
      "Feature Extraction",
      "LLM Reasoning (OpenAI)",
      "RAG Context Enrichment",
      "Prompt Chain Assembly",
      "Answer Generation",
      "Streamlit Interface",
    ],
    features: [
      "BLIP-2 + LLM multimodal architecture for image understanding",
      "RAG components and prompt chains for contextual reasoning",
      "Real-time Streamlit interface for live testing and demos",
      "Evaluated on general and domain-specific image-question datasets",
    ],
    stack: ["Python", "BLIP-2", "OpenAI", "Hugging Face", "Streamlit"],
    results: [
      "Handles natural language questions about arbitrary images",
      "Applicable to accessibility, education, and image-based customer service",
    ],
    github: "https://github.com/shami-ah/VQA_Dataset",
  },
];

export function getProject(slug: string): ProjectData | undefined {
  return projects.find((p) => p.slug === slug);
}
