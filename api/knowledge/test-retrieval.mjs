
import { allChunks } from "./all-chunks.mjs";
import { retrieveBM25 } from "./bm25.mjs";

const testCases = [
  {
    question: "How does OpenEvent save time?",
    expected: "openevent-client-feedback",
  },
  {
    question: "What security checks does CodeLens perform?",
    expected: "codelens-technical",
  },
  {
    question: "How many AI providers does Gogaa support?",
    expected: "gogaa-overview",
  },
  {
    question: "Does Rasad send data outside the machine?",
    expected: "article-rasad-observatory",
  },
  {
    question: "What does the AI Agent Orchestrator do?",
    expected: "orchestrator-overview",
  },
  {
    question: "Where did Ahtesham work as Director of IT and R&D?",
    expected: "career-leadership",
  },
  {
    question: "How many engineers did he lead at Rouelite Techno?",
    expected: "career-leadership",
  },
  {
    question: "What are the five JSON parsing strategies used in Gogaa?",
    expected: "article-gogaa-json-parser",
  },
  {
    question: "Why does OpenEvent require human approval?",
    expected: "openevent-technical",
  },
  {
    question: "What does WISC stand for?",
    expected: "article-wisc-definition",
  },
  {
    question: "How did CodeLens improve its benchmark coverage?",
    expected: "codelens-impact",
  },
  {
    question: "How does Rasad protect user privacy?",
    expected: "rasad-story",
  },
];

let passed = 0;
let failed = 0;

console.log("BM25 RETRIEVAL EVALUATION");
console.log("=========================");

for (const test of testCases) {
  const results = retrieveBM25(
    test.question,
    allChunks,
    { topK: 3 }
  );

  const topResult = results[0];

  const isPassed = topResult?.id === test.expected;

  if (isPassed) {
    passed++;
  } else {
    failed++;
  }

  console.log("\nQuestion:", test.question);

  for (const result of results) {
    console.log(
      `- ${result.id} | Score: ${result.score}`
    );
  }

  console.log(
    `${isPassed ? "PASS" : "FAIL"} | Expected: ${test.expected} | Actual: ${topResult?.id ?? "No result"}`
  );
}

console.log("\n=========================");
console.log("EVALUATION SUMMARY");
console.log(`Total tests: ${testCases.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(
  `Accuracy: ${((passed / testCases.length) * 100).toFixed(2)}%`
);

if (failed > 0) {
  process.exitCode = 1;
}
