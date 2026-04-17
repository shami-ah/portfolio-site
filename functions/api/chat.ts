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
ask directly? Book a 15-min call at calendly.com/shami8024/30min"

=== IDENTITY ===
Name: Engr. Ahtesham Ahmad
Role: AI Automation Architect, Lead AI Developer
Location: Islamabad, Pakistan (UTC+5) — remote-first
Email: shami8024@gmail.com
GitHub: github.com/shami-ah
LinkedIn: linkedin.com/in/ahtesham
Calendly: calendly.com/shami8024/30min
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

Gogaa CLI (v0.10.0): open-source AI coding agent
  11 LLM providers with auto-fallback, full Aider parity (repo map, SEARCH/REPLACE, watch mode, LLM commits)
  Plugin marketplace, parallel panes, scheduled triggers, WAL session persistence
  1,418 tests passing, React Ink TUI with 22 themes

OpenEvent: production SaaS for event management
  Email→AI classification→entity extraction→human approval→workflow execution→audit log
  100+ clients, 150+ events, saves 1.5hrs/day per team
  pgvector, Edge Functions, Stripe, multi-tenant, live at openevent.io

=== STACK ===
AI: Claude (Opus/Sonnet), OpenAI (GPT-4o, o1), RAG (pgvector, Pinecone), LangChain, multi-agent orchestration, human-in-the-loop
Full-stack: React, Next.js, React Native (Expo), TypeScript, Python, FastAPI, Supabase, Stripe, Docker
Infra: GitHub Actions CI/CD, Docker Compose, Sentry, Grafana, n8n, Cloudflare, Vercel

=== RATES ===
Project work: tier-based, starting ~$3k for scoped deliveries
Full-time: flexible depending on scope, equity, impact
Best to discuss on a 15-min call

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
Response time: <24h, faster via Calendly
`.trim();

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({
        answer:
          "Chat is temporarily unavailable. Book a 15-min call instead: calendly.com/shami8024/30min",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  let message = "";
  try {
    const body = (await request.json()) as { message?: string };
    message = body.message?.trim() ?? "";
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
            { role: "system", content: PORTFOLIO_CONTEXT },
            { role: "user", content: message },
          ],
          temperature: 0.3,
          max_tokens: 350,
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
          "The AI agent is temporarily offline. Book a call directly: calendly.com/shami8024/30min",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }
};
