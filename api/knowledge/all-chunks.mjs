
import { knowledgeChunks } from "./chunks.mjs";
import { careerChunks } from "./career-chunks.mjs";
import { articleChunks } from "./article-chunks.mjs";
import { profileChunks } from "./profile-chunks.mjs";

export const allChunks = [
  ...knowledgeChunks,
  ...careerChunks,
  ...articleChunks,
  ...profileChunks,
];
