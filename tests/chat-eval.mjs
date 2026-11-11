// Offline retrieval eval for the portfolio chatbot (no API key needed).
// Runs retrieveKnowledge() in keyword (BM25) mode and checks that the expected
// source is in the top 5. Answer-level evals against the running server
// (facts, refusals, no URLs) are still to do: handover Phase 3.
//
// Usage: npm run test:chat-eval

import { retrieveKnowledge } from "../api/knowledge/retriever.mjs";
import { allChunks } from "../api/knowledge/all-chunks.mjs";

/** expect: chunk id prefix or project name that must appear in the top 5 */
const cases = [
  { q: "How many patterns does CodeLens have?", expect: "codelens" },
  { q: "show me how CodeLens compares to Greptile", expect: "codelens" },
  { q: "How much time does OpenEvent save a team?", expect: "openevent-impact" },
  { q: "Why does OpenEvent need human approval?", expect: "openevent" },
  { q: "Which AI providers does Gogaa support?", expect: "gogaa" },
  { q: "how big are the logs Rasad handles?", expect: "rasad" },
  { q: "Tell me about the agent orchestrator", expect: "orchestrator" },
  { q: "What did you do at Rouelite?", expect: "career-rouelite" },
  { q: "What's your hourly rate?", expect: "profile-rates" },
  { q: "How much do you charge for a project?", expect: "profile-rates" },
  { q: "Do you work with Kubernetes?", expect: "profile-stack" },
  { q: "Which tech stack do you use?", expect: "profile-stack" },
  { q: "Where are you based?", expect: "profile-identity" },
  { q: "Are you available for full-time remote work?", expect: "profile-availability" },
  { q: "How do you run a client project?", expect: "profile-process" },
];

const URL_PATTERN = /https?:\/\/|www\./i;

let hits = 0;
for (const c of cases) {
  const { results } = await retrieveKnowledge(c.q, {});
  const ok = results.some(
    (r) => r.id.startsWith(c.expect) || (r.project ?? "").toLowerCase().replace(/\s+/g, "-") === c.expect,
  );
  if (ok) hits += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${c.q}  ->  ${results.map((r) => r.id).join(", ") || "(nothing)"}`);
}

const withUrls = allChunks.filter((chunk) => URL_PATTERN.test(chunk.text)).map((chunk) => chunk.id);

const recall = (hits / cases.length) * 100;
console.log(`\nrecall@5: ${recall.toFixed(1)}% (${hits}/${cases.length})`);
console.log(`chunks containing URLs: ${withUrls.length ? withUrls.join(", ") : "none"}`);

if (recall < 90 || withUrls.length > 0) process.exit(1);
