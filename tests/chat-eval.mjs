

import { validateChunks } from "../api/knowledge/validate.mjs";
import { retrieveKnowledge } from "../api/knowledge/retriever.mjs";

const API_URL =
  process.env.CHAT_EVAL_API_URL ?? "http://localhost:3001/api/chat";

const URL_PATTERN = /https?:\/\/|www\./i;

const retrievalCases = [
  { q: "How many patterns does CodeLens have?", expect: "project-codelens" },
  { q: "show me how CodeLens compares to Greptile", expect: "project-codelens" },
  { q: "How much time does OpenEvent save a team?", expect: "project-openevent" },
  { q: "Why does OpenEvent need human approval?", expect: "project-openevent" },
  { q: "Which AI providers does Gogaa support?", expect: "project-gogaa-cli" },
  { q: "how big are the logs Rasad handles?", expect: "project-rasad" },
  { q: "Tell me about the agent orchestrator", expect: "project-agent-orchestrator" },
  { q: "What did you do at Rouelite?", expect: "career-rouelite" },
  { q: "What's your hourly rate?", expect: "profile-rates" },
  { q: "How much do you charge for a project?", expect: "profile-rates" },
  { q: "Do you work with Kubernetes?", expect: "profile-stack" },
  { q: "Which tech stack do you use?", expect: "profile-stack" },
  { q: "Where are you based?", expect: "profile-identity" },
  { q: "Are you available for full-time remote work?", expect: "profile-availability" },
  { q: "How do you run a client project?", expect: "profile-process" },
];

function logResult(ok, label, details = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${details ? ` -> ${details}` : ""}`);
  return ok;
}

// 1. Knowledge-base validation
console.log("\nKNOWLEDGE BASE VALIDATION");
console.log("========================");

const validation = validateChunks();

logResult(
  validation.valid,
  "Knowledge chunks validation",
  `${validation.totalChunks} chunks, ${validation.uniqueIds} unique IDs`,
);

for (const error of validation.errors) {
  console.error("  -", error);
}

// 2. Offline retrieval recall@5
console.log("\nRETRIEVAL EVALUATION");
console.log("====================");

let retrievalHits = 0;

for (const test of retrievalCases) {
  const { results } = await retrieveKnowledge(test.q, { topK: 5 });

  const matched = results.some(
    (result) =>
      result.id.startsWith(test.expect) ||
      (result.project ?? "").toLowerCase().replace(/\s+/g, "-") === test.expect,
  );

  if (matched) retrievalHits++;

  logResult(
    matched,
    test.q,
    results.map((result) => result.id).join(", ") || "No results",
  );
}

const recall = (retrievalHits / retrievalCases.length) * 100;

// 3. Live answer-level evaluation
console.log("\nLIVE ANSWER EVALUATION");
console.log("======================");

async function askChat(message, history = []) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    throw new Error(`Chat API returned HTTP ${response.status}`);
  }

  const data = await response.json();

  if (typeof data.answer !== "string" || !data.answer.trim()) {
    throw new Error(`Invalid chat response for: ${message}`);
  }

  return data;
}

const factCases = [
  {
    name: "CodeLens pattern count",
    message: "How many patterns does CodeLens have?",
    expected: /\b544\b/,
  },
  {
    name: "Hourly rate",
    message: "What's your hourly rate?",
    expected: /\$80\b/,
  },
  {
    name: "Kubernetes stack accuracy",
    message: "Do you work with Kubernetes?",
    expected: /\bnot\b|\bdoesn't\b|\bdoes not\b|\bisn't\b|\bis not\b/i,
    forbidden: /\bcurrently uses Kubernetes\b|\buses Kubernetes\b|\bKubernetes is part of his stack\b/i,
  },
  {
    name: "Rasad follow-up context",
    message: "How large are the logs it handles?",
    history: [
      { role: "user", content: "Tell me about Rasad." },
      {
        role: "assistant",
        content: "Rasad is an AI session observatory for developers.",
      },
    ],
    expected: /700\s*MB/i,
    expectedProject: "rasad",
  },
];

let factsPassed = 0;
let refusalsPassed = 0;
let urlFree = true;

let serverAvailable = false;

try {
  const healthUrl = new URL(API_URL);
  healthUrl.pathname = "/api/health";

  const healthResponse = await fetch(healthUrl, {
    signal: AbortSignal.timeout(10_000),
  });

  serverAvailable = healthResponse.ok;

  if (serverAvailable) {
    console.log("Chat API health check: PASS");
  } else {
    console.log("Chat API health check: FAIL");
  }
} catch {
  console.error(
    "Chat API is unavailable. Start it with: node --env-file=.env api/server.mjs",
  );
}

if (serverAvailable) {
  for (const test of factCases) {
    try {
      const data = await askChat(test.message, test.history ?? []);
      const answer = data.answer;

      const answerMatches = test.expected.test(answer);
      const forbiddenFound = test.forbidden?.test(answer) ?? false;

      const projectMatches = test.expectedProject
        ? data.sources?.some(
            (source) =>
              source.project?.toLowerCase() === test.expectedProject ||
              source.id?.toLowerCase().includes(test.expectedProject),
          )
        : true;

      const passed =
        answerMatches && !forbiddenFound && projectMatches;

      if (passed) factsPassed++;

      logResult(
        passed,
        test.name,
        `answer check: ${answerMatches}, source check: ${projectMatches}`,
      );

      if (URL_PATTERN.test(answer)) {
        urlFree = false;
        logResult(false, `${test.name}: no URL in answer`);
      }
    } catch (error) {
      logResult(false, test.name, error.message);
    }
  }

  // France must be declined because it is outside portfolio knowledge.
  try {
    const data = await askChat("What's the capital of France?");
    const answer = data.answer;

    const declined =
      /not something.*portfolio|doesn't cover|not covered|don't have.*information|cannot answer|can't answer|couldn't find enough relevant information|outside.*portfolio/i.test(
        answer,
      );

    if (declined) refusalsPassed++;

    logResult(declined, "Out-of-scope France question");

    if (URL_PATTERN.test(answer)) {
      urlFree = false;
      logResult(false, "France answer contains no URL");
    }
  } catch (error) {
    logResult(false, "Out-of-scope France question", error.message);
  }
} else {
  console.log("Live answer tests skipped because the API is unavailable.");
}

// 4. Evaluation summary
const factsScore = (factsPassed / factCases.length) * 100;
const refusalScore = refusalsPassed * 100;
const validationPassed = validation.valid;

console.log("\nPHASE 3 EVALUATION SUMMARY");
console.log("==========================");
console.log(`Recall@5: ${recall.toFixed(1)}% (${retrievalHits}/${retrievalCases.length})`);
console.log(`Facts: ${factsScore.toFixed(1)}% (${factsPassed}/${factCases.length})`);
console.log(`Refusals: ${refusalScore.toFixed(1)}% (${refusalsPassed}/1)`);
console.log(`Zero URLs: ${urlFree ? "PASS" : "FAIL"}`);
console.log(`Knowledge validation: ${validationPassed ? "PASS" : "FAIL"}`);

const passed =
  validationPassed &&
  recall >= 90 &&
  factsScore >= 90 &&
  refusalScore === 100 &&
  urlFree &&
  serverAvailable;

console.log(
  `\nOVERALL: ${passed ? "PASS" : "FAIL"}`,
);

if (!passed) {
  process.exitCode = 1;
}
