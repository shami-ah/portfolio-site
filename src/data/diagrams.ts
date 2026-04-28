export const diagrams: Record<string, string> = {
  codelens: `flowchart LR
    A[Git Diff] --> B[File Parser]
    B --> C[Codebase Index]
    C --> D{Incremental\\nUpdate 60ms}
    D --> E[Pass 0-2\\nPre-flight\\nLayer Analysis\\nCross-file Tracing]
    E --> F[Pass 3\\nPattern Scan\\n272 patterns]
    F --> G[Pass 3.5\\nTaint Tracking\\nTest Coverage\\nDep Vulns]
    G --> H[Pass 4\\nSelf-Validation\\n+ PR Risk Score]
    H --> I{AI Agent\\nMode?}
    I -->|Yes| J[LLM Reasoning\\nClaude / Codex / Gemini]
    I -->|No| K[Findings + Risk Score]
    J --> K
    K --> L[Self-Learning\\nFeedback Loop]
    L --> C

    style A fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style C fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style F fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style G fill:#1e293b,stroke:#ef4444,color:#fca5a5
    style H fill:#1e293b,stroke:#eab308,color:#fde047
    style J fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style K fill:#1e293b,stroke:#22c55e,color:#86efac
    style L fill:#1e293b,stroke:#eab308,color:#fde047`,

  openevent: `flowchart TD
    A[Client Email\\nGmail / Outlook / IMAP] --> B[Thread Dedup\\n& Ingestion]
    B --> C[AI Intent Classification\\nGPT]
    C --> D[Entity Extraction\\n+ pgvector Enrichment]
    D --> E[Task Creation\\nPrioritized Inbox]
    E --> F{Human Review}
    F -->|Approve| G[Workflow Engine\\nJSON/YAML Declarative]
    F -->|Edit| E
    F -->|Reject| H[Archive + Learn]
    G --> I[Calendar Booking\\nGoogle / Outlook]
    G --> J[Stripe Invoice]
    G --> K[CRM Sync]
    G --> L[Email Reply]
    I & J & K & L --> M[Audit Log\\n+ Telemetry]
    M --> N[Auto-Approval\\nRule Learning]
    N --> F

    style A fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style C fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style F fill:#1e293b,stroke:#eab308,color:#fde047
    style G fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style M fill:#1e293b,stroke:#22c55e,color:#86efac`,

  "command-center": `flowchart TD
    A[PWA Shell\\nReact + TypeScript] --> B[Gmail API\\nInbox Sync]
    A --> C[Google Calendar\\nAPI]
    A --> D[Supabase\\nBackend]
    B --> E[AI Triage\\nAnthropic Claude]
    C --> E
    E --> F[Priority Classification]
    F --> G[Unified Dashboard]
    D --> G
    G --> H[Action Queue]
    H --> I[Reply Draft]
    H --> J[Calendar Event]
    H --> K[Task Creation]

    style A fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style E fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style G fill:#1e293b,stroke:#22c55e,color:#86efac`,

  "gluten-free": `flowchart TD
    A[LLM Query Generator\\n200+ targeted queries] --> B[Concurrent Scraping]
    B --> C[SerpAPI\\nGoogle/Bing/DDG]
    B --> D[Tavily API]
    C & D --> E[Dedup & Scoring]
    E --> F[Firebase Firestore]
    F --> G[Deal Cards UI]

    H[GPS Location] --> I[Google Maps API]
    I --> J[GF Restaurant\\nFinder]
    J --> K[Map + Cards UI]

    L[User Input\\nDish Name] --> M[OpenAI\\nRecipe Generator]
    M --> N[Recipe UI\\nIngredients + Steps]

    G & K & N --> O[Cross-Platform\\nReact Native + Next.js]

    style A fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style E fill:#1e293b,stroke:#eab308,color:#fde047
    style M fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style O fill:#1e293b,stroke:#22c55e,color:#86efac`,

  "rag-pipeline": `flowchart LR
    A[Documents\\nPDF / Docs / Wiki] --> B[Chunking &\\nPreprocessing]
    B --> C[Embedding\\nGeneration\\nHugging Face]
    C --> D[Pinecone\\nVector Store]
    E[User Query] --> F[Query\\nEmbedding]
    F --> D
    D --> G[Semantic\\nSimilarity\\nSearch]
    G --> H[Context\\nAssembly]
    H --> I[GPT-4\\nAnswer Generation]
    I --> J[Response\\n+ Sources]

    style A fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style D fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style I fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style J fill:#1e293b,stroke:#22c55e,color:#86efac`,

  "vqa-agent": `flowchart LR
    A[Image Input] --> B[BLIP-2\\nVision Encoder]
    B --> C[Feature\\nExtraction]
    D[User Question] --> E[Prompt Chain\\nAssembly]
    C --> E
    F[RAG Context\\nEnrichment] --> E
    E --> G[LLM Reasoning\\nOpenAI]
    G --> H[Answer\\nGeneration]
    H --> I[Streamlit\\nInterface]

    style B fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style G fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style I fill:#1e293b,stroke:#22c55e,color:#86efac`,

  "dev-env": `flowchart TD
    A[iTerm2 / SSH / Phone] --> B[dev alias]
    B --> C[Docker Container]

    subgraph Container ["Dev Container (Ubuntu 22.04)"]
      D[zsh + p10k]
      E[Node 24 + pnpm + TS]
      F[Claude Code + Skills]
      G[gh + supabase + vercel]
      H[Playwright + Chromium]
    end

    C --> D & E & F & G & H

    subgraph Volumes ["Volume Mounts (Host)"]
      I[~/Work/ Code]
      J[~/.claude/ Config]
      K[~/.ssh/ Keys]
      L[~/.env.secrets]
    end

    I & J & K & L -.-> Container

    subgraph Services ["Companion Services"]
      M[PostgreSQL 15]
      N[Redis 7]
    end

    Container <--> M & N

    style C fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style Container fill:#0f172a,stroke:#3b82f6,color:#93c5fd
    style Volumes fill:#0f172a,stroke:#eab308,color:#fde047
    style Services fill:#0f172a,stroke:#22c55e,color:#86efac`,

  "gogaa-cli": `flowchart TD
    A[User Prompt] --> B[Intent Classifier\\nchat / code / search / memory]
    B --> C[Context Assembler\\ntier-aware repo map + rules]
    C --> D[Provider Manager\\n11 providers · auto-fallback]
    D --> E[Agentic Loop\\nstreaming tool calls]

    E --> F1[File Tools\\nread / write / edit / patch]
    E --> F2[Bash · Grep · Glob\\nLSP go-to-def find-refs]
    E --> F3[Web · Memory\\nSub-agent · MCP]

    F1 & F2 & F3 --> G{Mutation?}
    G -->|Yes| H[Auto-Lint + Test\\nAider-style repair prompt]
    G -->|No| I[Response]
    H --> I

    I --> J[Git Layer\\nLLM commit · attribution · SEARCH/REPLACE]
    J --> K[Session WAL\\ncrash recovery · resume by ID]

    subgraph Context ["Context Budget · per model tier"]
      C1[Small · 300 tok flat map]
      C2[Medium · 800 tok exports]
      C3[Large · 2000 tok symbol tree]
    end

    C -.-> Context

    style A fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style D fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style E fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style G fill:#1e293b,stroke:#eab308,color:#fde047
    style H fill:#1e293b,stroke:#ef4444,color:#fca5a5
    style J fill:#1e293b,stroke:#22c55e,color:#86efac
    style K fill:#1e293b,stroke:#22c55e,color:#86efac
    style Context fill:#0f172a,stroke:#3b82f6,color:#93c5fd`,

  "agent-orchestrator": `flowchart TD
    A[User Goal] --> B[Planner Agent\\ngoal decomposition]
    B --> C[Task DAG\\nwith dependencies]
    C --> D{HITL\\nApproval Gate}
    D -->|Reject| E[Cancelled]
    D -->|Approve| F[Orchestrator\\nDAG execution]

    F --> G[Worker Agent\\ntool-use loop]
    G --> H[Validator Agent\\nstructured critique]
    H -->|Pass| I[Task Complete]
    H -->|Fail round 1-2| J[Feedback\\nInjection]
    J --> G
    H -->|Fail round 3| K[Task Failed\\n+ HITL escalation]

    subgraph Tools ["Tool Registry (Zod-validated)"]
      T1[web_search]
      T2[file_read]
      T3[file_write]
      T4[shell_exec]
    end

    G --> Tools

    subgraph Infra ["Infrastructure"]
      M1[Memory Store\\nerror pattern learning]
      M2[Event Bus\\ntask:critique · task:validated]
      M3[State Machine\\n6 states · validated transitions]
    end

    F -.-> Infra
    H -.-> M1

    style A fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style B fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style D fill:#1e293b,stroke:#eab308,color:#fde047
    style G fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style H fill:#1e293b,stroke:#ef4444,color:#fca5a5
    style I fill:#1e293b,stroke:#22c55e,color:#86efac
    style J fill:#1e293b,stroke:#eab308,color:#fde047
    style Tools fill:#0f172a,stroke:#3b82f6,color:#93c5fd
    style Infra fill:#0f172a,stroke:#22c55e,color:#86efac`,

  rasad: `flowchart TD
    A[Claude Code\\nJSONL sessions] --> D[Streaming\\nParser]
    B[Gogaa CLI\\nJSON + JSONL] --> D
    C[Codex CLI\\nadapter] --> D

    D --> E[SQLite\\nWAL + FTS5]

    E --> F1[Dashboard\\nReact 19 + Recharts]
    E --> F2[TUI\\nReact Ink]
    E --> F3[CLI\\n18 commands]

    F2 --> G[X-Ray View\\nCAMEL phase detection]
    G --> G1[Planning]
    G --> G2[Exploring]
    G --> G3[Executing]
    G --> G4[Verifying]
    G --> G5[Refining]

    E --> H[Quality Engine\\n6-factor scoring A-F]
    H --> I[Coaching\\nphase-aware tips]
    E --> J[Recommendations\\ncost optimization]

    subgraph Live ["Live Monitoring"]
      K1[File Watcher\\nchokidar]
      K2[WebSocket\\npush updates]
      K3[Fastify API\\nlocalhost only]
    end

    D -.-> Live
    Live -.-> F1

    style A fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style B fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style E fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style G fill:#1e293b,stroke:#eab308,color:#fde047
    style H fill:#1e293b,stroke:#ef4444,color:#fca5a5
    style I fill:#1e293b,stroke:#22c55e,color:#86efac
    style Live fill:#0f172a,stroke:#22c55e,color:#86efac`,

  "agent-system": `flowchart TD
    A[Client Request] --> B[FastAPI Server]

    B --> C1[Job Search\\nAgent]
    B --> C2[Research\\nAgent]
    B --> C3[Code Review\\nAgent]
    B --> C4[Upwork Proposal\\nAgent]
    B --> C5[n8n Webhook\\nAgent]

    subgraph Tools ["Shared Tool Layer"]
      T1[Tavily\\nWeb Search]
      T2[URL Fetcher]
      T3[GitHub\\nPR Diff]
    end

    C1 & C2 & C3 & C4 & C5 --> Tools

    Tools --> E1[Groq API\\nLLM Inference]
    Tools --> E2[Tavily API\\nSearch]
    Tools --> E3[GitHub API\\nPR Data]

    E1 --> F[Agent Response\\n+ Tool Call Log]

    style B fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style Tools fill:#0f172a,stroke:#eab308,color:#fde047
    style E1 fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style F fill:#1e293b,stroke:#22c55e,color:#86efac`,
};
