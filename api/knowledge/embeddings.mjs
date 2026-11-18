
const DEFAULT_NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const DEFAULT_NVIDIA_MODEL = "nvidia/nemotron-3-embed-1b";

const DEFAULT_GEMINI_MODEL = "gemini-embedding-001";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

/** Document batches at startup can be slow on a cold provider; visitor queries must fail fast to BM25. */
const DOCUMENT_TIMEOUT_MS = Number(process.env.EMBEDDING_TIMEOUT_MS) || 30_000;
const QUERY_TIMEOUT_MS = Number(process.env.EMBEDDING_QUERY_TIMEOUT_MS) || 8_000;

function validateTexts(texts) {
  if (!Array.isArray(texts) || texts.length === 0) {
    return false;
  }

  if (texts.some((text) => typeof text !== "string" || !text.trim())) {
    throw new Error("Every embedding input must be a non-empty string.");
  }

  return true;
}

async function embedWithNvidia(texts, { apiKey, baseUrl, model, inputType, timeoutMs }) {
  const response = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: texts,
      input_type: inputType,
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    throw new Error(`NVIDIA embedding request failed (${response.status})`);
  }

  const result = await response.json();

  if (!Array.isArray(result.data) || result.data.length !== texts.length) {
    throw new Error("NVIDIA returned an unexpected embedding response.");
  }

  const sortedData = [...result.data].sort((a, b) => a.index - b.index);

  return sortedData.map((item) => {
    if (
      !Array.isArray(item.embedding) ||
      item.embedding.length === 0 ||
      !item.embedding.every(Number.isFinite)
    ) {
      throw new Error("NVIDIA returned an invalid embedding vector.");
    }

    return item.embedding;
  });
}

async function embedWithGemini(texts, { apiKey, model, taskType, timeoutMs }) {
  const response = await fetch(
    `${GEMINI_BASE_URL}/models/${model}:batchEmbedContents`,
    {
      method: "POST",
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        requests: texts.map((text) => ({
          model: `models/${model}`,
          content: {
            parts: [{ text }],
          },
          taskType,
        })),
      }),
    },
  );

  if (!response.ok) {
    // Status only: provider error bodies can echo request details.
    throw new Error(`Gemini embedding request failed (${response.status})`);
  }

  const result = await response.json();

  if (
    !Array.isArray(result.embeddings) ||
    result.embeddings.length !== texts.length
  ) {
    throw new Error("Gemini returned an unexpected embedding response.");
  }

  return result.embeddings.map((item) => {
    if (
      !Array.isArray(item.values) ||
      item.values.length === 0 ||
      !item.values.every(Number.isFinite)
    ) {
      throw new Error("Gemini returned an invalid embedding vector.");
    }

    return item.values;
  });
}

export async function embedTexts(
  texts,
  {
    provider = "nvidia",
    apiKey,
    baseUrl = DEFAULT_NVIDIA_BASE_URL,
    model,
    taskType = "RETRIEVAL_DOCUMENT",
    inputType = "passage",
    timeoutMs = DOCUMENT_TIMEOUT_MS,
  } = {},
) {
  if (!validateTexts(texts)) {
    return [];
  }

  if (!apiKey) {
    throw new Error(`${provider} API key is not configured.`);
  }

  if (provider === "gemini") {
    return embedWithGemini(texts, {
      apiKey,
      model: model || DEFAULT_GEMINI_MODEL,
      taskType,
      timeoutMs,
    });
  }

  if (provider === "nvidia") {
    return embedWithNvidia(texts, {
      apiKey,
      baseUrl,
      model: model || DEFAULT_NVIDIA_MODEL,
      inputType,
      timeoutMs,
    });
  }

  throw new Error(`Unsupported embedding provider: ${provider}`);
}

export async function embedQuery(query, options = {}) {
  const vectors = await embedTexts([query], {
    ...options,
    taskType: "RETRIEVAL_QUERY",
    inputType: "query",
    timeoutMs: options.timeoutMs ?? QUERY_TIMEOUT_MS,
  });

  return vectors[0];
}
