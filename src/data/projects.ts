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
  /** Split comparison: my approach vs the standard approach */
  vs?: {
    mine: { title: string; bullets: string[] };
    standard: { title: string; bullets: string[] };
  };
}

export const projects: ProjectData[] = [
  {
    slug: "codelens",
    title: "CodeLens",
    subtitle: "Universal AI Code Review System (v0.3.5, 345 patterns, multi-agent ensemble critique)",
    type: "AI Dev Tool",
    impact: "I spent months cataloguing every category of production bug I kept seeing across client projects: missing auth guards, silent N+1 queries, race conditions, taint paths that reach SQL. The result is 345 hand-crafted patterns across 9 stacks that run in under one second, entirely on your machine. No cloud. No latency. Code never leaves the repo. The pattern library grows continuously through three pipelines: a Glean pipeline that mines production PRs, an Agent Harvest system that cross-compares findings from 19 community reviewer agents, and a Greptile Parity process that benchmarks CodeLens head-to-head against commercial AI reviewers on real PRs to close detection gaps.",
    problem:
      "Every code review tool I evaluated made the same tradeoff. Fast but shallow (regex linters), or deep but slow and cloud-dependent (AI tools that send your code to a third party). Neither caught the bugs that actually ship: the ones that look fine in isolation but break when a schema changes, when user input flows through three layers unvalidated, or when a test suite silently diverges from the live code. And none of them could talk to the AI coding assistant sitting next to them and say: don't generate that pattern.",
    solution:
      "A hybrid review engine that runs 345 deterministic patterns first, builds a persistent codebase index (call graph, schema graph, column registry, type graph), then layers AI reasoning with focused security probes on top. The AI phase uses 6 structured probes that force per-file yes/no answers with line evidence, catching semantic bugs that no pattern can express: missing authorization guards, fallback path parity, behavior regressions, draft/live state bugs. For large PRs, parallel agents run focused rounds by layer. The pattern library grows through three pipelines: Glean (production PR mining), Agent Harvest (19 community agents), and Greptile Parity (head-to-head benchmarking against commercial AI reviewers).",
    architecture: [
      "Git Diff",
      "AST-aware File Parser",
      "Persistent Index (call graph + schema graph + type graph + column registry)",
      "Incremental Update (60ms)",
      "Pass 0-2: Pre-flight, Layer Analysis, Cross-file Tracing",
      "Pass 2: Focused Security Probes (6 per-file forced questions with line evidence)",
      "Pass 3: Pattern Scan (345 patterns, 9 stacks) + AI Agent Auto-Detection",
      "Pass 3.5: Taint Tracking + Test Coverage + Dep Vulns",
      "Pass 4: Self-Validation + PR Risk Score",
      "AI Reasoning Layer (Claude / Codex / Gemini) + Multi-Round Parallel Agents",
      "Self-Learning Feedback Loop",
      "Glean Pipeline (extracts novel patterns from production PR reviews)",
      "Agent Harvest System (cross-compares 19 community agents to find detection gaps)",
    ],
    features: [
      "345 hand-crafted patterns across 9 stacks (TypeScript, Python, Go, Java, Ruby, PHP, Next.js, FastAPI, Spring Boot). Every rule maps to a real production failure mode, tagged with OWASP/CWE",
      "Guardian mode injects pattern rules into Claude Code, Cursor, Windsurf, Copilot, and Codex at the prompt level. Bugs are prevented during generation, not just caught after",
      "Security taint tracking: a 222-line source-to-sink tracer that follows user input through API handlers, business logic, and DB calls. Flags unsanitized paths to SQL, exec, and innerHTML with CWE mapping",
      "PR Risk Score: weighted 1-10 rating across 8 factors (auth changes, schema mods, missing tests, dependency changes, error handler removal, API surface, config edits, file count)",
      "Persistent codebase index: call graph, schema graph, column registry, and type graph stored in .code-review/. 62K+ edges on a real production codebase, rebuilt incrementally in 60ms",
      "Self-learning noise filter tracks which findings developers act on vs dismiss, uses TF-IDF similarity to auto-suppress patterns that are consistently ignored in this codebase. Fully local, no cloud ML",
      "Code explanation command: codelens explain <file> uses the call graph to show callers, callees, data flow, and risk surface. Useful when onboarding to an unfamiliar codebase",
      "Glean pipeline: processes real production PR reviews, extracts generalizable bug patterns, deduplicates against the existing library, and produces import-ready pattern candidates. 600+ PRs processed to date",
      "Agent Harvest with ensemble critique: runs 19 community reviewer agents (silent-failure-hunter, type-design-analyzer, security auditor, test analyzer, etc.) alongside CodeLens with self-consistency sampling. Findings that appear across multiple independent agents are ranked higher. Converts any detection gap into a new pattern. 34 patterns harvested in the first sweep",
      "Greptile Parity: head-to-head benchmarking against commercial AI reviewers on real production PRs. Ran CodeLens against the same 54-file PR that Greptile reviewed, identified 7 detection gaps, closed 6 with new patterns (G102-G107), and enhanced the AI methodology with focused security probes for the remaining semantic gaps",
      "Focused security probes: 6 structured questions the AI must answer per-file with YES/NO + line evidence. Catches authorization ownership gaps, fallback path parity bugs, behavior regressions, and draft/live state inconsistencies that no regex pattern can express",
      "Test coverage gap detection flags code changes with no corresponding test updates in the same PR",
      "Dependency vulnerability scanning against 42+ known CVEs across npm, pip, and Maven ecosystems",
      "Docker distribution: docker run --rm -v $(pwd):/project ghcr.io/shami-ah/codelens review. Zero setup, no Node.js required, source code obfuscated in the image",
      "Auto-publish pipeline: push to main triggers GitHub Actions, builds multi-arch images (ARM + x86), and publishes to GHCR automatically",
      "Tested against real open-source repos: vercel/next.js, discourse/discourse, monicahq/monica, spring-petclinic, tiangolo/fastapi-template",
    ],
    techDecisions: [
      {
        title: "Zero runtime dependencies: the whole tool is a single 351KB file",
        description: "SonarQube requires a Java runtime, a running server, and a database. That's a 20-minute setup and a dependency you manage forever. I wanted something you could drop into any CI pipeline or editor hook in seconds. Custom regex-based parsers instead of AST frameworks, esbuild to bundle everything at release. The entire tool ships as one minified file that runs anywhere Node runs.",
      },
      {
        title: "Persistent codebase index over re-parsing on every run",
        description: "The first run on a 1,622-file codebase takes 4 seconds to build the full call graph, schema graph, and column registry. Every run after that is incremental: 60ms to update only the changed files. This made it viable as a pre-commit hook and as a live editor integration. Without the index, cross-file analysis (does this column actually exist? does this function reach a dangerous sink?) would be impossible at that speed.",
      },
      {
        title: "Hand-crafted patterns over generated or imported rule sets",
        description: "I considered using ESLint rule sets or importing from existing linters. But existing rule sets cover style and syntax. They don't model production failure modes. The patterns in CodeLens come from real bugs: missing .limit() on Supabase queries that silently cap at 1000 rows, React hooks placed after conditional returns, edge function catch blocks that swallow errors without alerting, SQL column shadowing in JOINs that silently resolves to the wrong table's value. Each one I've seen cause a real problem. That specificity is what makes the signal-to-noise ratio high enough to trust.",
      },
      {
        title: "Glean pipeline: the pattern library grows from real production code",
        description: "Static rule sets go stale. I built a pipeline called Glean that processes real PR reviews from production codebases, extracts generalizable bug patterns, and deduplicates them against the existing library. Over 500 PRs from a production SaaS with 40+ edge functions, Stripe Connect, and Supabase have been processed. The pipeline has added 90 patterns to the react-supabase-ts module alone. Each new project I review makes the tool better for every project after it.",
      },
      {
        title: "Guardian mode as a shift-left layer inside AI agents",
        description: "The insight was that the best time to catch a bug isn't after the code is written. It's before. AI coding assistants like Claude Code and Cursor accept system-level instructions. CodeLens setup detects which agent you're using and injects the full pattern library into its context. The agent now knows: don't use dangerouslySetInnerHTML without DOMPurify, always destructure { data, error } from Supabase, never put hooks after a conditional return. Bugs are prevented at the source.",
      },
      {
        title: "Source-to-sink taint tracking for real security coverage",
        description: "Pattern matching alone catches common mistakes but misses injection vulnerabilities that span multiple files. The taint tracker follows data from user-controlled sources (req.body, req.params, form inputs) through business logic to dangerous sinks (SQL queries, exec calls, innerHTML, redirects). It understands sanitizer functions and marks data as clean after validation. Every finding maps to a CWE ID so security teams have a reference, not just a warning.",
      },
      {
        title: "Agent Harvest: turning competitor agents into training data",
        description: "I run 19 open-source community reviewer agents (silent-failure-hunter, type-design-analyzer, security auditor, test coverage analyzer, etc.) alongside CodeLens on the same code. Any finding an agent catches that CodeLens misses becomes a new pattern candidate. The first sweep harvested 34 new patterns covering silent error handling, type design quality, test anti-patterns, SSRF, insecure deserialization, and code complexity. Every review session now doubles as training data for the pattern library.",
      },
      {
        title: "Greptile Parity: benchmarking against commercial AI reviewers",
        description: "After a commercial AI reviewer (Greptile) caught 12 issues on a production PR that CodeLens missed, I ran a systematic gap analysis. 1 of 12 was caught by existing patterns, 6 were fixable with new regex patterns (raw error leaks, RLS policy gaps, SECURITY DEFINER without auth guards, client-trusted payment amounts, plaintext hash columns, ownership verification), and 4 required semantic reasoning no pattern can express. For those 4, I added focused security probes: structured questions the AI must answer per-file with line evidence. Coverage went from 8% to 67% on regex alone, and 100% when the AI probes are included. This process is now a repeatable pipeline: run Greptile on a real PR, compare findings, close gaps, measure improvement.",
      },
      {
        title: "Docker distribution with source obfuscation",
        description: "The pattern library is the core IP. A multi-stage Docker build compiles TypeScript and runs esbuild to produce a single minified bundle. The final image ships only the opaque 351KB file, no source code, no node_modules. Anyone can use the tool via GHCR without access to the source. This made it possible to share with clients and beta testers while evaluating a commercial release.",
      },
    ],
    stack: ["TypeScript", "Docker", "esbuild", "Regex Parsers", "Persistent JSON Index", "GitHub Actions", "Claude Code Adapter", "GHCR"],
    results: [
      "345 patterns across 9 stacks, every rule validated against real production repos",
      "First index build: 4.0s on a 1,622-file production codebase with 62K+ call graph edges",
      "Incremental updates: 60ms, fast enough for pre-commit hooks and editor integrations",
      "7-file PR review: 780ms end-to-end",
      "Full 456-file PR: 12 seconds with cross-file taint tracing and risk score",
      "Guardian mode active in production: prevents bug categories at generation time, not just review time",
      "Zero runtime dependencies: single 351KB file, runs in any CI pipeline without setup",
      "Docker image auto-published to GHCR on every push, one-command usage, source obfuscated",
      "Glean pipeline has processed 600+ production PRs, extracting 90 novel patterns into the react-supabase-ts module. Agent Harvest added 34 patterns in its first sweep. Greptile Parity benchmarking raised coverage from 8% to 67% on a real production PR in one session",
    ],
    // github: "https://github.com/shami-ah/codelens", // Private, evaluating commercial release
    featured: true,
    decision: {
      scenario: "You've seen 3 production bugs this month that slipped past SonarQube + ESLint + Claude Code review. They involve user input reaching DB queries unvalidated across 4 files.",
      question: "What do you build?",
      options: [
        "Write more ESLint rules for the team",
        "Pay for a commercial AI review SaaS",
        "Build a custom review engine with cross-file taint tracking",
      ],
      commonChoice: 1,
      myChoice: 2,
      reasoning:
        "ESLint stays single-file. Commercial SaaS sends your code to a third party and still misses schema/cross-file bugs. I built a hybrid engine: 345 hand-crafted patterns + persistent call graph + source-to-sink taint tracer + agent harvest pipeline. Runs fully local, zero deps, <1s reviews. Now active in production.",
    },
    vs: {
      mine: {
        title: "CodeLens",
        bullets: [
          "345 hand-crafted patterns validated against real failures",
          "Persistent codebase index, 60ms incremental updates",
          "Source-to-sink taint tracking across files with CWE mapping",
          "Zero deps, runs anywhere Node runs, 351KB single file",
          "Guardian mode injects rules into Claude Code / Cursor / Copilot",
        ],
      },
      standard: {
        title: "SonarQube / commercial SaaS",
        bullets: [
          "Generic style rules not mapped to production failures",
          "Java runtime, server, database, 20-minute setup",
          "Single-file analysis, no cross-file tracing",
          "Cloud-dependent, your code leaves the repo",
          "No integration with AI coding assistants",
        ],
      },
    },
  },
  {
    slug: "openevent",
    title: "OpenEvent",
    subtitle: "AI-Powered Event Management Platform",
    type: "Production SaaS",
    impact: "Live with 100+ clients across 150+ events. Saves each team roughly 1.5 hours a day of manual email processing. AI classifies, proposes, and executes while humans stay in control.",
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
        title: "Human-in-the-loop by default, not as an afterthought",
        description: "The tempting version of this product is full automation: email arrives, AI books the calendar, sends the invoice, done. We deliberately didn't build that. Event coordination involves ambiguity. A client saying 'sometime next week' needs judgment, not a slot-filling algorithm. The right boundary is: AI handles extraction, classification, and proposal; humans approve before anything touches money or commitments. This made the system trustworthy enough for clients to actually use it in production, where fully automated alternatives had failed them before.",
      },
      {
        title: "pgvector over external vector DB",
        description: "Keeping vector search inside Postgres eliminates an entire class of operational problems: no separate service to provision, no sync lag between your relational data and your embeddings, no additional cost layer. At our scale the query performance is indistinguishable from a dedicated vector DB, and every query can join across relational and vector data in a single round trip.",
      },
      {
        title: "Declarative workflow engine over hardcoded logic",
        description: "Early versions had workflow steps written directly in TypeScript. Adding a new approval step meant a code change, a PR, a deploy. Moving to JSON/YAML definitions made workflows data, not code. A non-engineer can now add a conditional step, change the approval order, or add a new integration node without touching the codebase. The engine handles conditionals, parallel branches, and human gates. This turned out to be the feature that made the system extensible across different client types.",
      },
    ],
    stack: ["React", "TypeScript", "Supabase", "OpenAI", "pgvector", "Stripe", "Docker", "GitHub Actions"],
    results: [
      "80% reduction in manual event coordination tasks",
      "Response time dropped from hours to minutes",
      "Serving active clients in production",
      "Full CI/CD pipeline with staging and production environments",
    ],
    live: "https://openevent.io",
    featured: true,
    decision: {
      scenario: "An event company gets 100+ ambiguous client emails a day: 'book us sometime next week', 'add catering for 15 people', 'change the deposit'. They want AI to handle it.",
      question: "How do you design the system?",
      options: [
        "Full automation: AI reads, decides, executes",
        "AI drafts action, human approves before execution",
        "Classification only, humans do the rest manually",
      ],
      commonChoice: 0,
      myChoice: 1,
      reasoning:
        "Full automation fails the first time AI misreads 'sometime next week' and books the wrong slot. Event coordination involves ambiguity that needs judgment. I designed the system so AI handles extraction, classification, and proposal — but humans approve before anything touches money or commitments. That trust boundary is why clients actually use it.",
    },
    vs: {
      mine: {
        title: "OpenEvent architecture",
        bullets: [
          "AI classifies intent, extracts entities, proposes action",
          "Human approves with one click before execution fires",
          "Workflow engine is JSON/YAML (non-eng can add steps)",
          "pgvector inside Postgres — no separate vector DB",
          "Full audit log + auto-approval rule learning",
        ],
      },
      standard: {
        title: "Full-automation AI agent",
        bullets: [
          "AI reads email, decides, executes with no human gate",
          "Breaks on ambiguous input, fast trust erosion",
          "Workflow hardcoded in TS, every change = code change",
          "External vector DB, extra sync + cost layer",
          "No audit trail when AI makes wrong call",
        ],
      },
    },
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
      "Supabase Realtime for live sync across devices, with changes appearing instantly",
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
    // github link private for now
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
      "A cross-platform app that uses LLMs to auto-generate 200+ search queries, aggregates deals via concurrent scraping with deduplication, finds nearby GF restaurants using GPS, and generates personalized recipes on demand. The LLM query generator is the key innovation: it turns 'gluten-free deals' into 200+ targeted queries covering specific brands, retailers, and product categories.",
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
      "LLM-generated 200+ search queries covering 40+ retailers and 30+ brands, not hardcoded but generated fresh per category",
      "Concurrent scraping via SerpAPI + Tavily with deduplication, relevance scoring, and freshness filtering",
      "GPS-based restaurant finder with Google Maps integration, ratings, and allergy-safe filtering",
      "AI recipe generation with ingredients, nutrition facts, substitution tips, and dietary compliance",
      "Unified experience across Web, iOS, and Android via React Native + Next.js shared codebase",
      "Real-time deal updates via Firebase Firestore listeners, no manual refresh needed",
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
      "200+ AI-generated search queries per category, covering brands no hardcoded system would catch",
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
      "Organizations have critical knowledge locked in PDFs, docs, and internal wikis. Keyword search fails on natural language questions. Employees search for 'how do I process a refund?' and get nothing because the doc title is 'Payment Operations SOP'. Staff waste hours searching instead of getting answers.",
    solution:
      "A Retrieval-Augmented Generation pipeline that chunks documents with context-preserving overlap, generates embeddings via Hugging Face transformers, stores them in Pinecone for vector similarity search, and retrieves the most relevant context before passing it to GPT-4 for answer generation. The pipeline handles document updates incrementally, no full re-indexing needed.",
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
        description: "Every generated answer includes references to the source chunks. Users can verify answers against the original document, which builds trust and catches hallucinations.",
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
      "Domain-specific accuracy via RAG enrichment, not just generic image captioning",
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
    impact: "One-command developer onboarding with an optimized AI-assisted workflow. New team members go from zero to productive in 10 minutes. Claude Code context is engineered using WISC (Write, Isolate, Select, Compress) to load only what each project needs, cutting token costs by 84%.",
    problem:
      "Developer environments are fragile. Different Node versions, missing CLIs, OS-specific quirks, and hours of setup when onboarding new team members or restoring a machine. But in 2026, the environment problem has a new dimension: AI tooling. Claude Code loads every agent, rule, command, and plugin into context on every conversation, whether you need them or not. A well-configured setup with 5 agents, 10 commands, 23 plugins, and 7 rules was burning 35-40K tokens before a single prompt. That is real money on a paid tier and wasted context window for every session.",
    solution:
      "A Docker-based portable development environment that packages the entire toolchain (Node.js, Python, Deno, 10+ developer CLIs, shell configuration, Playwright for E2E testing, and database services) into a reproducible container. Volume mounts keep code and configuration on the host while the container provides identical tooling across Mac, Linux, and VPS environments. On top of that, a context-engineered Claude Code configuration: commands converted to lazy-loaded skills (body loads on invoke, not at startup), agent definitions compressed from 58KB to 5KB by removing generic advice the model already knows and keeping only stack-specific rules, path-scoped rules that only load when matching files are opened, and a project-aware session hook that injects context only when inside a known project directory. Every capability remains available, nothing was removed, but the default token footprint dropped from 72KB to 11.7KB.",
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
      "Full shell environment: zsh, oh-my-zsh, Powerlevel10k, autosuggestions, syntax highlighting. Identical feel to native terminal",
      "Claude Code integration: 44 skills, 5 agents, path-scoped rules, project-level memory, and auto-pilot intent routing all work inside the container. Context-engineered for lazy loading: skill bodies load on invoke, rules load on file match, session hook injects project context only when inside a known project directory",
      "Multi-account GitHub: switch between personal and client identities with one command",
      "Playwright with Chromium: headless browser for mockup generation and E2E testing inside the container",
      "Database services: Postgres 15 and Redis 7 as companion containers on a shared network",
      "Secrets never baked into images: API keys mounted read-only at runtime from host",
      "One-command onboarding: clone, setup.sh, start.sh. New developer productive in 10 minutes",
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
      {
        title: "WISC context engineering: Write, Isolate, Select, Compress",
        description: "I developed a four-principle framework for managing AI agent context that I call WISC. Write: persist decisions to files (CLAUDE.md, memory), not just conversation, so every session starts informed. Isolate: one task per conversation, subagents for research, worktrees for parallel branches, never cross-contaminate context. Select: path-scoped rules only load when matching files are opened, project hooks inject context only inside known project directories, skills load their body only on invoke. Compress: agent definitions stripped from 58KB to 5KB by removing generic advice the model already knows, 8 commands converted to lazy-loaded skills, rules trimmed to essentials. The result: 72KB always-loaded context down to 11.7KB, all capabilities preserved. This same methodology drove the intent-based lazy context system in Gogaa CLI, where a greeting loads 24 tokens instead of 3,909. WISC is not a tool, it is a design discipline for anyone building with AI agents.",
      },
    ],
    stack: ["Docker", "Docker Compose", "Ubuntu", "Node.js", "Playwright", "PostgreSQL", "Redis", "zsh"],
    results: [
      "Developer onboarding: 10 minutes from zero to first commit",
      "15+ CLI tools, 3 languages, 2 database services in one docker compose up",
      "Identical environment across Mac, Linux VPS, and phone-based SSH development",
      "Mac restore recovery: Docker Desktop install + clone + setup.sh = fully operational",
      "WISC context engineering: 72KB always-loaded down to 11.7KB (84% reduction), zero capability loss. Write decisions to files, Isolate tasks per conversation, Select context by path and intent, Compress agent definitions and rules. Same methodology applied in Gogaa CLI achieved 99.4% reduction for simple prompts",
    ],
    // github link private for now
  },
  {
    slug: "gogaa-cli",
    title: "Gogaa CLI",
    subtitle: "AI Coding Agent: Any Model, Any Provider (v1.1.0)",
    type: "Developer Tool / CLI",
    featured: true,
    requestAccess: true,
    impact: "I mapped the entire agentic coding ecosystem and found that every tool made you choose. Provider freedom or deep integration. Polished TUI or serious git workflow. MCP support or SEARCH/REPLACE edits. Nobody had all of it. So I built the thing that was missing: a full AI coding agent where the provider is a variable, the git workflow is production-grade, the UI is polished, and nothing is locked down. 11 providers, 1418 passing tests, plugin marketplace, parallel agents, watch mode, scheduled triggers, and now a web terminal companion. The only open-source CLI that closes every gap simultaneously.",
    problem:
      "Every AI coding tool I evaluated made you choose: provider freedom or deep integration. Polished TUI or serious git workflow. MCP support or surgical edits. Single-vendor lock-in means if the API goes down or rate limits hit, you stop working. GUI-only tools have no terminal, SSH, or headless support. Spartan CLIs lack plugin systems, parallel agents, and MCP. I wanted all of it in one tool, so I built it.",
    solution:
      "A TypeScript CLI where the provider is a variable, not a constant. 11 providers behind one unified streaming interface with automatic fallback. If your primary model hits rate limits or goes down, gogaa switches to the next without dropping the conversation. v1.0.0 shipped production-grade rendering, animation, shimmer effects, and polished TUI. The Aider-level git workflow from v0.9 still holds: tier-aware repo map, SEARCH/REPLACE edit blocks, LLM commit messages, and watch mode. On top of that: a REPL tool for interactive debugging, ultrathink detection for deep reasoning, multi-provider robustness hardening for free-tier models, CC-style plugin marketplace, scheduled triggers, and parallel agent panes. A companion web terminal (Gogaa Web) now lets you run the full agent from any browser via PTY over WebSocket. The two foundational bets from early versions still hold: a 5-strategy JSON arg parser that brought tool call success from ~70% to ~95%, and WAL session persistence so a crash mid-task loses nothing.",
    architecture: [
      "Provider Manager (11 providers, unified streaming, automatic fallback chain on 429/500/timeout)",
      "Smart Router (auto-routes prompts to best available model by task type)",
      "Tool Registry (24+ tools: file, bash, grep, glob, web, memory, agent, compare, semantic search, LSP, file-patch)",
      "Repo Map Engine (tier-aware: 300 tokens flat list for small models, 800 tokens with exports, 2000 tokens full symbol tree for large models)",
      "SEARCH/REPLACE Parser (surgical edit blocks, applied via file-patch tool with conflict detection)",
      "Watch Mode (fs.watch recursive, // AI! triggers code session, // AI? triggers ask session on file save)",
      "LSP Manager (lazy-start language servers for TS, Python, Go, Rust: go-to-def, find-refs, diagnostics)",
      "5-Strategy JSON Arg Parser (handles malformed model output, ~95% success vs ~70% naive)",
      "Agentic Loop (streaming tool calls, stuck detection, auto-retry, auto-verify after mutations)",
      "Auto-Lint/Test Loop (runs linter + tests after edits, injects repair prompt on failure, opt-in)",
      "Git Layer (LLM commit messages, attribution trailers with model identity, per-file dirty snapshots, granularity modes)",
      "Plugin Marketplace TUI (tabbed UI: Discover / Installed / Marketplaces / Errors. Type to search, Space to install)",
      "Scheduler (cron/interval/daily triggers, auto-starts at TUI launch, /schedule commands)",
      "Parallel Agent Panes (spawn N concurrent agent sessions, live output in split panes)",
      "Branch + Checkpoint System (save/restore session state, fork at any turn)",
      "Context Manager (js-tiktoken exact counting, semantic compaction at 85%, intent-based lazy loading)",
      "Session Layer (WAL persistence, save/resume by ID, crash recovery, trajectory replay, cloud handoff)",
      "React Ink TUI (streaming, inline diffs, 22 themes, command palette, model picker, plugin manager, status bar)",
      "REPL Tool (interactive Python/Node sessions inside the agent loop for live debugging)",
      "Ultrathink Detection (routes extended thinking requests to models that support deep reasoning)",
      "Denial Tracker (monitors model refusal patterns across providers for reliability scoring)",
      "File State Cache (incremental edit tracking, faster re-reads on unchanged files)",
      "Gogaa Web (companion PTY web terminal via Express + node-pty + WebSocket + xterm.js)",
    ],
    features: [
      "11 LLM providers with unified streaming and automatic fallback chain: if Claude hits rate limits, gogaa switches to GPT-4o, then Groq, then the next available model. Auto-discovered from env vars at startup, zero config",
      "Smart auto-routing classifies each prompt and routes to the best available model. Code tasks go to fast models, reasoning tasks go to deep models, simple queries go to free tier. Provider switches are transparent to the user",
      "MiniMax M2.7: OpenAI-compatible direct API, 1M context window, ~90% cheaper than Claude Sonnet, outperforms Sonnet 4.5 on SWE-bench Multilingual. The best cost-quality tradeoff I've found for agentic coding",
      "Anthropic tool search: BM25 deferred loading auto-enabled above 10 tools. Core tools (file, bash, grep, glob) always loaded, 11 secondary tools discovered on demand, ~85% context reduction (~45k tokens saved per session)",
      "24 built-in tools: file-read/write/edit (VFS-aware), bash (sandboxed), grep, glob, web-search, web-fetch, image-read, PDF-read, LSP (go-to-def, find-refs, diagnostics, hover), sub-agent, memory (save/list/recall), compare, semantic search, project index",
      "CAMEL-inspired multi-agent system: Planner/Executor/Critic pipeline with self-consistency sampling (spawn N agents, score via critic, return best). Dedicated critic agent type with structured scoring rubric. Sub-agents spawn with independent model selection, context, and tool scope",
      "React Ink TUI: block-art banner, streaming output with blinking cursor, numbered permission prompts, collapsible tool summaries, running timer with token cost per exchange",
      "Live status bar shows path, branch, context percentage, cost, and time. Updates in real time during streaming",
      "Git integration: /git status/diff/log, /commit with auto-drafted message, /pr to create commits and PRs from the chat interface",
      "Task management: /tasks add/done. Persistent task board that survives session resets and model switches",
      "95+ slash commands: /model, /mode, /plan, /trajectory, /handoff, /vfs-status, /vfs-commit, /commit, /pr, /mcp, /plugins, /hooks, /rules, /sessions, /resume, /verify, /theme, and many more",
      "Plugin system loads external tools from ~/.gogaa/plugins/. Each plugin registers tools and lifecycle hooks into the registry at startup",
      "MCP support: connect any Model Context Protocol server, tools appear dynamically in the registry without restarting",
      "5-strategy JSON arg parser: progressive fallback parsing (strict, trim, unescape, partial reconstruct, fallback object) for malformed model output. ~95% success vs ~70% with naive JSON.parse on real agentic runs",
      "OS-level sandboxing: macOS Seatbelt kernel profiles for process isolation, Docker containers for full containment, plus destructive command denylist, path allowlist, and full audit log per session",
      "WAL session persistence: write-ahead log written incrementally as messages are added. Crash mid-session, resume by ID with zero lost work. Works across model switches and reboots",
      "Self-learning engine tracks tool reliability, error patterns, and model performance across sessions. Auto-improves tool descriptions and routing heuristics over time without manual updates",
      "Cost budget enforcement: configurable $ cap per session, warns at 80%, hard stops at 100% to prevent runaway agentic loops",
      "Mode policy system: /mode plan (read-only), /mode review (read + compare), /mode ask (read + bash), /mode code (unrestricted), /mode debug (unrestricted + verbose). Each mode has its own tool allowlist enforced at the engine level",
      "Auto-lint/test loop: after every file mutation, automatically runs configured verification commands (linter, tests). On failure, injects a repair prompt into the agentic loop for automatic fix. Self-healing edits without user intervention",
      "Headless CI mode: gogaa --headless -y --json runs the full agent loop without a TUI, outputs structured JSON with success/content/toolCalls/modifiedFiles/errors, and exits with semantic codes (0=success, 3=tool failure, 4=verification failed). Ships with a GitHub Action for auto-fixing PRs",
      "LSP integration: connects to language servers (TypeScript, Python, Go, Rust) via JSON-RPC/stdio. The agent can call goto-definition, find-references, diagnostics, and hover instead of grepping. Lazy-starts servers on first request, auto-detects from file extension",
      "Virtual FS overlay: file-read/write/edit route through an in-memory overlay when active. Changes never touch disk until /vfs-commit. Conflict detection on commit (refuses if file changed on disk since staging). /vfs-diff shows unified diffs of all pending changes",
      "PageRank-scored repo map: extracts symbols from source files, builds a call graph from references, runs PageRank to rank by importance. Shows what functions call what, ordered by relevance. Better context than flat file listings",
      "Trajectory replay: /trajectory reads the audit JSONL log and formats it into a numbered decision tree with tool names, args, results, timing, and permission decisions. Debug agent behavior after the fact",
      "Cloud handoff: /handoff starts a local HTTP server with SSE, serves an embedded web viewer. Open the URL on your phone or another browser to see the live session. One-time auth token shown in terminal",
      "Workflow files: drop a markdown file in .gogaa/workflows/ and it becomes a slash command. Frontmatter for description/aliases/usage, body is the prompt template with {{args}} interpolation. Zero code needed to add custom workflows",
      "Voice input: /voice transcribes spoken prompts via Groq Whisper or OpenAI Whisper. Useful in hands-busy contexts",
      "Context compaction: js-tiktoken for exact token counting per model (not approximations), semantic summarization via the active model when context window hits 85%",
      "Intent-based lazy context: an intent classifier analyzes each prompt and categorizes it as chat, question, search, code, memory, skill, or full. Only the relevant system prompt sections, tool definitions, and rules are loaded for that category. A greeting loads 24 tokens of context instead of 3,909. A code task loads tool definitions and project rules but skips memory and skill catalogs. /context full overrides the classifier when you need everything. Combined with tool search, this means most turns carry only the context they actually need",
    ],
    techDecisions: [
      {
        title: "5-strategy JSON arg parser: the problem nobody talks about",
        description: "Every blog post about building an AI agent assumes models return valid JSON. In practice, especially with streaming, they don't. Truncated strings, double-escaped characters, extra whitespace around the JSON block, partial objects that cut off mid-key. A single JSON.parse throws and the tool call is lost. I built a parser that tries five progressively looser strategies and injects an error recovery hint into the tool result when it partially recovers, so the model knows what happened and can retry correctly. This brought tool call success from ~70% to ~95% on real agentic sessions. It's not glamorous, but it's the difference between a reliable agent and one that randomly fails.",
      },
      {
        title: "Direct MiniMax integration over aggregators like OpenRouter",
        description: "OpenRouter is convenient but it adds a routing layer, markup on top of the base price, and a dependency on a third party's uptime. MiniMax M2.7 has a direct API endpoint, uses the same OpenAI-compatible format, costs ~90% less than Claude Sonnet, and outperforms it on SWE-bench Multilingual. The integration was trivial: one new provider entry. The cost and latency benefits are permanent. I made this available to anyone running Gogaa with a MINIMAX_API_KEY.",
      },
      {
        title: "Anthropic tool search (defer_loading): 45k tokens saved per session",
        description: "Loading all 17 tool definitions upfront burns 10-15k context tokens before the model does any work. Anthropic's BM25 tool search lets you mark tools as deferred. The model retrieves only the 3-5 relevant ones per request. Core tools (file-read/write/edit, bash, grep, glob) are always present because they're needed in nearly every turn. The other 11 are deferred and fetched on demand. Over a typical 3-hour agentic session, this saves ~45k tokens. About $0.67 at Sonnet pricing, but more importantly it keeps the context window clear for actual conversation and code.",
      },
      {
        title: "React Ink for the TUI: components, not escape codes",
        description: "My first version used raw ANSI escape codes. Every UI change required recalculating cursor positions, buffering output to prevent flicker, and writing manual diff logic for partial re-renders. It was fragile and every new feature made it worse. Switching to React Ink gave me a proper component model. The streaming output, permission prompt, status bar, and background job list are all independent stateful components. React handles the diff and re-render. Adding a new UI element is a new component, the code is readable, and this is the right way to build terminal UIs.",
      },
      {
        title: "WAL session persistence: resume anywhere, lose nothing",
        description: "Serializing a session in one shot at the end means any crash loses everything. A write-ahead log appends each new message immediately as it arrives. The last valid state is always on disk. Resume by ID reconstructs the exact conversation state (model, tools, history, cost so far) without replaying anything. This works across model switches, reboots, network failures, and even switching from Claude to MiniMax mid-session. For long agentic tasks, this is not optional.",
      },
      {
        title: "Intent-based lazy context: don't load what you won't use",
        description: "The default approach in AI CLI tools is to dump everything into the system prompt on every turn: all tool definitions, all rules, all project context. This works until your setup grows. With 17 tools, 28 commands, project rules, and memory, the system prompt alone was nearly 4K tokens before the user typed anything. I built an intent classifier that runs before the LLM call. It categorizes the prompt (chat, code, search, memory, skill) and loads only the matching context slices. A simple greeting now costs 24 tokens of context instead of 3,909. Code tasks load tool definitions and project rules but skip the skill catalog and memory index. The classifier is fast (regex + keyword scoring, no LLM call) and has a /context full escape hatch when you genuinely need everything. This is the same principle behind Anthropic's tool search, applied to the entire system prompt.",
      },
    ],
    stack: ["TypeScript", "Node.js", "React 19", "React Ink", "Anthropic SDK", "OpenAI SDK", "js-tiktoken", "LSP Protocol", "node-pty", "xterm.js", "WebSocket", "MiniMax", "Groq", "Google Gemini", "Ollama"],
    results: [
      "v1.0.0 shipped: production-grade rendering, animation, and TUI polish. Major release milestone",
      "1,418 passing tests, 0 failures. Full regression suite across all features",
      "Production-grade git workflow: repo map, SEARCH/REPLACE edit blocks, LLM commit messages, watch mode, plus polished TUI and MCP support",
      "Plugin marketplace TUI: tabbed Discover/Installed/Marketplaces/Errors UI with keyboard nav, search, and install",
      "REPL tool for interactive Python/Node debugging sessions inside the agent loop",
      "Ultrathink (extended thinking mode) detection and routing for deep reasoning tasks",
      "Multi-provider robustness: weak model hardening for free-tier providers (Groq, OpenRouter). 8/9 providers pass multi-file edit benchmarks",
      "Gogaa Web: companion browser-based terminal with PTY support via WebSocket. Run gogaa from any browser",
      "~90% cost reduction vs Anthropic Sonnet via MiniMax M2.7 with no regression on SWE-bench coding benchmarks",
      "~85% context overhead reduction via Anthropic tool search + tier-aware repo map budgets",
      "Tool call success rate: ~70% to ~95% via 5-strategy JSON arg parser on real malformed model output",
      "Zero work lost across crashes, model switches, and reboots via WAL session persistence",
      "Intent-based lazy context: 3,909 → 24 tokens for simple prompts (99.4% reduction)",
      "Parallel agent panes, branch checkpoints, scheduled triggers, web session viewer, and 22 themes",
    ],
    // github link private until npm publish
    decision: {
      scenario: "Every AI coding CLI is locked to one vendor. If the API goes down or rate-limits hit, you stop working. Some have great git workflow but spartan UI. Others have polish but no MCP. Every tool makes you choose.",
      question: "What would you build?",
      options: [
        "Fork an existing CLI and add provider support",
        "Build a thin wrapper over an existing tool with better UI",
        "Build a new CLI where the provider is a variable, git workflow is production-grade, UI is polished",
      ],
      commonChoice: 0,
      myChoice: 2,
      reasoning:
        "Forking means inheriting vendor-specific assumptions. Wrapping existing tools means fighting their architecture. I built gogaa from scratch so every major subsystem (provider, TUI, git, tools, session) is first-class and swappable. v1.0.0: 11 providers with auto-fallback, polished TUI, REPL tool, ultrathink, web terminal, 1,418 tests.",
    },
    vs: {
      mine: {
        title: "Gogaa CLI",
        bullets: [
          "11 providers, unified streaming, auto-fallback on rate-limits",
          "Production-grade git: repo map, SEARCH/REPLACE, watch mode, LLM commits",
          "React Ink TUI with 22 themes, plugin marketplace",
          "Parallel agent panes + scheduled triggers + MCP support",
          "WAL session persistence (crash = zero lost work)",
        ],
      },
      standard: {
        title: "Single-vendor AI CLIs",
        bullets: [
          "Locked to one provider or one UX paradigm",
          "No cross-tool feature completeness",
          "Spartan TUIs with no plugin ecosystem",
          "Missing surgical edit modes or repo understanding",
          "Stop working when your provider hits rate limits",
        ],
      },
    },
  },
  {
    slug: "rasad",
    title: "Rasad",
    subtitle: "AI Observatory for Developers (v0.1.0)",
    type: "Developer Tool / CLI + Web",
    featured: true,
    impact: "Every developer using AI coding assistants is flying blind. You don't know what the AI changed, how much you spent, whether context was lost mid-session, or if the AI contradicted its own patterns. Rasad (Arabic for 'to observe') gives you complete visibility: a local-first CLI + web dashboard that monitors every AI coding session across multiple tools. 656 sessions synced, 38K messages indexed, 14K tool calls tracked. Your data never leaves your machine.",
    problem:
      "AI coding assistants are black boxes. You get a diff at the end but no visibility into what happened during the session. How many tokens were burned? Did the AI forget your requirements halfway through? Did it read 67 files but only change 3? Was that $87 session worth it or should you have split it? There's no observability layer for AI-assisted development. You're paying hundreds per month with no way to audit, optimize, or learn from the sessions.",
    solution:
      "A local-first CLI and web dashboard that ingests session data from multiple AI coding tools (Claude Code, Gogaa CLI, Codex CLI, with Cursor detected). SQLite with WAL mode and FTS5 full-text search handles 700MB+ of session data with streaming parsers that never load full files into memory. The dashboard provides 15+ analysis views: X-Ray (action-by-action replay), Session Quality grading (A-F based on efficiency and cost), Model Comparison (head-to-head cost/quality), Ghost Context (what the AI forgot), Drift Detection (pattern inconsistencies), and more. A React Ink TUI provides real-time monitoring with proactive alerts. Everything runs on localhost:9847, zero outbound network requests.",
    architecture: [
      "Data Adapters (Claude Code JSONL parser, Gogaa JSON parser, Codex CLI adapter, Cursor adapter stub)",
      "SQLite Database (WAL mode, FTS5 full-text search with Porter stemming, batch inserts in transactions of 1000)",
      "Streaming Parsers (handle 700MB+ session files without memory overflow)",
      "Fastify API Server (localhost-only, WebSocket for live updates, session/analytics/export endpoints)",
      "React 19 Dashboard (Vite, Tailwind CSS, React Query, Recharts, React Router, 15+ pages)",
      "React Ink TUI (full-screen interactive terminal UI with live session feed and proactive alerts)",
      "File Watcher (chokidar, incremental sync, pushes updates via WebSocket to dashboard clients)",
      "18 CLI Commands (karma, trajectory, passport, vibe-diff, drift, compare, search, watch, setup, etc.)",
      "Quality Scoring Engine (grades sessions A-F based on efficiency, focus, cost, and retries)",
      "Markdown Export (session passports and diffs exportable as .md files for handoff)",
    ],
    features: [
      "Cockpit dashboard: daily AI control center with command shortcuts, live stats (sessions, spend, threads), attention queue for costly sessions, connected agents overview, weekly activity chart, and most common actions breakdown",
      "X-Ray view: action-by-action session replay showing every tool call (read, write, edit, bash, search), timing, file focus areas, session health blocks, and error tracking. Filter by tool type",
      "Session Quality grading: A-F scores based on efficiency, focus, cost, and retry patterns. Grade distribution chart, top sessions vs needs-improvement leaderboard",
      "Model Comparison: head-to-head model analysis with cost per session, cache hit rates, message counts, average duration. Bar chart for total cost by model",
      "Multi-source ingestion: Claude Code, Gogaa CLI, Codex CLI all active. Cursor detected and ready to import. Each adapter has fidelity ratings and actionable next steps",
      "Full-text search across all conversations using SQLite FTS5 with Porter stemming and Unicode tokenization",
      "Live monitoring TUI: React Ink-based full-screen terminal UI with real-time session feed, proactive alerts for cost spikes, anomaly detection with sparklines",
      "18 CLI commands: rasad (quick summary), dashboard, sync, karma (costs), timeline, trajectory, context, passport, vibe-diff, drift, compare, search, watch, setup, quality, recommend, wrapped, summarize",
      "First sync processes 656 sessions (700MB+) in 6 seconds. Incremental sync under 1 second",
      "Markdown export: session passports and code diffs exportable as .md files for team handoff or documentation",
      "Zero outbound network requests. All data stays on your machine. SQLite database at ~/.rasad/rasad.db",
      "Auto-setup: rasad setup installs hooks and shell integration automatically",
    ],
    techDecisions: [
      {
        title: "SQLite over PostgreSQL: the right database for a local-first tool",
        description: "Rasad runs on the developer's machine, not a server. SQLite with WAL mode gives concurrent read/write without a database process, FTS5 gives full-text search across 38K+ messages without Elasticsearch, and the entire database is a single file at ~/.rasad/rasad.db. Batch inserts in transactions of 1000 rows keep first-sync under 7 seconds for 656 sessions. No Docker, no connection strings, no migrations to run.",
      },
      {
        title: "Streaming parsers for session ingestion",
        description: "Claude Code stores sessions as JSONL files that can reach hundreds of megabytes. Loading an entire file into memory would crash Node.js on large histories. The parser reads line-by-line using streaming, processes each message immediately, and never holds more than one line in memory. This is why Rasad can handle 700MB+ of session data on a 16GB machine without issues.",
      },
      {
        title: "Dual interface: web dashboard + terminal TUI",
        description: "Some developers live in the browser, others never leave the terminal. Building both interfaces from the same API layer means neither is a second-class citizen. The dashboard uses React 19 + Vite + Tailwind for rich visualizations (charts, health blocks, grade distributions). The TUI uses React Ink for real-time monitoring without leaving the terminal. Both connect to the same Fastify API with WebSocket for live updates.",
      },
    ],
    stack: ["TypeScript", "Node.js", "SQLite", "better-sqlite3", "FTS5", "Fastify", "WebSocket", "React 19", "Vite", "Tailwind CSS", "React Query", "Recharts", "React Ink", "Commander.js", "chokidar"],
    results: [
      "656 sessions synced across 4 AI coding tools in a single dashboard",
      "38,075 messages and 14,637 tool calls indexed with full-text search",
      "First sync: 6.2 seconds for 700MB+ of session data. Incremental sync: <1 second",
      "Average session quality score: 82/100 (Grade A). 200 sessions graded automatically",
      "Model cost tracking: $29,904 on opus-4-6, $483 on sonnet-4-6, $219 on haiku across 345 daily sessions",
      "15+ dashboard views: Cockpit, X-Ray, Sessions, Models, Grades, Savings, Highlights, Patterns, Steps, Memory, Summary, Changes, Search, Agents",
      "Zero outbound network requests. 100% local-first. Your data never leaves your machine",
    ],
    github: "https://github.com/shami-ah/rasad",
    decision: {
      scenario: "You're spending $500+/day on AI coding assistants across multiple tools. You have no visibility into what the AI is doing, what it costs per session, or whether sessions are efficient.",
      question: "How do you get observability?",
      options: [
        "Manually review API billing dashboards per provider",
        "Build custom logging into each AI tool",
        "Build a unified observatory that ingests from all tools automatically",
      ],
      commonChoice: 0,
      myChoice: 2,
      reasoning:
        "Billing dashboards show cost but not behavior. Custom logging requires modifying each tool. Rasad sits outside all of them, reads their session files directly, and gives you one dashboard with X-Ray replay, quality grading, cost tracking, and pattern analysis across every AI tool you use.",
    },
    vs: {
      mine: {
        title: "Rasad",
        bullets: [
          "Multi-tool: Claude Code + Gogaa + Codex + Cursor in one view",
          "Action-level X-Ray: see every read, write, edit, bash call",
          "Session quality grading (A-F) with efficiency scoring",
          "Local-first: zero network requests, data never leaves your machine",
          "6-second sync for 700MB+ of session data",
        ],
      },
      standard: {
        title: "API billing dashboards",
        bullets: [
          "Single provider only, no cross-tool view",
          "Cost data only, no behavioral analysis",
          "No session replay or action-level visibility",
          "Data lives on vendor servers",
          "No quality scoring or optimization recommendations",
        ],
      },
    },
  },
  {
    slug: "agent-system",
    title: "AI Agent System",
    subtitle:
      "Multi-agent platform with 5 purpose-built AI agents for job search, research, code review, proposals, and freelance automation",
    type: "AI Agents",
    impact:
      "5 autonomous agents with tool-calling, deployed on HuggingFace Spaces. $0/month operating cost.",
    featured: true,
    problem:
      "I needed AI that could actually DO things, not just chat. Searching jobs, researching tech, reviewing PRs, drafting proposals, and handling freelance messages each require different tools and domain knowledge. Running multiple separate tools or doing it manually was slow.",
    solution:
      "Built a multi-agent system where each agent has a specific purpose, custom tools (web search, URL fetching, GitHub API), and tailored prompts. Agents plan, call tools, and synthesize results. These are real agents, not chatbots. Deployed on HuggingFace Spaces with a portfolio-ready web UI.",
    architecture: [
      "FastAPI server with 5 agent endpoints, each backed by a purpose-built agent definition",
      "Custom tool-calling engine: parses Groq tool_calls, executes async tool functions, feeds results back",
      "Shared tool layer (Tavily web search, URL fetcher, GitHub PR diff) reused across agents",
      "Agent definitions: system prompt + tool selection + output format per use case",
      "Portfolio-ready dark UI with agent selector, real-time tool call indicators",
    ],
    features: [
      "Job Search Agent: searches multiple boards, evaluates fit, drafts cover letters",
      "Research Agent: multi-source research with cross-referenced structured reports",
      "Code Review Agent: fetches GitHub PR diffs, analyzes bugs/security/types",
      "Upwork Proposal Agent: reads job postings, matches skills, drafts tailored proposals",
      "n8n Webhook Agent: receives freelance messages, analyzes, drafts replies",
    ],
    techDecisions: [
      {
        title: "Groq for inference",
        description:
          "Free tier, fast (300 tokens/sec), native tool-calling support, zero inference cost.",
      },
      {
        title: "Tool-calling over chain-of-thought",
        description:
          "Agents use real function calls (web_search, github_pr_diff) instead of generating code. More reliable, structured, auditable.",
      },
      {
        title: "HuggingFace Spaces over AWS/Vercel",
        description:
          "16GB RAM free tier, no request timeout limit, Docker support. Perfect for long-running agent tasks.",
      },
      {
        title: "Agent-per-purpose over general assistant",
        description:
          "Each agent has a focused system prompt and curated tool set. A job search agent doesn't need code review tools. Scoping prevents confusion and hallucination.",
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
      "TypeScript",
      "Next.js",
    ],
    results: [
      "5 autonomous agents deployed and operational",
      "Tool-calling engine: agents execute 1-8 tool calls per request automatically",
      "$0/month hosting on Groq free tier + HF Spaces free tier",
      "API-first: every agent callable from n8n, command center PWA, or any HTTP client",
      "Portfolio-ready UI showcasing real AI agent capabilities",
    ],
    live: "https://shami96-deep-agent.hf.space",
  },
];

export function getProject(slug: string): ProjectData | undefined {
  return projects.find((p) => p.slug === slug);
}
