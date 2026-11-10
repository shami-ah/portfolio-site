
import { knowledgeChunks } from "./chunks.mjs";
import { careerChunks } from "./career-chunks.mjs";
import { articleChunks } from "./article-chunks.mjs";

export const allChunks = [
  ...knowledgeChunks,
  ...careerChunks,
  ...articleChunks,
];
