
import { allChunks } from "./all-chunks.mjs";

const ids = new Set();
const duplicateIds = [];
const invalidChunks = [];

for (const chunk of allChunks) {
  if (ids.has(chunk.id)) {
    duplicateIds.push(chunk.id);
  }

  ids.add(chunk.id);

  if (
    !chunk.id ||
    !chunk.category ||
    typeof chunk.text !== "string" ||
    !chunk.text.trim()
  ) {
    invalidChunks.push(chunk.id ?? "Unknown chunk");
  }
}

console.log("Total knowledge chunks:", allChunks.length);
console.log("Duplicate IDs:", duplicateIds.length);
console.log("Invalid chunks:", invalidChunks.length);

if (duplicateIds.length || invalidChunks.length) {
  console.error("Knowledge base validation failed.");
  process.exitCode = 1;
} else {
  console.log("Knowledge base validation passed.");
}
