import { allChunks } from "./api/knowledge/all-chunks.mjs";

const ids = [
  "project-openevent",
  "project-gogaa-cli",
  "project-agent-orchestrator",
  "career-2",
  "profile-stack"
];

for (const chunk of allChunks) {
  if (ids.includes(chunk.id) || /https?:\/\/|www\./i.test(chunk.text)) {
    console.log("\n--- " + chunk.id + " ---");
    console.log(chunk.text);
  }
}
