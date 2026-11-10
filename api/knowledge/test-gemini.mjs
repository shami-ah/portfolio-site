
import { embedTexts } from "./embeddings.mjs";

const apiKey = process.env.GEMINI_API_KEY;

async function testGemini() {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from .env");
  }

  const vectors = await embedTexts(
    ["How does OpenEvent save time for its users?"],
    {
      provider: "gemini",
      apiKey,
      model: process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001",
      taskType: "RETRIEVAL_DOCUMENT",
    },
  );

  console.log("Gemini embedding test successful!");
  console.log("Vector count:", vectors.length);
  console.log("Vector dimensions:", vectors[0].length);
  console.log("First 5 values:", vectors[0].slice(0, 5));
}

testGemini().catch((error) => {
  console.error("Gemini test failed:", error.message);
  process.exitCode = 1;
});
