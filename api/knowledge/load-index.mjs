
import { allChunks } from "./all-chunks.mjs";
import { embedTexts } from "./embeddings.mjs";

const BATCH_SIZE = 20;

let embeddingIndex = {
  provider: null,
  model: null,
  dimensions: null,
  chunks: [],
  embeddings: [],
};

let initializationPromise = null;

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
    if (!apiKey) {
      console.warn("Embedding API key missing. Using BM25 retrieval.");
      return embeddingIndex;
    }

    if (!allChunks.length) {
      console.warn("Knowledge base contains no chunks. Using BM25 retrieval.");
      return embeddingIndex;
    }

    const records = [];

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
            throw new Error(`Invalid embedding vector for chunk: ${chunk.id}`);
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

      console.log("In-memory embedding index initialized successfully.");
      console.log(`Provider: ${provider}`);
      console.log(`Model: ${model}`);
      console.log(`Dimensions: ${dimensions}`);
      console.log(`Indexed chunks: ${embeddingIndex.chunks.length}`);

      return embeddingIndex;
    } catch (error) {
      console.error(
        "Embedding initialization failed. Using BM25 retrieval:",
        error instanceof Error ? error.message : error,
      );

      embeddingIndex = {
        provider: null,
        model: null,
        dimensions: null,
        chunks: [],
        embeddings: [],
      };

      return embeddingIndex;
    }
  })();

  return initializationPromise;
}

export function loadEmbeddingIndex() {
  return embeddingIndex;
}
