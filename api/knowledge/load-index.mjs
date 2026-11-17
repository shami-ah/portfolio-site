
import { allChunks } from "./all-chunks.mjs";
import { embedTexts } from "./embeddings.mjs";

const BATCH_SIZE = 20;
const MAX_INITIALIZATION_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

let embeddingIndex = {
  provider: null,
  model: null,
  dimensions: null,
  chunks: [],
  embeddings: [],
};

let initializationPromise = null;

export let embeddingIndexReady = false;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function initializeEmbeddingIndex({
  provider = "nvidia",
  apiKey,
  baseUrl,
  model,
} = {}) {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    embeddingIndexReady = false;

    if (!apiKey) {
      console.warn("Embedding API key missing. Using BM25 retrieval.");
      return embeddingIndex;
    }

    if (!allChunks.length) {
      console.warn("Knowledge base contains no chunks. Using BM25 retrieval.");
      return embeddingIndex;
    }

    for (
      let attempt = 1;
      attempt <= MAX_INITIALIZATION_ATTEMPTS;
      attempt++
    ) {
      const records = [];

      console.log(
        `Embedding initialization attempt ${attempt}/${MAX_INITIALIZATION_ATTEMPTS}`,
      );
      console.log(`Embedding provider: ${provider}`);
      console.log(`Embedding model: ${model}`);
      console.log(`Generating embeddings for ${allChunks.length} chunks...`);

      try {
        for (let start = 0; start < allChunks.length; start += BATCH_SIZE) {
          const batch = allChunks.slice(start, start + BATCH_SIZE);

          console.log(
            `Embedding chunks ${start + 1}-${start + batch.length} of ${allChunks.length}`,
          );

          const vectors = await embedTexts(
            batch.map((chunk) => chunk.text),
            {
              provider,
              apiKey,
              baseUrl,
              model,
              taskType: "RETRIEVAL_DOCUMENT",
              inputType: "passage",
            },
          );

          if (vectors.length !== batch.length) {
            throw new Error("Embedding count does not match batch size.");
          }

          batch.forEach((chunk, index) => {
            const vector = vectors[index];

            if (
              !Array.isArray(vector) ||
              vector.length === 0 ||
              !vector.every(Number.isFinite)
            ) {
              throw new Error(
                `Invalid embedding vector for chunk: ${chunk.id}`,
              );
            }

            records.push({
              chunk,
              embedding: vector,
            });
          });
        }

        const dimensions = records[0]?.embedding.length;

        if (
          !dimensions ||
          records.length !== allChunks.length ||
          records.some((record) => record.embedding.length !== dimensions)
        ) {
          throw new Error("Embedding vectors have inconsistent dimensions.");
        }

        embeddingIndex = {
          provider,
          model,
          dimensions,
          chunks: records.map((record) => record.chunk),
          embeddings: records.map((record) => record.embedding),
        };

        embeddingIndexReady = true;

        console.log("In-memory embedding index initialized successfully.");
        console.log(`Provider: ${provider}`);
        console.log(`Model: ${model}`);
        console.log(`Dimensions: ${dimensions}`);
        console.log(`Indexed chunks: ${embeddingIndex.chunks.length}`);

        return embeddingIndex;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        console.error(
          `Embedding initialization attempt ${attempt} failed:`,
          errorMessage,
        );

        // Do not retry when the provider's quota is exhausted.
        const quotaExhausted =
          errorMessage.includes("RESOURCE_EXHAUSTED") ||
          /quota exceeded|daily.*limit exceeded/i.test(errorMessage);

        if (quotaExhausted) {
          console.error(
            "Embedding quota exhausted. Stopping retries and using BM25 retrieval.",
          );
          break;
        }

        if (attempt < MAX_INITIALIZATION_ATTEMPTS) {
          console.log(
            `Retrying embedding initialization in ${RETRY_DELAY_MS}ms...`,
          );
          await delay(RETRY_DELAY_MS);
        }
      }
    } // Closes the for loop

    embeddingIndex = {
      provider: null,
      model: null,
      dimensions: null,
      chunks: [],
      embeddings: [],
    };

    embeddingIndexReady = false;

    console.error(
      "Embedding initialization unsuccessful. Using BM25 retrieval.",
    );

    return embeddingIndex;
  })();

  try {
    return await initializationPromise;
  } finally {
    if (!embeddingIndexReady) {
      initializationPromise = null;
    }
  }
}

export function loadEmbeddingIndex() {
  return embeddingIndex;
}
