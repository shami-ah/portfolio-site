// Cloudflare Pages Function — unified agent endpoint.
// Combines intent classification + conversational response in one call.
// Returns structured JSON: { intent, response, actions }

interface Env {
  GROQ_API_KEY: string;
}

// Rate limiter: 10 requests/min per IP
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// Stale entry cleanup every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateMap) {
    if (now > entry.reset) rateMap.delete(key);
  }
}, 300_000);

const KNOWN_COMMANDS = [
  "whoami", "hire", "contact", "projects", "cv", "resume", "rate", "stack",
  "skills", "availability", "impact", "experience", "career", "build", "tour",
  "chat", "call", "writing", "boot", "help", "openevent", "codelens", "gogaa", "rasad",
] as const;

const PORTFOLIO_CONTEXT = `
You are Ahtesham's AI assistant on his portfolio website.
Answer from the context below. If you can partially answer, do so and say what you're unsure about.
Only deflect if the question is completely unrelated to Ahtesham's work, skills, or availability.
When deflecting, say: "That's outside what I know about Ahtesham's work right now. Try asking about his rate, stack, availability, tools, or how he works with clients."

IMPORTANT RULES:
- NEVER include URLs, links, or web addresses in your responses. Instead, refer users to the "Book a Call" button on the page.
- NEVER mention "calendly" or any booking platform by name.
- Keep call duration references consistent: say "15-min call" when suggesting a booking.
- Match answers to the question asked. Read the question carefully — don't mix up sections.
- If someone asks about a specific technology (e.g. "do you work with X?"), check the STACK section and answer yes/no honestly. If it's not listed, say so.

=== IDENTITY ===
Name: Engr. Ahtesham Ahmad
Role: AI Automation Architect, Lead AI Developer
Domain: AI Engineering — building production AI systems, multi-agent orchestration, developer tools, AI-powered SaaS
Location: Islamabad, Pakistan (UTC+5) — remote-first
Email: shami8024@gmail.com
GitHub: github.com/shami-ah
LinkedIn: linkedin.com/in/ahtesham
Booking: available via the Book a Call button on the website
Available: full-time remote roles + 90-day project engagements

=== EXPERIENCE ===
- Lead AI Developer @ More Life Hospitality GmbH (Sep 2025 – now)
  Built OpenEvent: email→AI classification→entity extraction→human approval→workflow execution
  Live with 100+ clients, 150+ events, saves ~1.5hrs/day per team
  Stack: React, TypeScript, Supabase (Edge Functions, RLS, pgvector), Stripe, OpenAI, Docker, GitHub Actions
- Director IT & R&D @ Rouelite Techno (2022–2024)
  10-person team, CRM serving 500+ daily users, 70% manual data entry reduction
- AI Engineering Consultant @ Wadware House / Global Clients (2019–now)
  250+ projects, 40+ returning clients, 100% satisfaction rate
  500+ RLHF/SFT evaluation sessions on frontier models (Outlier, RWS, Translated)

=== PRODUCTS ===
CodeLens (v0.3.3): AI code review engine, 430 hand-crafted patterns across 9 stacks
  Source-to-sink taint tracking, PR risk scoring, Guardian mode
  Zero deps, <1s reviews, single 351KB file, Docker distribution via GHCR

Gogaa CLI (v1.0.0): open-source AI coding agent
  11 LLM providers with auto-fallback, full Aider parity, Claude Code UI parity
  1,400+ tests, React Ink TUI with 22 themes, WAL session persistence

OpenEvent: production SaaS for event management
  Email→AI→human approval→workflow, 100+ clients, 150+ events

Rasad (v1.0.0): AI session observatory for developers
  656 sessions across 4 tools, 38K messages, 14K tool calls
  X-Ray session replay, quality grading (A-F), 100% local

Command Center: personal AI operations PWA
  Unified inbox (Gmail + Calendar), dual-AI triage, replaces 4+ tools

=== STACK ===
AI: Claude (Opus/Sonnet), OpenAI (GPT-4o, o1), RAG (pgvector, Pinecone), LangChain, multi-agent orchestration, human-in-the-loop
Full-stack: React, Next.js, React Native (Expo), TypeScript, Python, FastAPI, Supabase, Stripe, Docker
Infra: GitHub Actions, Docker Compose, Traefik, Sentry, Grafana, n8n, Cloudflare
NOT in stack: Kubernetes, AWS, Azure, GCP managed services

=== RATES ===
Contract: $80–120/hr for direct engagements
Project-based: starting from $3k for scoped deliveries
Full-time: $4k–10k/mo depending on scope
Best to discuss on a 15-min call via the Book a Call button

=== PRINCIPLES ===
Human-in-the-loop by default for anything touching money/commitments
Architect first, code second
Strict at system boundaries, trust internal invariants
Deploy behind feature flags, 10% rollout, monitor, then full

=== AVAILABILITY ===
Open to full-time remote roles and 90-day engagements
Timezone: UTC+5, overlaps EU mornings + Gulf business hours
Response time: <24h, faster via booking page
`.trim();

const AGENT_PREAMBLE = `
You are the unified AI agent on Ahtesham Ahmad's portfolio website. You serve two functions:

1. INTENT CLASSIFICATION: Given the visitor's query, determine if it maps to one of these UI commands:
   ${KNOWN_COMMANDS.join(", ")}
   Return the command name and your confidence (0.0 to 1.0).
   Only return a command if the query CLEARLY maps to it (confidence > 0.8).

2. RESPONSE GENERATION: Always generate a conversational response.
   - If a command was matched, the response should be a brief 1-2 sentence confirmation.
   - If no command matched, the response should fully answer the query using the portfolio context below.
   - Keep responses under 3 sentences for simple questions, under 5 for complex ones.

3. ACTION SUGGESTIONS: If your response relates to booking a call, viewing CV, or navigating to a section, include structured actions.

You MUST return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "intent": { "command": "<command_name>" or null, "confidence": <0.0-1.0> },
  "response": "<your conversational response>",
  "actions": [{ "type": "scroll|popup|drawer|external", "target": "<section_id_or_url>", "label": "<button text>" }]
}

If no actions are relevant, return an empty actions array.

`.trim();

const MODEL_VOICES: Record<string, string> = {
  groq: "\n\nVOICE: Be concise and direct. Short sentences. Get to the point.",
  claude: "\n\nVOICE: Be thoughtful and nuanced. Consider angles. Slightly longer, more reflective.",
  gpt4: "\n\nVOICE: Be well-structured. Use bullet points when helpful. Professional tone.",
  nvidia: "\n\nVOICE: Be technically precise. Include specific numbers and metrics.",
};

const MODEL_TEMPS: Record<string, number> = {
  groq: 0.15,
  claude: 0.3,
  gpt4: 0.15,
  nvidia: 0.1,
};

interface AgentRequest {
  query: string;
  history?: { role: "user" | "assistant"; content: string }[];
  section?: string;
  model?: string;
}

interface AgentAction {
  type: "scroll" | "popup" | "drawer" | "external";
  target: string;
  label: string;
}

interface AgentResponse {
  intent: { command: string | null; confidence: number };
  response: string;
  actions: AgentAction[];
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const clientIp = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(clientIp)) {
    return Response.json(
      { intent: { command: null, confidence: 0 }, response: "You're asking too fast. Try again in a minute.", actions: [] } satisfies AgentResponse,
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  if (!env.GROQ_API_KEY) {
    return Response.json(
      { intent: { command: null, confidence: 0 }, response: "Agent is warming up. Try a command like 'projects' or 'rate'.", actions: [] } satisfies AgentResponse,
    );
  }

  let body: AgentRequest;
  try {
    body = (await request.json()) as AgentRequest;
  } catch {
    return Response.json(
      { intent: { command: null, confidence: 0 }, response: "Invalid request.", actions: [] } satisfies AgentResponse,
      { status: 400 },
    );
  }

  const query = body.query?.trim();
  if (!query) {
    return Response.json(
      { intent: { command: null, confidence: 0 }, response: "Type something to get started.", actions: [] } satisfies AgentResponse,
    );
  }

  const modelId = body.model ?? "groq";
  const voice = MODEL_VOICES[modelId] ?? MODEL_VOICES.groq;
  const temp = MODEL_TEMPS[modelId] ?? 0.15;

  // Build message history for context
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: AGENT_PREAMBLE + "\n\n" + PORTFOLIO_CONTEXT + voice },
  ];

  // Include last 6 messages of history for continuity
  if (body.history?.length) {
    for (const msg of body.history.slice(-6)) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  messages.push({ role: "user", content: query });

  try {
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          temperature: temp,
          max_tokens: 500,
          response_format: { type: "json_object" },
        }),
      },
    );

    if (!groqRes.ok) throw new Error(`Groq API: ${groqRes.status}`);

    const data = (await groqRes.json()) as {
      choices: { message: { content: string } }[];
    };

    const raw = data.choices?.[0]?.message?.content ?? "";
    const jsonStr = raw.replace(/```json\n?/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(jsonStr) as AgentResponse;

    // Validate structure
    const response: AgentResponse = {
      intent: {
        command: result.intent?.command ?? null,
        confidence: result.intent?.confidence ?? 0,
      },
      response: result.response ?? "I couldn't process that. Try asking about projects, rate, or availability.",
      actions: Array.isArray(result.actions) ? result.actions : [],
    };

    return Response.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      {
        intent: { command: null, confidence: 0 },
        response: "Ahtesham works across AI, full-stack, and automation. Try a specific question or use the Book a Call button.",
        actions: [{ type: "external", target: "booking", label: "Book a call" }],
      } satisfies AgentResponse,
    );
  }
};
