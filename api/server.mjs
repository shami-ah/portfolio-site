import { createServer } from "node:http";
import {
  BOOK_URL,
  GROQ_MODEL,
  buildSystemPrompt,
  buildContextualMessage,
  getModelTemperature,
  polishAnswer,
  shouldSuggestBooking,
} from "./chat-context.mjs";

const PORT = 3001;

// Read from environment (set in docker-compose .env)
const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";

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
    let history = [];
    try {
      const parsed = JSON.parse(body);
      const rawMessage = parsed.message ?? parsed.query ?? parsed.question ?? parsed.prompt;
      message = typeof rawMessage === "string" ? rawMessage.trim() : "";
      modelId = parsed.model ?? "groq";
      history = Array.isArray(parsed.history)
        ? parsed.history
            .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
            .slice(-8)
            .map((m) => ({ role: m.role, content: m.content.slice(0, 1200) }))
        : [];
    } catch {
      return json(res, 400, { answer: "Invalid request." });
    }

    if (!message) {
      return json(res, 200, { answer: "Please type a question." });
    }

    try {
      const contextualMessage = buildContextualMessage(message, history);
      const groqRes = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
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
        }
      );

      if (!groqRes.ok) throw new Error(`Groq API: ${groqRes.status}`);

      const data = await groqRes.json();
      const rawAnswer =
        data.choices?.[0]?.message?.content ??
        "Something went wrong. Try rephrasing your question.";
      const answer = polishAnswer(rawAnswer, contextualMessage);

      return json(res, 200, {
        answer,
        actions: shouldSuggestBooking(contextualMessage) ? [{ label: "Book a 15-min call", href: BOOK_URL }] : [],
      });
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
