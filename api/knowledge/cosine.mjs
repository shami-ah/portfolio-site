
export function cosineSimilarity(vectorA, vectorB) {
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
    throw new Error("Both inputs must be arrays.");
  }

  if (
    vectorA.length === 0 ||
    vectorA.length !== vectorB.length
  ) {
    throw new Error("Vectors must have the same non-zero length.");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    const a = vectorA[i];
    const b = vectorB[i];

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      throw new Error("Vectors must contain only finite numbers.");
    }

    dotProduct += a * b;
    magnitudeA += a * a;
    magnitudeB += b * b;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (
    Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB)
  );
}
