const key = process.env.GEMINI_API_KEY;

const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: "Say hello in one sentence." }
          ]
        }
      ]
    })
  }
);

const data = await response.json();

console.log("Status:", response.status);
console.log("Gemini:", data.candidates?.[0]?.content?.parts?.[0]?.text || data.error?.message);