
import { retrieveKnowledge } from "./retriever.mjs";
import { retrieveBM25 } from "./bm25.mjs";
import { allChunks } from "./all-chunks.mjs";

const provider = process.env.EMBEDDING_PROVIDER ?? "gemini";

const apiKey =
  provider === "gemini"
    ? process.env.GEMINI_API_KEY
    : process.env.NVIDIA_API_KEY;

const model =
  provider === "gemini"
    ? process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001"
    : process.env.NVIDIA_EMBED_MODEL ?? "nvidia/nemotron-3.5-embed-1b";

const questions = [
  "How does OpenEvent save time?",
  "What security checks does CodeLens perform?",
  "What does WISC stand for?",
  "How does Rasad protect user privacy?",
  "What technologies does Ahtesham specialize in?",
  "Who won the 2022 FIFA World Cup?",
  "What is the capital of Japan?",
  "How do I cook chicken biryani?",
];

async function testRetrieval() {
  if (!apiKey) {
    throw new Error(`${provider} API key is missing.`);
  }

  console.log("Embedding provider:", provider);
  console.log("Embedding model:", model);

  for (const question of questions) {
    console.log("\nQuestion:", question);

    const keywordResults = retrieveBM25(question, allChunks, {
      topK: 3,
    });

    console.log("Raw BM25 scores:");

    for (const result of keywordResults) {
      console.log(
        `- ${result.id} | BM25: ${result.score} | Coverage: ${result.keywordCoverage} | Matched: ${result.matchedTerms?.join(", ") ?? "not available"}`
      );
    }

    const response = await retrieveKnowledge(question, {
      provider,
      apiKey,
      model,
      topK: 3,
    });

    console.log("Retrieval mode:", response.mode);

    for (const result of response.results) {
      console.log(
        `- ${result.id} | Combined: ${result.score} | Keyword: ${result.keywordScore} | Semantic: ${result.semanticScore}`
      );
    }
  }
}

testRetrieval().catch((error) => {
  console.error("Retrieval test failed:", error.message);
  process.exitCode = 1;
});
