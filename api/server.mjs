import { createServer } from "node:http";

const PORT = 3001;

// Read from environment (set in docker-compose .env)
const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";

// ── Portfolio context (same as functions/api/chat.ts) ──────────────

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
CodeLens (v0.3.3): AI code review engine, 305 hand-crafted patterns across 9 stacks
  Source-to-sink taint tracking, PR risk scoring, Guardian mode (injects rules into Claude Code/Cursor/Copilot)
  Zero deps, <1s reviews, single 351KB file, Docker distribution via GHCR
  Private beta, evaluating commercial release

Gogaa CLI (v1.0.0): open-source AI coding agent
  11 LLM providers with auto-fallback, full Aider parity (repo map, SEARCH/REPLACE, watch mode, LLM commits)
  Full Claude Code UI parity, REPL tool, ultrathink detection, multi-provider robustness
  Plugin marketplace, parallel panes, scheduled triggers, WAL session persistence
  1,418 tests passing, React Ink TUI with 22 themes
  Gogaa Web: companion browser-based terminal with PTY over WebSocket

OpenEvent: production SaaS for event management
  Email→AI classification→entity extraction→human approval→workflow execution→audit log
  100+ clients, 150+ events, saves 1.5hrs/day per team
  pgvector, Edge Functions, Stripe, multi-tenant, live at openevent.io

=== STACK ===
AI: Claude (Opus/Sonnet), OpenAI (GPT-4o, o1), RAG (pgvector, Pinecone), LangChain, multi-agent orchestration, human-in-the-loop
Full-stack: React, Next.js, React Native (Expo), TypeScript, Python, FastAPI, Supabase, Stripe, Docker
Infra: GitHub Actions CI/CD, Docker Compose, Traefik (reverse proxy), Sentry, Grafana, n8n, Cloudflare, Vercel
NOT in stack: Kubernetes, AWS, Azure, GCP managed services. Ahtesham uses Docker Compose + Traefik on self-managed servers, not K8s orchestration. Can learn/adopt if the role requires it.

=== RATES ===
Contract: $80–120/hr for direct engagements
Project-based: starting from $3k for scoped deliveries, scales with complexity
Full-time: $4k–10k/mo depending on scope, location, and impact
Rates vary by engagement type — best to discuss on a 15-min call via the Book a Call button

=== PROCESS ===
Architecture document first (1-3 day discovery)
Sprint-based delivery with weekly demos
CodeLens runs on every PR — findings alongside every change
Transparency: shared staging, Supabase dashboard, PR-by-PR visibility

=== PRINCIPLES ===
Human-in-the-loop by default for anything touching money/commitments
Architect first, code second
Strict at system boundaries, trust internal invariants
Consumer AND producer of AI tooling
One task per agent session, no context contamination
Deploy behind feature flags, 10% rollout, monitor, then full

=== AVAILABILITY ===
Open to full-time remote roles and 90-day engagements
Timezone: UTC+5, overlaps EU mornings + Gulf business hours
Response time: <24h, faster via booking page
`.trim();

const MODEL_VOICES = {
  groq: "\n\nVOICE: Be concise and direct. Short sentences. Get to the point. No fluff.",
  claude: "\n\nVOICE: Be thoughtful and nuanced. Consider angles. Use phrases like 'I think' or 'that depends on'. Slightly longer, more reflective answers.",
  gpt4: "\n\nVOICE: Be well-structured. Use bullet points or numbered lists when helpful. Professional and organized tone.",
  nvidia: "\n\nVOICE: Be technically precise. Include specific numbers, metrics, and benchmarks when available. Engineering-focused and data-driven.",
};

const MODEL_TEMPS = { groq: 0.25, claude: 0.5, gpt4: 0.2, nvidia: 0.15 };

// ── Rate limiter: 10 req/min per IP ───────────────────────────────

const rateMap = new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60_000;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateMap) {
    if (now > entry.reset) rateMap.delete(ip);
  }
}, 300_000);

// ── HTTP Server ────────────────────────────────────────────────────

function json(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

const server = createServer(async (req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  // Health check
  if (req.url === "/health" && req.method === "GET") {
    return json(res, 200, { status: "ok" });
  }

  // Chat endpoint
  if (req.url === "/api/chat" && req.method === "POST") {
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ?? req.socket.remoteAddress ?? "unknown";
    if (isRateLimited(clientIp)) {
      return json(res, 429, { answer: "You're asking too fast. Try again in a minute." });
    }

    if (!GROQ_API_KEY) {
      return json(res, 200, {
        answer: "Chat is temporarily unavailable. Use the Book a Call button to schedule a quick chat.",
      });
    }

    let body = "";
    for await (const chunk of req) body += chunk;

    let message = "";
    let modelId = "groq";
    try {
      const parsed = JSON.parse(body);
      message = parsed.message?.trim() ?? "";
      modelId = parsed.model ?? "groq";
    } catch {
      return json(res, 400, { answer: "Invalid request." });
    }

    if (!message) {
      return json(res, 200, { answer: "Please type a question." });
    }

    try {
      const groqRes = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: PORTFOLIO_CONTEXT + (MODEL_VOICES[modelId] ?? "") },
              { role: "user", content: message },
            ],
            temperature: MODEL_TEMPS[modelId] ?? 0.3,
            max_tokens: 400,
          }),
        }
      );

      if (!groqRes.ok) throw new Error(`Groq API: ${groqRes.status}`);

      const data = await groqRes.json();
      const answer =
        data.choices?.[0]?.message?.content ??
        "Something went wrong. Try rephrasing your question.";

      return json(res, 200, { answer });
    } catch {
      return json(res, 200, {
        answer: "The AI agent is temporarily offline. Use the Book a Call button to schedule a quick chat.",
      });
    }
  }

  // 404 for everything else
  json(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`shami-api listening on :${PORT}`);
});
