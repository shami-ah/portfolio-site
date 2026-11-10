
const K1 = 1.5;
const B = 0.75;

const STOP_WORDS = new Set([
  "the", "is", "a", "an", "and", "or", "but",
  "what", "how", "does", "do", "did", "where",
  "when", "why", "who", "which", "to", "of",
  "in", "on", "at", "for", "from", "with",
  "about", "he", "she", "it", "his", "her",
  "they", "them", "this", "that", "can"
]);

function tokenize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9+#.-]/g, " ")
    .split(/\s+/)
    .filter(
      (word) => word.length > 1 && !STOP_WORDS.has(word)
    );
}

function createDocument(chunk) {
  return [
    chunk.project,
    chunk.category,
    ...(chunk.tags ?? []),
    chunk.text,
  ].join(" ");
}

export function retrieveBM25(query, chunks, options = {}) {
  const topK = options.topK ?? 5;

  if (!query?.trim() || !Array.isArray(chunks) || chunks.length === 0) {
    return [];
  }

  const queryTerms = [...new Set(tokenize(query))];

  if (queryTerms.length === 0) {
    return [];
  }

  const documents = chunks.map((chunk) => {
    const tokens = tokenize(createDocument(chunk));
    const frequencies = new Map();

    for (const token of tokens) {
      frequencies.set(token, (frequencies.get(token) ?? 0) + 1);
    }

    return {
      chunk,
      tokens,
      frequencies,
      length: tokens.length,
    };
  });

  const totalDocuments = documents.length;

  const averageLength =
    documents.reduce((sum, doc) => sum + doc.length, 0) /
    totalDocuments;

  const documentFrequency = new Map();

  for (const term of queryTerms) {
    let count = 0;

    for (const doc of documents) {
      if (doc.frequencies.has(term)) {
        count++;
      }
    }

    documentFrequency.set(term, count);
  }

  const results = documents.map((doc) => {
    let score = 0;

    for (const term of queryTerms) {
      const frequency = doc.frequencies.get(term) ?? 0;

      if (frequency === 0) continue;

      const df = documentFrequency.get(term) ?? 0;

      const inverseDocumentFrequency = Math.log(
        1 + (totalDocuments - df + 0.5) / (df + 0.5)
      );

      const lengthNormalization =
        K1 *
        (1 - B + B * (doc.length / (averageLength || 1)));

      const termScore =
        inverseDocumentFrequency *
        ((frequency * (K1 + 1)) / (frequency + lengthNormalization));

      score += termScore;
    }

    const matchedTerms = queryTerms.filter((term) =>
  doc.frequencies.has(term)
);

return {
  ...doc.chunk,
  score: Number(score.toFixed(4)),
  matchedTerms,
  matchedTermCount: matchedTerms.length,
  queryTermCount: queryTerms.length,
  keywordCoverage: Number(
    (matchedTerms.length / queryTerms.length).toFixed(4)
  ),
};
  });

  return results
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
