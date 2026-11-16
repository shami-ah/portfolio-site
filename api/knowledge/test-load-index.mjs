
import { initializeEmbeddingIndex, loadEmbeddingIndex } from "./load-index.mjs";

const provider = process.env.EMBEDDING_PROVIDER ?? "nvidia";

const apiKey =
  provider === "gemini"
    ? process.env.GEMINI_API_KEY
    : process.env.NVIDIA_API_KEY;

const model =
  provider === "gemini"
    ? process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001"
    : process.env.NVIDIA_EMBED_MODEL ?? "nvidia/nemotron-3.5-embed-1b";

const baseUrl =
  process.env.NVIDIA_BASE_URL ??
  "https://integrate.api.nvidia.com/v1";

async function testIndex() {
  await initializeEmbeddingIndex({
    provider,
    apiKey,
    baseUrl,
    model,
  });

  const index = loadEmbeddingIndex();

  console.log("\nIn-memory index test:");
  console.log("Embedding provider:", index.provider);
  console.log("Embedding model:", index.model);
  console.log("Dimensions:", index.dimensions);
  console.log("Loaded chunks:", index.chunks.length);
  console.log("Loaded embeddings:", index.embeddings.length);

  if (
    index.chunks.length === 0 ||
    index.chunks.length !== index.embeddings.length
  ) {
    throw new Error("In-memory embedding index test failed.");
  }

  console.log("\nIn-memory index test passed.");
}

testIndex().catch((error) => {
  console.error("Index test failed:", error.message);
  process.exitCode = 1;
});
