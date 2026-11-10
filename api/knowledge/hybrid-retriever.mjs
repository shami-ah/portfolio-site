
import { retrieveBM25 } from "./bm25.mjs";
import { cosineSimilarity } from "./cosine.mjs";

export function retrieveHybrid(
  query,
  chunks,
  queryEmbedding,
  chunkEmbeddings,
  options = {}
) {
  const topK = options.topK ?? 5;
  const keywordWeight = options.keywordWeight ?? 0.4;
  const semanticWeight = options.semanticWeight ?? 0.6;

  // Validate the query and knowledge chunks.
  if (
    typeof query !== "string" ||
    !query.trim() ||
    !Array.isArray(chunks) ||
    chunks.length === 0
  ) {
    return [];
  }

  if (!Number.isInteger(topK) || topK < 1) {
    throw new Error("topK must be a positive integer.");
  }

  // Validate retrieval weights.
  if (
    !Number.isFinite(keywordWeight) ||
    !Number.isFinite(semanticWeight) ||
    keywordWeight < 0 ||
    semanticWeight < 0 ||
    keywordWeight + semanticWeight === 0
  ) {
    throw new Error("Invalid retrieval weights.");
  }

  // Validate query and document embeddings.
  if (
    !Array.isArray(queryEmbedding) ||
    queryEmbedding.length === 0 ||
    !queryEmbedding.every(Number.isFinite) ||
    !Array.isArray(chunkEmbeddings) ||
    chunkEmbeddings.length !== chunks.length
  ) {
    throw new Error("Query or chunk embeddings are missing or invalid.");
  }

  for (const embedding of chunkEmbeddings) {
    if (
      !Array.isArray(embedding) ||
      embedding.length !== queryEmbedding.length ||
      !embedding.every(Number.isFinite)
    ) {
      throw new Error("Embedding dimensions are inconsistent.");
    }
  }

  // Retrieve keyword matches using BM25.
  const keywordResults = retrieveBM25(query, chunks, {
    topK: chunks.length,
  });

  // Use actual query-term coverage instead of relative BM25 normalization.
  const keywordScores = new Map(
    keywordResults.map((item) => [
      item.id,
      item.keywordCoverage ?? 0,
    ])
  );

  // Combine keyword and semantic retrieval scores.
  const results = chunks.map((chunk, index) => {
    const keywordScore = keywordScores.get(chunk.id) ?? 0;

    const semanticScore = Math.max(
      0,
      cosineSimilarity(queryEmbedding, chunkEmbeddings[index])
    );

    const combinedScore =
      (
        keywordWeight * keywordScore +
        semanticWeight * semanticScore
      ) / (keywordWeight + semanticWeight);

    return {
      ...chunk,
      keywordScore: Number(keywordScore.toFixed(4)),
      semanticScore: Number(semanticScore.toFixed(4)),
      score: Number(combinedScore.toFixed(4)),
    };
  });

  // Sort by combined relevance and return the best matches.
  return results
    .filter(
      (item) =>
        item.keywordScore > 0 ||
        item.semanticScore > 0
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
