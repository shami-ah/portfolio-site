
import { loadEmbeddingIndex } from "./load-index.mjs";

const index = loadEmbeddingIndex();

console.log("Embedding model:", index.model);
console.log("Loaded chunks:", index.chunks.length);
console.log("Loaded embeddings:", index.embeddings.length);
console.log("Index loader is working.");
