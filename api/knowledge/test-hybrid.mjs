
import { allChunks } from "./all-chunks.mjs";
import { retrieveHybrid } from "./hybrid-retriever.mjs";

// Temporary sample vectors for testing only.
const sampleEmbeddings = allChunks.map((_, index) => [
  index === 0 ? 1 : 0,
  index === 1 ? 1 : 0,
  index === 2 ? 1 : 0,
]);

const queryEmbedding = [1, 0, 0];

const results = retrieveHybrid(
  "How does OpenEvent save time?",
  allChunks,
  queryEmbedding,
  sampleEmbeddings,
  { topK: 3 }
);

console.log("Hybrid retrieval results:");

for (const result of results) {
  console.log(
    `${result.id} | Combined: ${result.score} | BM25: ${result.keywordScore} | Semantic: ${result.semanticScore}`
  );
}
