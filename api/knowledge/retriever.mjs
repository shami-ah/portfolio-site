
import { allChunks } from "./all-chunks.mjs";
import { retrieveBM25 } from "./bm25.mjs";
import { embedQuery } from "./embeddings.mjs";
import { retrieveHybrid } from "./hybrid-retriever.mjs";
import { loadEmbeddingIndex } from "./load-index.mjs";

/**
 * @param {string} query
 * @param {{
 *   provider?: string,
 *   apiKey?: string,
 *   baseUrl?: string,
 *   model?: string,
 *   topK?: number
 *  currentProject?: string
 * }} options
 */
export async function retrieveKnowledge(
  query,
  {
    provider,
    apiKey,
    baseUrl = "https://integrate.api.nvidia.com/v1",
    topK,
    currentProject = "",
  } = {},
) {
  if (typeof query !== "string" || !query.trim()) {
    return {
      mode: "bm25",
      results: [],
    };
  }

  const index = loadEmbeddingIndex();

  if (
    index.chunks.length === 0 ||
    index.embeddings.length !== index.chunks.length ||
    !apiKey
  ) {
    return {
      mode: "bm25",
      results: retrieveBM25(query, allChunks, { topK }),
    };
  }

  if (provider && index.provider && provider !== index.provider) {
    console.warn(
      `Embedding provider mismatch: index uses ${index.provider}, request uses ${provider}. Falling back to BM25.`,
    );

    return {
      mode: "bm25",
      results: retrieveBM25(query, allChunks, { topK }),
    };
  }

  if (!index.model) {
    return {
      mode: "bm25",
      results: retrieveBM25(query, allChunks, { topK }),
    };
  }

  try {
    const queryEmbedding = await embedQuery(query, {
      provider: index.provider,
      apiKey,
      baseUrl,
      model: index.model,
      inputType: "query",
    });

    if (
      !Array.isArray(queryEmbedding) ||
      queryEmbedding.length !== index.dimensions
    ) {
      throw new Error(
        `Query embedding dimension mismatch. Expected ${index.dimensions}, received ${queryEmbedding?.length ?? 0}.`,
      );
    }

    const vectors = new Map(
      index.chunks.map((chunk, i) => [chunk.id, index.embeddings[i]]),
    );

    return {
      mode: "hybrid",
      results: retrieveHybrid(
        query,
        allChunks,
        queryEmbedding,
        allChunks.map((chunk) => vectors.get(chunk.id) ?? null),
        { topK, currentProject },
      ),
    };
  } catch (error) {
    console.error(
      "Hybrid retrieval failed. Falling back to BM25:",
      error instanceof Error ? error.message : error,
    );

    return {
      mode: "bm25",
      results: retrieveBM25(query, allChunks, { topK }),
    };
  }
}
