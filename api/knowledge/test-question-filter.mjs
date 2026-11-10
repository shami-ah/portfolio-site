
import { classifyPortfolioQuestion } from "./question-filter.mjs";

const testCases = [
  {
    question: "How does OpenEvent work?",
    expected: true,
  },
  {
    question: "Does Ahtesham use Docker?",
    expected: true,
  },
  {
    question: "What are his React skills?",
    expected: true,
  },
  {
    question: "What does WISC stand for?",
    expected: true,
  },
  {
    question: "Who won the FIFA World Cup?",
    expected: false,
  },
  {
    question: "What is the capital of Japan?",
    expected: false,
  },
  {
    question: "How do I cook chicken biryani?",
    expected: false,
  },
  {
    question: "What is Docker?",
    expected: false,
  },
];

let passed = 0;

console.log("\nPortfolio Question Filter Tests");
console.log("--------------------------------");

for (const test of testCases) {
  const result = classifyPortfolioQuestion(test.question);
  const success = result.isRelated === test.expected;

  if (success) passed++;

  console.log(
    `${success ? "PASS" : "FAIL"} | ${test.question} | Expected: ${test.expected} | Received: ${result.isRelated} | Reason: ${result.reason}`
  );
}

console.log("\nTest summary:");
console.log(`Passed: ${passed}/${testCases.length}`);
console.log(`Failed: ${testCases.length - passed}/${testCases.length}`);
