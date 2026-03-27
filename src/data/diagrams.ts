export const diagrams: Record<string, string> = {
  codelens: `flowchart LR
    A[Git Diff] --> B[File Parser]
    B --> C[Codebase Index]
    C --> D{Incremental\\nUpdate 60ms}
    D --> E[Pass 0\\nPre-flight]
    E --> F[Pass 1\\nLayer Analysis]
    F --> G[Pass 2\\nCross-file Tracing]
    G --> H[Pass 3\\nPattern Scan\\n113 patterns]
    H --> I[Pass 4\\nSelf-Validation]
    I --> J{AI Agent\\nMode?}
    J -->|Yes| K[LLM Reasoning\\nClaude / Codex / Gemini]
    J -->|No| L[Findings Report]
    K --> L
    L --> M[Self-Learning\\nFeedback Loop]
    M --> C

    style A fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style C fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style H fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style K fill:#1e293b,stroke:#3b82f6,color:#93c5fd
    style L fill:#1e293b,stroke:#22c55e,color:#86efac
    style M fill:#1e293b,stroke:#eab308,color:#fde047`,

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
};
