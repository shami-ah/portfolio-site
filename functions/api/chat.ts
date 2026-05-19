// Cloudflare Pages Function — proxies chat questions to Groq API with
// full portfolio context. Set GROQ_API_KEY in your Cloudflare Pages
// environment settings (Settings → Environment Variables).

import {
  BOOK_URL,
  GROQ_MODEL,
  buildSystemPrompt,
  buildContextualMessage,
  getModelTemperature,
  polishAnswer,
  shouldSuggestBooking,
} from "../../api/chat-context.mjs";

interface Env {
  GROQ_API_KEY: string;
}

// Simple in-memory rate limiter: 10 requests per minute per IP
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

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const clientIp = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ answer: "You're asking too fast. Try again in a minute." }),
      { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } },
    );
  }

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
  let history: { role: "user" | "assistant"; content: string }[] = [];
  try {
    const body = (await request.json()) as {
      message?: unknown;
      query?: unknown;
      question?: unknown;
      prompt?: unknown;
      model?: string;
      history?: { role: "user" | "assistant"; content: string }[];
    };
    const rawMessage = body.message ?? body.query ?? body.question ?? body.prompt;
    message = typeof rawMessage === "string" ? rawMessage.trim() : "";
    modelId = body.model ?? "groq";
    history = Array.isArray(body.history)
      ? body.history
          .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-8)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 1200) }))
      : [];
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
    const contextualMessage = buildContextualMessage(message, history);
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: buildSystemPrompt(modelId) },
            ...history,
            { role: "user", content: contextualMessage },
          ],
          temperature: getModelTemperature(modelId),
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
    const rawAnswer =
      data.choices?.[0]?.message?.content ??
      "Something went wrong. Try rephrasing your question.";
    const answer = polishAnswer(rawAnswer, contextualMessage);

    return new Response(JSON.stringify({
      answer,
      actions: shouldSuggestBooking(contextualMessage) ? [{ label: "Book a 15-min call", href: BOOK_URL }] : [],
    }), {
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
