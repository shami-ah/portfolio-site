
import { validateChunks } from "./validate.mjs";

const result = validateChunks();

console.log("Knowledge Base Validation");
console.log("------------------------");
console.log("Valid:", result.valid);
console.log("Total chunks:", result.totalChunks);
console.log("Unique IDs:", result.uniqueIds);

if (result.errors.length > 0) {
  console.log("\nValidation errors:");

  for (const error of result.errors) {
    console.log("-", error);
  }
} else {
  console.log("\nAll knowledge chunks passed validation.");
}
