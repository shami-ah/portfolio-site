// Cloudflare Pages Function — proxies chat questions to Groq API with
// full portfolio context. Set GROQ_API_KEY in your Cloudflare Pages
// environment settings (Settings → Environment Variables).

interface Env {
  GROQ_API_KEY: string;
}

const PORTFOLIO_CONTEXT = `
You are an AI assistant for Engr. Ahtesham Ahmad's portfolio website.
Answer ONLY from the context below. If the question is not covered,
respond: "That's outside what I know about Ahtesham's work. Want to
ask directly? Use the Book a Call button to schedule a quick chat."

IMPORTANT RULES:
- NEVER include URLs, links, or web addresses in your responses. Instead, refer users to the "Book a Call" button on the page.
- NEVER mention "calendly" or any booking platform by name.
- Keep call duration references consistent: say "15-min call" when suggesting a booking.

=== IDENTITY ===
Name: Engr. Ahtesham Ahmad
Role: AI Automation Architect, Lead AI Developer
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
Infra: GitHub Actions CI/CD, Docker Compose, Sentry, Grafana, n8n, Cloudflare, Vercel

=== RATES ===
Hourly: $80–120/hr for contract work
Project-based: starting from $3k for scoped deliveries, scales with complexity. Nothing below $3k.
Full-time: flexible depending on scope, equity, and impact
Best to discuss on a 15-min call — use the Book a Call button

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

// Per-model personality injected into the system prompt so switching
// models produces visibly different response styles.
const MODEL_VOICES: Record<string, string> = {
  groq: "\n\nVOICE: Be concise and direct. Short sentences. Get to the point. No fluff.",
  claude: "\n\nVOICE: Be thoughtful and nuanced. Consider angles. Use phrases like 'I think' or 'that depends on'. Slightly longer, more reflective answers.",
  gpt4: "\n\nVOICE: Be well-structured. Use bullet points or numbered lists when helpful. Professional and organized tone.",
  nvidia: "\n\nVOICE: Be technically precise. Include specific numbers, metrics, and benchmarks when available. Engineering-focused and data-driven.",
};

const MODEL_TEMPS: Record<string, number> = {
  groq: 0.25,
  claude: 0.5,
  gpt4: 0.2,
  nvidia: 0.15,
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({
        answer:
          "Chat is temporarily unavailable. Use the Book a Call button to schedule a quick chat.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  let message = "";
  let modelId = "groq";
  try {
    const body = (await request.json()) as { message?: string; model?: string };
    message = body.message?.trim() ?? "";
    modelId = body.model ?? "groq";
  } catch {
    return new Response(JSON.stringify({ answer: "Invalid request." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!message) {
    return new Response(
      JSON.stringify({ answer: "Please type a question." }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

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
          messages: [
            { role: "system", content: PORTFOLIO_CONTEXT + MODEL_VOICES[modelId as keyof typeof MODEL_VOICES] },
            { role: "user", content: message },
          ],
          temperature: MODEL_TEMPS[modelId as keyof typeof MODEL_TEMPS] ?? 0.3,
          max_tokens: 400,
        }),
      },
    );

    if (!groqRes.ok) {
      throw new Error(`Groq API: ${groqRes.status}`);
    }

    const data = (await groqRes.json()) as {
      choices: { message: { content: string } }[];
    };
    const answer =
      data.choices?.[0]?.message?.content ??
      "Something went wrong. Try rephrasing your question.";

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    // Graceful fallback
    return new Response(
      JSON.stringify({
        answer:
          "The AI agent is temporarily offline. Use the Book a Call button to schedule a quick chat.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }
};
