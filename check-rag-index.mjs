import { allChunks } from "./api/knowledge/all-chunks.mjs";
import {
  chunkEmbeddings,
  embeddingProvider,
  embeddingModel,
  embeddingDimensions
} from "./api/knowledge/index.mjs";

const chunkIds = new Set(allChunks.map(x => x.id));
const embeddingIds = chunkEmbeddings.map(x => x.id);
const embeddingIdSet = new Set(embeddingIds);
const dimensions = [...new Set(chunkEmbeddings.map(x => x.embedding?.length))];

console.log({
  provider: embeddingProvider,
  model: embeddingModel,
  declaredDimensions: embeddingDimensions,
  totalChunks: allChunks.length,
  totalEmbeddings: chunkEmbeddings.length,
  uniqueEmbeddingIds: embeddingIdSet.size,
  chunksWithoutEmbeddings: allChunks.filter(x => !embeddingIdSet.has(x.id)).length,
  embeddingsWithoutChunks: chunkEmbeddings.filter(x => !chunkIds.has(x.id)).length,
  duplicateEmbeddingIds: embeddingIds.length - embeddingIdSet.size,
  actualVectorDimensions: dimensions
});

console.log("Unknown embedding IDs:",
  chunkEmbeddings.filter(x => !chunkIds.has(x.id)).map(x => x.id).slice(0, 15)
);

console.log("Chunks missing embeddings:",
  allChunks.filter(x => !embeddingIdSet.has(x.id)).map(x => x.id).slice(0, 15)
);
