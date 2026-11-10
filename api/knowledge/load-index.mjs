
import {
  chunkEmbeddings,
  embeddingModel,
  embeddingProvider,
  embeddingDimensions,
} from "./index.mjs";

import { allChunks } from "./all-chunks.mjs";

export function loadEmbeddingIndex() {
  const chunkMap = new Map(
    allChunks.map((chunk) => [chunk.id, chunk]),
  );

  const indexedChunks = [];
  const embeddings = [];

  for (const record of chunkEmbeddings) {
    const chunk = chunkMap.get(record.id);

    if (!chunk) {
      console.warn(`Unknown chunk in embedding index: ${record.id}`);
      continue;
    }

    if (
      !Array.isArray(record.embedding) ||
      record.embedding.length === 0 ||
      !record.embedding.every(Number.isFinite)
    ) {
      console.warn(`Invalid embedding for chunk: ${record.id}`);
      continue;
    }

    if (
      embeddingDimensions &&
      record.embedding.length !== embeddingDimensions
    ) {
      console.warn(`Incorrect embedding dimensions for chunk: ${record.id}`);
      continue;
    }

    indexedChunks.push(chunk);
    embeddings.push(record.embedding);
  }

  return {
    provider: embeddingProvider ?? null,
    model: embeddingModel,
    dimensions: embeddingDimensions ?? embeddings[0]?.length ?? null,
    chunks: indexedChunks,
    embeddings,
  };
}
