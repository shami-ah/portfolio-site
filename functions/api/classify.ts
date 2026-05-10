// Cloudflare Pages Function — classifies free-text queries into agent commands.
// Uses Groq (Llama 3.3) with structured output for fast intent classification.
// Falls back to a branded redirect response if no command matches.

interface Env {
  GROQ_API_KEY: string;
}

const COMMANDS = [
  "hire", "contact", "projects", "cv", "resume", "rate", "stack",
  "skills", "availability", "impact", "experience", "build", "tour",
  "chat", "call", "boot", "help",
] as const;

const SYSTEM_PROMPT = `You are an intent classifier for Ahtesham Ahmad's portfolio agent.

Given a visitor's free-text query, classify it into ONE of these commands:
${COMMANDS.join(", ")}

If the query clearly maps to a command, return:
{"command": "<command>", "confidence": <0.0-1.0>}

If the query asks about something Ahtesham hasn't worked on, or you're unsure, return:
{"command": null, "confidence": 0, "response": "<brief friendly response>"}

Rules for the response when command is null:
- NEVER say "no" or "I don't know" or "not available"
- ALWAYS redirect to booking a call or chatting directly
- Mention that Ahtesham is a fast learner who works across domains
- Keep it under 2 sentences, conversational tone
- Examples of good responses:
  - "That's not in my current stack overview, but Ahtesham picks up anything fast. Book a 15-min call and he'll give you a straight answer."
  - "I don't have details on that here, but Ahtesham works across a wide range of tech. Worth a quick chat to discuss."

Context about Ahtesham's work:
- AI/ML: Claude, OpenAI, RAG, multi-agent systems, human-in-the-loop
- Full-stack: React, Next.js, TypeScript, Python, Supabase, Stripe
- Products: OpenEvent (event SaaS), CodeLens (code review), Gogaa CLI (AI coding agent), Rasad (AI observability)
- Infra: Docker, GitHub Actions, Cloudflare
- Rate: $80-120/hr contract, project-based from $3k (nothing below $3k), full-time flexible

Return ONLY valid JSON, no markdown, no explanation.`;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({ command: null, confidence: 0, response: "Agent is warming up. Try typing a command like 'projects' or 'rate'." }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  let query = "";
  try {
    const body = (await request.json()) as { query?: string };
    query = body.query?.trim() ?? "";
  } catch {
    return new Response(
      JSON.stringify({ command: null, confidence: 0, response: "Invalid request." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!query) {
    return new Response(
      JSON.stringify({ command: null, confidence: 0, response: "Type something to get started." }),
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
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: query },
          ],
          temperature: 0.1,
          max_tokens: 150,
        }),
      },
    );

    if (!groqRes.ok) throw new Error(`Groq API: ${groqRes.status}`);

    const data = (await groqRes.json()) as {
      choices: { message: { content: string } }[];
    };

    const raw = data.choices?.[0]?.message?.content ?? "";

    // Parse JSON from response (handle potential markdown wrapping)
    const jsonStr = raw.replace(/```json\n?/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(jsonStr) as {
      command: string | null;
      confidence: number;
      response?: string;
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return new Response(
      JSON.stringify({
        command: null,
        confidence: 0,
        response: "Ahtesham works across AI, full-stack, and automation. Book a quick call to discuss your specific needs.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }
};
