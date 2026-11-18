import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { allChunks } from "./all-chunks.mjs";
import { embedTexts } from "./embeddings.mjs";

const BATCH_SIZE = 20;
/** Tries per batch. A slow provider usually recovers within a few seconds. */
const BATCH_ATTEMPTS = 4;
const BATCH_BACKOFF_MS = [2_000, 5_000, 10_000];
/** After a failed build, try again in the background instead of staying on BM25 until a restart. */
const REBUILD_INTERVAL_MS = 5 * 60_000;

/**
 * Optional on-disk cache of chunk embeddings, keyed by provider + model + chunk text.
 * Restarts then only embed chunks that changed. Unset = no cache (memory only).
 */
const CACHE_PATH = process.env.EMBEDDING_CACHE_PATH || null;

const EMPTY_INDEX = Object.freeze({
  provider: null,
  model: null,
  dimensions: null,
  chunks: [],
  embeddings: [],
});

let embeddingIndex = EMPTY_INDEX;
let initializationPromise = null;
let rebuildTimer = null;

export let embeddingIndexReady = false;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cacheKey(provider, model, text) {
  return createHash("sha256").update(`${provider}\n${model}\n${text}`).digest("hex");
}

async function readCache() {
  if (!CACHE_PATH) return new Map();
  try {
    const parsed = JSON.parse(await readFile(CACHE_PATH, "utf8"));
    return new Map(Object.entries(parsed));
  } catch {
    return new Map();
  }
}

async function writeCache(cache) {
  if (!CACHE_PATH) return;
  try {
    await mkdir(dirname(CACHE_PATH), { recursive: true });
    const tmp = `${CACHE_PATH}.tmp`;
    await writeFile(tmp, JSON.stringify(Object.fromEntries(cache)));
    await rename(tmp, CACHE_PATH);
  } catch (error) {
    console.error(
      "Could not write embedding cache:",
      error instanceof Error ? error.message : error,
    );
  }
}

function isValidVector(vector) {
  return Array.isArray(vector) && vector.length > 0 && vector.every(Number.isFinite);
}

function isQuotaError(message) {
  return message.includes("RESOURCE_EXHAUSTED") || /quota exceeded|daily.*limit exceeded/i.test(message);
}

async function embedBatchWithRetry(texts, options, label) {
  for (let attempt = 1; ; attempt++) {
    try {
      const vectors = await embedTexts(texts, options);
      if (vectors.length !== texts.length || !vectors.every(isValidVector)) {
        throw new Error("Embedding provider returned an invalid batch.");
      }
      return vectors;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (attempt >= BATCH_ATTEMPTS || isQuotaError(message)) throw error;
      const wait = BATCH_BACKOFF_MS[Math.min(attempt - 1, BATCH_BACKOFF_MS.length - 1)];
      console.warn(`Embedding ${label} failed (${message}); retry ${attempt}/${BATCH_ATTEMPTS - 1} in ${wait}ms`);
      await delay(wait);
    }
  }
}

async function buildIndex({ provider, apiKey, baseUrl, model }) {
  const cache = await readCache();
  const keys = allChunks.map((chunk) => cacheKey(provider, model, chunk.text));
  const missing = allChunks
    .map((chunk, index) => ({ chunk, key: keys[index] }))
    .filter(({ key }) => !isValidVector(cache.get(key)));

  console.log(
    `Embedding index: ${allChunks.length} chunks, ${allChunks.length - missing.length} cached, ${missing.length} to embed (${provider} / ${model})`,
  );

  try {
    for (let start = 0; start < missing.length; start += BATCH_SIZE) {
      const batch = missing.slice(start, start + BATCH_SIZE);
      const label = `chunks ${start + 1}-${start + batch.length} of ${missing.length}`;
      const vectors = await embedBatchWithRetry(
        batch.map(({ chunk }) => chunk.text),
        { provider, apiKey, baseUrl, model, taskType: "RETRIEVAL_DOCUMENT", inputType: "passage" },
        label,
      );
      batch.forEach(({ key }, i) => cache.set(key, vectors[i]));
    }
  } finally {
    // Keep finished batches even when a later one fails, so the next attempt resumes.
    if (missing.length) await writeCache(pruneCache(cache, keys));
  }

  const embeddings = keys.map((key) => cache.get(key));
  const dimensions = embeddings[0]?.length;
  if (!dimensions || embeddings.some((vector) => vector?.length !== dimensions)) {
    throw new Error("Embedding vectors have inconsistent dimensions.");
  }

  return { provider, model, dimensions, chunks: [...allChunks], embeddings };
}

/** Drop vectors for chunks that no longer exist so the cache does not grow forever. */
function pruneCache(cache, liveKeys) {
  const live = new Set(liveKeys);
  return new Map([...cache].filter(([key]) => live.has(key)));
}

function scheduleRebuild(config) {
  if (rebuildTimer) return;
  rebuildTimer = setTimeout(() => {
    rebuildTimer = null;
    void initializeEmbeddingIndex(config);
  }, REBUILD_INTERVAL_MS);
  rebuildTimer.unref?.();
}

/**
 * Builds the in-memory embedding index. Never throws: on failure retrieval stays on BM25
 * and another build is scheduled in the background.
 */
export async function initializeEmbeddingIndex({ provider = "nvidia", apiKey, baseUrl, model } = {}) {
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    if (!apiKey) {
      console.warn("Embedding API key missing. Using BM25 retrieval.");
      return embeddingIndex;
    }
    if (!allChunks.length) {
      console.warn("Knowledge base contains no chunks. Using BM25 retrieval.");
      return embeddingIndex;
    }

    const config = { provider, apiKey, baseUrl, model };
    try {
      embeddingIndex = await buildIndex(config);
      embeddingIndexReady = true;
      console.log(
        `Embedding index ready: ${embeddingIndex.chunks.length} chunks, ${embeddingIndex.dimensions} dimensions (${provider} / ${model})`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Embedding index build failed: ${message}. Using BM25 retrieval.`);
      if (!embeddingIndexReady) {
        embeddingIndex = EMPTY_INDEX;
        if (!isQuotaError(message)) {
          console.log(`Retrying the embedding index in ${REBUILD_INTERVAL_MS / 60_000} minutes.`);
          scheduleRebuild(config);
        }
      }
    }
    return embeddingIndex;
  })();

  try {
    return await initializationPromise;
  } finally {
    initializationPromise = null;
  }
}

export function loadEmbeddingIndex() {
  return embeddingIndex;
}
