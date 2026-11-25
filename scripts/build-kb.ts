
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { profile } from "../src/data/profile";
import { projects } from "../src/data/projects";
import {
  FLAGSHIP_STORIES,
  getCareerChapters,
} from "../src/data/stories";
import { articles } from "../src/data/writing";

interface KnowledgeChunk {
  id: string;
  project: string;
  category: string;
  tags: string[];
  text: string;
}

const TARGET_CHUNK_SIZE = 600;
const MAX_CHUNK_SIZE = 800;

function cleanText(value: string): string {
  return value
    .replace(/https?:\/\/[^\s]+|www\.[^\s]+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function flatten(value: unknown, prefix = ""): string[] {
  if (value === null || value === undefined) return [];

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    const text = cleanText(String(value));
    return text ? [`${prefix ? `${prefix}: ` : ""}${text}`] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      flatten(item, prefix ? `${prefix} ${index + 1}` : ""),
    );
  }

  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      flatten(item, prefix ? `${prefix} ${key}` : key),
    );
  }

  return [];
}



function splitText(text: string, maxSize = MAX_CHUNK_SIZE): string[] {
  const normalized = cleanText(text);
  if (!normalized) return [];

  // Split at sentence boundaries without breaking decimals or URLs.
  const sentences = normalized.split(/(?<=[.!?])\s+/);

  const parts: string[] = [];
  let current = "";

  for (const rawSentence of sentences) {
    const sentence = rawSentence.trim();
    if (!sentence) continue;

    if (sentence.length > maxSize) {
      throw new Error(
        `Sentence exceeds ${maxSize} characters. Actual length: ${sentence.length}. Preview: "${sentence.slice(0, 250)}"`,
      );
    }

    const candidate = current
      ? `${current} ${sentence}`
      : sentence;

    if (candidate.length > maxSize) {
      if (current) parts.push(current);
      current = sentence;
    } else {
      current = candidate;
    }
  }

  if (current) parts.push(current);

  return parts;
}



/**
 * Pack short items into chunks of roughly TARGET_CHUNK_SIZE characters
 * (never above maxSize), keeping each item whole where it fits.
 */
function packItems(items: string[], maxSize = MAX_CHUNK_SIZE): string[] {
  const target = Math.min(TARGET_CHUNK_SIZE, maxSize);
  const pieces = items.flatMap((item) => splitText(item, maxSize));
  const parts: string[] = [];
  let current = "";

  for (const piece of pieces) {
    const candidate = current ? `${current}\n${piece}` : piece;

    if (current && candidate.length > target) {
      parts.push(current);
      current = piece;
    } else {
      current = candidate;
    }
  }

  if (current) parts.push(current);

  return parts;
}

function makeChunk(
  id: string,
  project: string,
  category: string,
  tags: string[],
  source: unknown,
): KnowledgeChunk {
  return {
    id,
    project,
    category,
    tags,
    text: flatten(source).join("\n"),
  };
}
function makeSectionChunks(
  project: (typeof projects)[number],
  section: string,
  source: unknown,
): KnowledgeChunk[] {
  // Every chunk names its project and section, so a chunk read on its own
  // (BM25, embeddings, the LLM context) still says what it is about.
  const prefix = `${cleanText(project.title)} · ${section}: `;

  // Pack related fields together. One chunk per field produced hundreds of
  // fragments such as "CodeLens · summary: title: CodeLens" that matched the
  // project name and crowded the real summary out of the top results.
  const parts = packItems(flatten(source), MAX_CHUNK_SIZE - prefix.length);

  return parts.map((part, index) => ({
    id: `project-${project.slug}-${section}${parts.length > 1 ? `-${index + 1}` : ""}`,
    project: project.slug,
    category: "project",
    tags: [
      project.slug,
      project.title,
      project.type,
      section,
    ],
    text: `${prefix}${part}`,
  }));
}


function generateProfileChunks(): KnowledgeChunk[] {
  return Object.values(profile).flatMap((section) => {
    const title = cleanText(section.title);
    const prefix = `${title}: `;
    const availableSize = MAX_CHUNK_SIZE - prefix.length;

    const parts = packItems(flatten(section.content), availableSize);

    return parts.map((part, index) => ({
      id: `${section.id}${parts.length > 1 ? `-${index + 1}` : ""}`,
      project: "profile",
      category: section.category,
      tags: [...section.tags, title],
      text: `${prefix}${part}`,
    }));
  });
}


function generateProjectChunks(): KnowledgeChunk[] {
  return projects.flatMap((project) => {
    const summary = {
      title: project.title,
      subtitle: project.subtitle,
      oneLiner: project.oneLiner,
      cardSummary: project.cardSummary,
      plainSummary: project.plainSummary,
      impact: project.impact,
      problem: project.problem,
      solution: project.solution,
    };

    const architecture = {
      architecture: project.architecture,
      features: project.features,
      stack: project.stack,
    };

    const decisions = {
      techDecisions: project.techDecisions,
      decision: project.decision,
      comparison: project.vs,
    };

    const results = {
      results: project.results,
      measuredImpact: project.measuredImpact,
    };

    return [
      ...makeSectionChunks(project, "summary", summary),
      ...makeSectionChunks(project, "architecture", architecture),
      ...makeSectionChunks(project, "decisions", decisions),
      ...makeSectionChunks(project, "results", results),
    ];
  });
}

function generateStoryChunks(): KnowledgeChunk[] {
  return Object.entries(FLAGSHIP_STORIES).map(([slug, story]) =>
    makeChunk(
      `story-${slug}`,
      slug,
      "story",
      [slug, "story", "case study"],
      story,
    ),
  );
}

function extractMetric(
  source: unknown,
  pattern: RegExp,
  label: string,
): number {
  const text = JSON.stringify(source);
  const match = text.match(pattern);

  if (!match?.[1]) {
    throw new Error(
      `Could not find the OpenEvent ${label} value in projects.ts.`,
    );
  }

  return Number(match[1].replace(/,/g, ""));
}

function generateCareerChunks(): KnowledgeChunk[] {
  const openEvent = projects.find(
    (project) => project.slug === "openevent",
  );

  if (!openEvent) {
    throw new Error("OpenEvent project was not found in projects.ts.");
  }

  const clients = extractMetric(
    openEvent,
    /(\d[\d,]*)\+?\s*clients/i,
    "clients",
  );

  const events = extractMetric(
    openEvent,
    /(\d[\d,]*)\+?\s*events/i,
    "events",
  );

  const chapters = getCareerChapters({ clients, events });

  return chapters.map((chapter) =>
    makeChunk(
      `career-${slugify(`${chapter.company}-${chapter.title}`)}`,
      "career",
      "career",
      ["career", "experience", chapter.company, chapter.title],
      chapter,
    ),
  );
}



function generateArticleChunks(): KnowledgeChunk[] {
  return articles.flatMap((article) => {
    const title = cleanText(article.title);

    if (!title) {
      throw new Error(
        `Article "${article.slug}" is missing its title.`,
      );
    }

    const prefix = `${title}: `;
    const availableSize = MAX_CHUNK_SIZE - prefix.length;

    if (availableSize <= 0) {
      throw new Error(`Article title is too long: ${title}`);
    }

    // Summary on its own, then each body section packed with its heading,
    // so a heading never becomes a chunk with no content under it.
    const articleParts = [
      ...packItems(flatten({ summary: article.summary }), availableSize),
      ...article.body.flatMap((section, sectionIndex) => {
        const label = `Section ${sectionIndex + 1}${
          section.heading ? ` (${cleanText(section.heading)})` : ""
        }: `;

        return packItems(
          section.paragraphs,
          availableSize - label.length,
        ).map((part) => `${label}${part}`);
      }),
    ];

    return articleParts.map((part, index) => ({
      id: `article-${article.slug}-${index + 1}`,
      project: "writing",
      category: "article",
      tags: ["article", "writing", article.slug, title],
      text: `${prefix}${part}`,
    }));
  });
}



async function buildKnowledgeBase(): Promise<void> {
  const chunks: KnowledgeChunk[] = [
    ...generateProfileChunks(),
    ...generateProjectChunks(),
    ...generateStoryChunks(),
    ...generateCareerChunks(),
    ...generateArticleChunks(),
  ];

  if (chunks.length === 0) {
    throw new Error("Knowledge-base generation produced no chunks.");
  }

  for (const project of projects) {
    const projectChunks = chunks.filter(
      (chunk) => chunk.project === project.slug,
    );

    if (projectChunks.length === 0) {
      throw new Error(
        `Project "${project.slug}" produced zero knowledge chunks.`,
      );
    }

    for (const section of ["summary", "architecture", "decisions", "results"]) {
      if (!projectChunks.some((chunk) => chunk.tags.includes(section))) {
        throw new Error(
          `Project "${project.slug}" is missing its ${section} section.`,
        );
      }
    }
  }

  const ids = chunks.map((chunk) => chunk.id);

  if (new Set(ids).size !== ids.length) {
    throw new Error("Duplicate knowledge chunk IDs detected.");
  }

  if (chunks.some((chunk) => !chunk.text.trim())) {
    throw new Error("A generated knowledge chunk has empty text.");
  }

  const outputDirectory = path.join(
    process.cwd(),
    "api",
    "knowledge",
  );

  const outputFile = path.join(
    outputDirectory,
    "generated-chunks.mjs",
  );

  await mkdir(outputDirectory, { recursive: true });

  const output = `// Generated by scripts/build-kb.ts. Do not edit manually.\n\nexport const generatedChunks = ${JSON.stringify(
    chunks,
    null,
    2,
  )};\n`;

  await writeFile(outputFile, output, "utf8");

  console.log("Knowledge base generated successfully.");
  console.log(`Projects: ${projects.length}`);
  console.log(`Total chunks: ${chunks.length}`);
  console.log(
    `Project chunks: ${chunks.filter((chunk) => chunk.category === "project").length}`,
  );
  console.log(
    `Project chunks over ${MAX_CHUNK_SIZE} characters: ${
      chunks.filter(
        (chunk) =>
          chunk.category === "project" &&
          chunk.text.length > MAX_CHUNK_SIZE,
      ).length
    }`,
  );
  console.log(`Output: ${outputFile}`);
}

buildKnowledgeBase().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
