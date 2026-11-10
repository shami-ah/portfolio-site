
import { allChunks } from "./all-chunks.mjs";

export function validateChunks(chunks = allChunks) {
  const errors = [];
  const seenIds = new Set();

  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new Error("Knowledge base must contain at least one chunk.");
  }

  for (const [index, chunk] of chunks.entries()) {
    const location = `Chunk ${index + 1}`;

    if (!chunk || typeof chunk !== "object") {
      errors.push(`${location}: Invalid chunk object.`);
      continue;
    }

    if (typeof chunk.id !== "string" || !chunk.id.trim()) {
      errors.push(`${location}: Missing or invalid ID.`);
    } else if (seenIds.has(chunk.id)) {
      errors.push(`${location}: Duplicate ID "${chunk.id}".`);
    } else {
      seenIds.add(chunk.id);
    }

    if (typeof chunk.text !== "string" || !chunk.text.trim()) {
      errors.push(`${location}: Missing or empty text.`);
    }

    if (typeof chunk.category !== "string" || !chunk.category.trim()) {
      errors.push(`${location}: Missing category.`);
    }

    if (
      chunk.tags !== undefined &&
      (!Array.isArray(chunk.tags) ||
        !chunk.tags.every(
          (tag) => typeof tag === "string" && tag.trim()
        ))
    ) {
      errors.push(`${location}: Invalid tags.`);
    }
  }

  return {
    valid: errors.length === 0,
    totalChunks: chunks.length,
    uniqueIds: seenIds.size,
    errors,
  };
}
