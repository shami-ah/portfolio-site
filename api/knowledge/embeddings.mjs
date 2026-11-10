
const DEFAULT_NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const DEFAULT_NVIDIA_MODEL = "nvidia/nemotron-3.5-embed-1b";

const DEFAULT_GEMINI_MODEL = "gemini-embedding-001";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

function validateTexts(texts) {
  if (!Array.isArray(texts) || texts.length === 0) {
    return false;
  }

  if (texts.some((text) => typeof text !== "string" || !text.trim())) {
    throw new Error("Every embedding input must be a non-empty string.");
  }

  return true;
}

async function embedWithNvidia(
  texts,
  { apiKey, baseUrl, model },
) {
  const response = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: texts,
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    throw new Error(
      `NVIDIA embedding request failed (${response.status}): ${await response.text()}`,
    );
  }

  const result = await response.json();

  if (!Array.isArray(result.data) || result.data.length !== texts.length) {
    throw new Error("NVIDIA returned an unexpected embedding response.");
  }

  const sortedData = [...result.data].sort(
    (a, b) => a.index - b.index,
  );

  return sortedData.map((item) => {
    if (!Array.isArray(item.embedding) || item.embedding.length === 0) {
      throw new Error("NVIDIA returned an invalid embedding vector.");
    }

    return item.embedding;
  });
}

async function embedWithGemini(
  texts,
  { apiKey, model, taskType },
) {
  const response = await fetch(
    `${GEMINI_BASE_URL}/models/${model}:batchEmbedContents?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    throw new Error(
      `Gemini embedding request failed (${response.status}): ${await response.text()}`,
    );
  }

  const result = await response.json();

  if (
    !Array.isArray(result.embeddings) ||
    result.embeddings.length !== texts.length
  ) {
    throw new Error("Gemini returned an unexpected embedding response.");
  }

  return result.embeddings.map((item) => {
    if (!Array.isArray(item.values) || item.values.length === 0) {
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
      model: model ?? DEFAULT_GEMINI_MODEL,
      taskType,
    });
  }

  if (provider === "nvidia") {
    return embedWithNvidia(texts, {
      apiKey,
      baseUrl,
      model: model ?? DEFAULT_NVIDIA_MODEL,
    });
  }

  throw new Error(`Unsupported embedding provider: ${provider}`);
}

export async function embedQuery(query, options = {}) {
  const vectors = await embedTexts([query], {
    ...options,
    taskType: "RETRIEVAL_QUERY",
  });

  return vectors[0];
}
