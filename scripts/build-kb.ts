
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

function splitText(text: string): string[] {
  const normalized = cleanText(text);
  if (!normalized) return [];

  const parts: string[] = [];
  let remaining = normalized;

  while (remaining.length > MAX_CHUNK_SIZE) {
    let splitAt = remaining.lastIndexOf(" ", TARGET_CHUNK_SIZE);

    if (splitAt < 300) {
      splitAt = TARGET_CHUNK_SIZE;
    }

    parts.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining) parts.push(remaining);

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
  const text = flatten(source).join("\n");
  const parts = splitText(text);

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
    text: part,
  }));
}

function generateProfileChunks(): KnowledgeChunk[] {
  return Object.values(profile).map((section) =>
    makeChunk(
      section.id,
      "profile",
      section.category,
      section.tags,
      {
        title: section.title,
        content: section.content,
      },
    ),
  );
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
  return articles.map((article) =>
    makeChunk(
      `article-${article.slug}`,
      "writing",
      "article",
      ["article", "writing", article.slug, article.title],
      article,
    ),
  );
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
