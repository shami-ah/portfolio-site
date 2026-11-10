
import {
  buildContextualMessage,
  classifyQuestion,
  shouldSuggestBooking,
} from "../chat-context.mjs";

const history = [
  {
    role: "user",
    content: "Tell me about CodeLens.",
  },
  {
    role: "assistant",
    content: "CodeLens is a code security analysis project.",
  },
];

console.log("Test 1: Follow-up question");

console.log(
  buildContextualMessage("What security checks does it perform?", history)
);

console.log("\nTest 2: Project classification");

console.log(classifyQuestion("Tell me about CodeLens"));

console.log("\nTest 3: Booking detection");

console.log("Project question:", shouldSuggestBooking("Tell me about OpenEvent"));

console.log("Hiring question:", shouldSuggestBooking("Can I hire Ahtesham?"));
