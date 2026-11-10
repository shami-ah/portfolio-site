
import { writeFile } from "node:fs/promises";

import { allChunks } from "./all-chunks.mjs";
import { embedTexts } from "./embeddings.mjs";

const provider = process.env.EMBEDDING_PROVIDER ?? "nvidia";

const apiKey =
  provider === "gemini"
    ? process.env.GEMINI_API_KEY
    : process.env.NVIDIA_API_KEY;

const model =
  provider === "gemini"
    ? process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001"
    : process.env.NVIDIA_EMBED_MODEL ??
      "nvidia/nemotron-3.5-embed-1b";

const baseUrl = process.env.NVIDIA_BASE_URL;

const BATCH_SIZE = 20;

async function buildIndex() {
  if (!apiKey) {
    throw new Error(
      `${provider.toUpperCase()} API key is missing. Check your root .env file.`,
    );
  }

  if (!allChunks.length) {
    throw new Error("Knowledge base contains no chunks.");
  }

  const records = [];

  console.log(`Provider: ${provider}`);
  console.log(`Embedding model: ${model}`);
  console.log(`Building embeddings for ${allChunks.length} chunks...`);

  for (
    let start = 0;
    start < allChunks.length;
    start += BATCH_SIZE
  ) {
    const batch = allChunks.slice(start, start + BATCH_SIZE);

    console.log(
      `Processing ${start + 1}-${start + batch.length} of ${allChunks.length}`,
    );

    const vectors = await embedTexts(
      batch.map((chunk) => chunk.text),
      {
        provider,
        apiKey,
        baseUrl,
        model,
        taskType: "RETRIEVAL_DOCUMENT",
      },
    );

    if (vectors.length !== batch.length) {
      throw new Error("Embedding count does not match batch size.");
    }

    batch.forEach((chunk, index) => {
      records.push({
        id: chunk.id,
        embedding: vectors[index],
      });
    });
  }

  const dimensions = records[0]?.embedding?.length;

  if (
    !dimensions ||
    records.some((record) => record.embedding.length !== dimensions)
  ) {
    throw new Error("Embedding vectors have inconsistent dimensions.");
  }

  const fileContent = `
export const embeddingProvider = ${JSON.stringify(provider)};

export const embeddingModel = ${JSON.stringify(model)};

export const embeddingDimensions = ${dimensions};

export const chunkEmbeddings = ${JSON.stringify(records, null, 2)};
`;

  const outputPath = new URL("./index.mjs", import.meta.url);

  await writeFile(outputPath, fileContent.trimStart(), "utf8");

  console.log("Embedding index created successfully.");
  console.log(`Provider: ${provider}`);
  console.log(`Model: ${model}`);
  console.log(`Vector dimensions: ${dimensions}`);
  console.log(`Total indexed chunks: ${records.length}`);
}

buildIndex().catch((error) => {
  console.error("Index building failed:", error.message);
  process.exitCode = 1;
});
