import {
  buildContextualMessage,
  polishAnswer,
  shouldSuggestBooking,
} from "../api/chat-context.mjs";

const cases = [
  {
    q: "tell me more about gogaa",
    must: ["open-source AI coding agent", "11 LLM providers", "1,418"],
    mustNot: ["Book a Call", "15-min call"],
    book: false,
  },
  {
    q: "which stack do you use?",
    must: ["TypeScript", "Supabase", "Python/FastAPI", "human-in-the-loop"],
    mustNot: ["Book a Call"],
    book: false,
  },
  {
    q: "can you handle a Python project?",
    must: ["Yes", "FastAPI", "RAG", "timeline"],
    book: true,
  },
  {
    q: "what is your rate?",
    must: ["$80-120/hr", "$3k", "$4k-10k/mo"],
    book: true,
  },
  {
    q: "what about timeline?",
    history: [
      { role: "user", content: "can you handle a Python project?" },
      { role: "assistant", content: "Yes, if the Python work is backend, automation, data pipelines, agent services, FastAPI, RAG, evaluation, or production hardening." },
    ],
    must: ["1-3 days", "weekly demos", "deployment constraints"],
    book: true,
  },
  {
    q: "tell me about OpenEvent",
    must: ["production SaaS", "100+ clients", "human approval", "audit logs"],
    book: false,
  },
  {
    q: "what is CodeLens?",
    must: ["430", "source-to-sink", "sub-second"],
    book: false,
  },
  {
    q: "what is Rasad?",
    must: ["local AI session observatory", "700MB+", "model cost"],
    book: false,
  },
  {
    q: "why should I hire him as a senior AI engineer?",
    must: ["OpenEvent", "CodeLens", "Gogaa", "production ownership"],
    book: true,
  },
  {
    q: "does he do Kubernetes or AWS?",
    must: ["not core", "Docker Compose", "Traefik"],
    mustNot: ["expert"],
    book: false,
  },
  {
    q: "how much?",
    history: [
      { role: "user", content: "I have a SaaS automation project. Can he handle it?" },
      { role: "assistant", content: "Likely yes. The fit depends on scope, integrations, timeline, and production risk." },
    ],
    must: ["$80-120/hr", "$3k", "scope"],
    book: true,
  },
];

function fallbackFor(q) {
  return `Raw model answer for: ${q}. For more details, consider booking a 15-min call.`;
}

const failures = [];

for (const c of cases) {
  const contextual = buildContextualMessage(c.q, c.history ?? []);
  const answer = polishAnswer(fallbackFor(c.q), contextual);
  const booking = shouldSuggestBooking(contextual);

  for (const needle of c.must ?? []) {
    if (!answer.toLowerCase().includes(needle.toLowerCase())) {
      failures.push(`${c.q}: missing "${needle}"\n  ${answer}`);
    }
  }

  for (const needle of c.mustNot ?? []) {
    if (answer.toLowerCase().includes(needle.toLowerCase())) {
      failures.push(`${c.q}: should not include "${needle}"\n  ${answer}`);
    }
  }

  if (typeof c.book === "boolean" && booking !== c.book) {
    failures.push(`${c.q}: booking=${booking}, expected ${c.book}`);
  }

  if (answer.length > 520) {
    failures.push(`${c.q}: answer too long (${answer.length})`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n\n"));
  process.exit(1);
}

console.log(`chat eval passed (${cases.length} cases)`);
