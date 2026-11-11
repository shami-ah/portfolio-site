
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
 * }} options
 */
export async function retrieveKnowledge(
  query,
  {
    provider,
    apiKey,
    baseUrl = "https://integrate.api.nvidia.com/v1",
    model,
    topK = 5,
  } = {},
) {
  if (typeof query !== "string" || !query.trim()) {
    return {
      mode: "bm25",
      results: [],
    };
  }

  const index = loadEmbeddingIndex();

  // Use BM25 if real embeddings are not available.
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

  // Always use the provider and model that created the stored vectors.
  const indexProvider = index.provider ?? provider ?? "nvidia";
  const indexModel = index.model ?? model;

  if (provider && index.provider && provider !== index.provider) {
    console.warn(
      `Embedding provider mismatch: index uses ${index.provider}, request uses ${provider}. Falling back to BM25.`,
    );

    return {
      mode: "bm25",
      results: retrieveBM25(query, allChunks, { topK }),
    };
  }

  if (!indexModel) {
    return {
      mode: "bm25",
      results: retrieveBM25(query, allChunks, { topK }),
    };
  }

  try {
    const queryEmbedding = await embedQuery(query, {
      provider: indexProvider,
      apiKey,
      baseUrl,
      model: indexModel,
    });

    if (
      !Array.isArray(queryEmbedding) ||
      queryEmbedding.length !== index.dimensions
    ) {
      throw new Error(
        `Query embedding dimension mismatch. Expected ${index.dimensions}, received ${queryEmbedding?.length ?? 0}.`,
      );
    }

    // Every chunk takes part: chunks added after the last build-index run have no
    // vector yet and compete on keywords only until the index is rebuilt.
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
        { topK },
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
