
const PORTFOLIO_REFERENCES =
  /\b(ahtesham|portfolio|openevent|open event|codelens|code lens|gogaa|rasad|wisc|command center|gluten[- ]free|portable dev|orchestrator)\b/i;

const CAREER_REFERENCES =
  /\b(my|his|your|ahtesham's)\s+(skills?|experience|career|background|work|projects?|education|achievements?|expertise|tech stack|services|rates|availability)\b/i;

const PORTFOLIO_INTENTS =
  /\b(what does (he|ahtesham|you) do|tell me about (him|ahtesham)|show me (his|your) work|what has (he|ahtesham) built|why should i hire|hire him|work with him|work together|book a call|contact him|contact you|how much do you charge|are you available for work|freelance availability)\b/i;

const TECHNOLOGIES =
  /\b(python|django|fastapi|javascript|typescript|react|next\.js|node\.js|docker|mysql|postgresql|sqlite|redis|supabase|openai|gemini|claude|anthropic|nvidia|tailwind|html|css|rest api|api|ai agents|machine learning|llm|rag|pgvector|github|cloudflare)\b/i;

const TECHNOLOGY_RELATION =
  /\b(ahtesham|he|his|you|your)\b/i;

// Project comparisons and technical evaluation questions.
const PROJECT_COMPARISON_INTENTS =
  /\b(compare|comparison|differences?|different|versus|vs\.?|better|best suited|more suitable|which project|what project|why|pros and cons)\b/i;

const PROJECT_EVALUATION_TOPICS =
  /\b(offline|privacy|private|data security|security|secure|data storage|local data|local storage|outbound requests|internet connection|network requests|architecture|tech stack|technology stack|performance|scalability|features|integrations)\b/i;

export function classifyPortfolioQuestion(question = "") {
  if (typeof question !== "string" || !question.trim()) {
    return {
      isRelated: false,
      reason: "empty_question",
    };
  }

  const normalized = question
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  // Explicit portfolio, person, or project reference.
  if (PORTFOLIO_REFERENCES.test(normalized)) {
    return {
      isRelated: true,
      reason: "portfolio_reference",
    };
  }

  // Questions about Ahtesham's career and professional profile.
  if (CAREER_REFERENCES.test(normalized)) {
    return {
      isRelated: true,
      reason: "career_reference",
    };
  }

  // Hiring, services, collaboration, and contact questions.
  if (PORTFOLIO_INTENTS.test(normalized)) {
    return {
      isRelated: true,
      reason: "portfolio_intent",
    };
  }

  // Technology questions connected to Ahtesham.
  if (
    TECHNOLOGIES.test(normalized) &&
    TECHNOLOGY_RELATION.test(normalized)
  ) {
    return {
      isRelated: true,
      reason: "portfolio_technology",
    };
  }

  // Comparisons and evaluations of projects in the portfolio.
  // Supports contextual questions such as:
  // "Which project is better suited for users who require complete offline privacy, and why?"
  if (
    /\b(project|projects)\b/i.test(normalized) &&
    PROJECT_COMPARISON_INTENTS.test(normalized) &&
    PROJECT_EVALUATION_TOPICS.test(normalized)
  ) {
    return {
      isRelated: true,
      reason: "project_comparison",
    };
  }

  return {
    isRelated: false,
    reason: "outside_portfolio_scope",
  };
}
