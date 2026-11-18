
import { readFileSync } from "node:fs";
import { validateChunks } from "../api/knowledge/validate.mjs";
import { retrieveKnowledge } from "../api/knowledge/retriever.mjs";

const API_URL =
  process.env.CHAT_EVAL_API_URL ?? "http://localhost:3001/api/chat";

const URL_PATTERN = /https?:\/\/|www\./i;

// Read the CodeLens pattern count from its source data.
const projectsSource = readFileSync(
  new URL("../src/data/projects.ts", import.meta.url),
  "utf8",
);

const codelensMatch = projectsSource.match(
  /slug:\s*"codelens"[\s\S]{0,1200}?(\d{3,})\s+patterns/i,
);

if (!codelensMatch) {
  throw new Error("Could not read CodeLens pattern count from projects.ts");
}

const CODELENS_PATTERN_COUNT = Number(codelensMatch[1]);

function logResult(ok, label, details = "") {
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${label}${details ? ` -> ${details}` : ""}`,
  );
  return ok;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

// 2. Section-level retrieval evaluation
console.log("\nRETRIEVAL EVALUATION");
console.log("====================");

const retrievalCases = [
  {
    q: "How many patterns does CodeLens have?",
    expect: "project-codelens-results",
  },
  {
    q: "show me how CodeLens compares to Greptile",
    expect: "project-codelens-decisions",
  },
  {
    q: "How much time does OpenEvent save a team?",
    expect: "project-openevent-results",
  },
  {
    q: "Why does OpenEvent need human approval?",
    expect: "project-openevent-decisions",
  },
  {
    q: "Which AI providers does Gogaa support?",
    expect: "project-gogaa-cli-architecture",
  },
  {
    q: "how big are the logs Rasad handles?",
    expect: "project-rasad-summary",
  },
  {
    q: "Tell me about the agent orchestrator",
    expect: "project-agent-orchestrator-summary",
  },
  {
    q: "What did you do at Rouelite?",
    expect: "career-rouelite",
  },
  {
    q: "What's your hourly rate?",
    expect: "profile-rates",
  },
  {
    q: "How much do you charge for a project?",
    expect: "profile-rates",
  },
  {
    q: "Do you work with Kubernetes?",
    expect: "profile-not-in-stack",
  },
  {
    q: "Which tech stack do you use?",
    expect: "profile-stack",
  },
  {
    q: "Where are you based?",
    expect: "profile-identity",
  },
  {
    q: "Are you available for full-time remote work?",
    expect: "profile-availability",
  },
  {
    q: "How do you run a client project?",
    expect: "profile-process",
  },
];

let retrievalHits = 0;

for (const test of retrievalCases) {
  const { results } = await retrieveKnowledge(test.q, { topK: 5 });

  const matched = results.some(
    (result) =>
      result.id.startsWith(test.expect) ||
      (result.project ?? "").toLowerCase().replace(/\s+/g, "-") ===
        test.expect,
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
  // CodeLens
  {
    name: "CodeLens pattern count",
    message: "How many patterns does CodeLens have?",
    expected: new RegExp(`\\b${CODELENS_PATTERN_COUNT}\\b`),
    expectedProject: "codelens",
  },
  {
    name: "CodeLens supported stacks",
    message: "Across how many stacks does CodeLens work?",
    expected: /\b9\b/,
    expectedProject: "codelens",
  },
  {
    name: "CodeLens review speed",
    message: "How quickly does CodeLens review code?",
    expected: /under\s+(one|1)\s+second|<\s*1\s*s|sub-second|\b\d{2,3}\s?ms\b/i,
    expectedProject: "codelens",
  },
  {
    name: "CodeLens Greptile coverage",
    message: "How did CodeLens improve its coverage against Greptile?",
    expected: /8%[\s\S]*100%|100%[\s\S]*8%/i,
    expectedProject: "codelens",
  },
  {
    name: "CodeLens missed issues",
    message: "How many issues did Greptile catch that CodeLens initially missed?",
    expected: /\b12\b/,
    expectedProject: "codelens",
  },
  {
    name: "CodeLens persistent index",
    message: "What does the persistent codebase index enable?",
    expected: /call graph|schema graph|cross-file/i,
    expectedProject: "codelens",
  },
  {
    name: "CodeLens taint tracking",
    message: "What does source-to-sink taint tracking do?",
    expected: /source|sink|data flow|taint/i,
    expectedProject: "codelens",
  },

  // Gogaa CLI
  {
    name: "Gogaa provider count",
    message: "How many AI providers does Gogaa support?",
    expected: /\b11\b/,
    expectedProject: "gogaa",
  },
  {
    name: "Gogaa automatic fallback",
    message: "When does Gogaa automatically switch providers?",
    expected: /rate.?limit|provider.*down|fallback/i,
    expectedProject: "gogaa",
  },
  {
    name: "Gogaa terminal interface",
    message: "What interface does Gogaa use?",
    expected: /React Ink/i,
    expectedProject: "gogaa",
  },
  {
    name: "Gogaa themes",
    message: "How many themes does the Gogaa TUI have?",
    expected: /\b22\b/,
    expectedProject: "gogaa",
  },
  {
    name: "Gogaa plugin marketplace",
    message: "Does Gogaa include a plugin marketplace?",
    expected: /plugin marketplace/i,
    expectedProject: "gogaa",
  },
  {
    name: "Gogaa JSON parser improvement",
    message: "How did the five-strategy JSON parser improve tool-call success?",
    expected: /95%[\s\S]*70%|70%[\s\S]*95%/i,
    expectedProject: "gogaa",
  },
  {
    name: "Gogaa test count",
    message: "How many tests does Gogaa have passing?",
    expected: /1,400\+|1400\+/,
    expectedProject: "gogaa",
  },
  {
    name: "Gogaa session recovery",
    message: "How does Gogaa recover sessions after a crash?",
    expected: /WAL|write-ahead|persist|recover|resume/i,
    expectedProject: "gogaa",
  },

  // Rasad
  {
    name: "Rasad sessions",
    message: "How many sessions has Rasad analyzed?",
    expected: /\b656\b/,
    expectedProject: "rasad",
  },
  {
    name: "Rasad messages",
    message: "How many messages has Rasad indexed?",
    expected: /38K|38,000|38\s*000/i,
    expectedProject: "rasad",
  },
  {
    name: "Rasad tool calls",
    message: "How many tool calls does Rasad track?",
    expected: /14K|14,000|14\s*000/i,
    expectedProject: "rasad",
  },
  {
    name: "Rasad large-file ingestion",
    message: "How does Rasad handle large session files?",
    expected: /700\s*MB|streaming/i,
    expectedProject: "rasad",
  },
  {
    name: "Rasad database",
    message: "Which database and search technology does Rasad use?",
    expected: /SQLite[\s\S]*FTS5|FTS5[\s\S]*SQLite/i,
    expectedProject: "rasad",
  },
  {
    name: "Rasad privacy",
    message: "Does Rasad send session data to external servers?",
    expected: /zero outbound|no outbound|never leaves|100% local|does not send/i,
    expectedProject: "rasad",
  },
  {
    name: "Rasad quality grading",
    message: "How does Rasad grade session quality?",
    expected: /A.?F|quality grading|quality scoring/i,
    expectedProject: "rasad",
  },

  // Profile
  {
    name: "Professional identity",
    message: "What is Ahtesham's professional role?",
    expected: /AI Automation Architect|Lead AI Developer/i,
  },
  {
    name: "Professional location",
    message: "Where is Ahtesham based and what is his timezone?",
    expected: /Islamabad|UTC\+5/i,
  },
  {
    name: "Remote availability",
    message: "Is Ahtesham available for full-time remote work?",
    expected: /full.?time|remote/i,
  },
  {
    name: "Hourly rate",
    message: "What is Ahtesham's hourly rate?",
    expected: /\$80[\s\S]*\$120|\$80\s*(to|-)\s*\$120/i,
  },
  {
    name: "Project starting price",
    message: "What is the starting price for a project?",
    expected: /\$3k|\$3,000/i,
  },
  {
    name: "Kubernetes stack accuracy",
    message: "Does Ahtesham currently use Kubernetes?",
    expected: /not part of|does not use|isn't part|not currently/i,
    forbidden: /currently uses Kubernetes|Kubernetes is part of his stack/i,
  },
  {
    name: "Client delivery process",
    message: "How does Ahtesham manage client project delivery?",
    expected: /architecture|discovery|weekly demos|sprint/i,
  },
];

let factsPassed = 0;
let urlFree = true;
let serverAvailable = false;

try {
  const healthUrl = new URL(API_URL);
  healthUrl.pathname = "/api/health";

  const healthResponse = await fetch(healthUrl, {
    signal: AbortSignal.timeout(10_000),
  });

  serverAvailable = healthResponse.ok;

  logResult(serverAvailable, "Chat API health check");
} catch {
  console.error(
    "Chat API is unavailable. Start it with: node --env-file=.env api/server.mjs",
  );
}

if (serverAvailable) {
  for (let index = 0; index < factCases.length; index++) {
    const test = factCases[index];

    // Stay below the API's 10 requests/minute limit.
    if (index > 0) {
      await delay(7000);
    }

    try {
      const data = await askChat(test.message);
      const answer = data.answer;

      const answerMatches = test.expected.test(answer);
      const forbiddenFound = test.forbidden?.test(answer) ?? false;

      const projectMatches = test.expectedProject
        ? data.sources?.some(
            (source) =>
              source.project?.toLowerCase() === test.expectedProject ||
              source.id?.toLowerCase().includes(test.expectedProject),
          ) ?? false
        : true;

      const passed =
        answerMatches && !forbiddenFound && projectMatches;

      if (passed) factsPassed++;

      logResult(
        passed,
        test.name,
        `answer: ${answerMatches}, source: ${projectMatches}, forbidden: ${forbiddenFound}`,
      );

      if (URL_PATTERN.test(answer)) {
        urlFree = false;
        logResult(false, `${test.name}: no URL in answer`);
      }
    } catch (error) {
      logResult(false, test.name, error.message);
    }
  }
} else {
  console.log("Live answer tests skipped because the API is unavailable.");
}

// 4. Off-topic refusal evaluation
console.log("\nOFF-TOPIC REFUSAL EVALUATION");
console.log("============================");

let refusalsPassed = 0;
const refusalCases = [
  "What's the capital of France?",
  "Explain quantum physics.",
  "What is Ahtesham's favourite food?",
];

if (serverAvailable) {
  for (let index = 0; index < refusalCases.length; index++) {
    if (index > 0) {
      await delay(7000);
    }

    try {
      const data = await askChat(refusalCases[index]);
      const answer = data.answer;

      const declined =
        /couldn't find enough relevant information|not covered|not in.*portfolio|outside.*portfolio|don't have.*information|cannot answer|can't answer/i.test(
          answer,
        );

      if (declined) refusalsPassed++;

      logResult(declined, refusalCases[index]);

      if (URL_PATTERN.test(answer)) {
        urlFree = false;
        logResult(false, "Refusal answer contains no URL");
      }
    } catch (error) {
      logResult(false, refusalCases[index], error.message);
    }
  }
}

// 5. Evaluation summary
const factsScore =
  factCases.length > 0
    ? (factsPassed / factCases.length) * 100
    : 0;

const refusalScore =
  refusalCases.length > 0
    ? (refusalsPassed / refusalCases.length) * 100
    : 0;

const validationPassed = validation.valid;

console.log("\nPHASE 3 EVALUATION SUMMARY");
console.log("==========================");
console.log(
  `CodeLens pattern count: ${CODELENS_PATTERN_COUNT} (read from projects.ts)`,
);
console.log(
  `Recall@5: ${recall.toFixed(1)}% (${retrievalHits}/${retrievalCases.length})`,
);
console.log(
  `Facts: ${factsScore.toFixed(1)}% (${factsPassed}/${factCases.length})`,
);
console.log(
  `Refusals: ${refusalScore.toFixed(1)}% (${refusalsPassed}/${refusalCases.length})`,
);
console.log(`Zero URLs: ${urlFree ? "PASS" : "FAIL"}`);
console.log(`Knowledge validation: ${validationPassed ? "PASS" : "FAIL"}`);
console.log(`Live API: ${serverAvailable ? "PASS" : "FAIL"}`);

const passed =
  validationPassed &&
  recall >= 90 &&
  factsScore >= 90 &&
  refusalScore === 100 &&
  urlFree &&
  serverAvailable;

console.log(`\nOVERALL: ${passed ? "PASS" : "FAIL"}`);

if (!passed) {
  process.exitCode = 1;
}
