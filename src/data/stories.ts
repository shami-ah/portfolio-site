import type { EmojiMood } from "@/components/agent-visuals";

/**
 * Plain-lens storytelling copy. Every number here is taken from projects.ts
 * (impact, results, measuredImpact) or from the client quotes in the footer.
 * Do not add a figure that is not already recorded there.
 */

export interface FlagshipStory {
  /** The one claim a non-technical reader should remember. */
  headline: string;
  /** Who the product is for, in their words. */
  audience: string;
  /** Jargon-free captions for the measuredImpact values in projects.ts. */
  beforeContext: string;
  afterContext: string;
  /** What the agent says next to the before/after figure. */
  narration: { mood: EmojiMood; text: string };
  quote?: { text: string; name: string; role: string };
}

export const FLAGSHIP_STORIES: Record<string, FlagshipStory> = {
  openevent: {
    headline: "Event teams got 75 minutes of their day back.",
    audience: "For event companies buried in booking emails",
    beforeContext: "per team, every day, reading and sorting booking emails",
    afterContext: "to check what the AI prepared and press approve",
    narration: {
      mood: "proud",
      text: "He built the entire AI side of this. 100+ companies started using it in 8 months, with no sales team.",
    },
    quote: {
      text: "The AI layer saves our team 90 minutes a day. No engineer designed the human-in-the-loop gate the way he did.",
      name: "River Soellner",
      role: "Founder, More Life Hospitality",
    },
  },
  codelens: {
    headline: "It catches in one second what tired reviewers miss.",
    audience: "For software teams shipping under pressure",
    beforeContext: "of what a paid AI reviewer caught, when I first compared them",
    afterContext: "after I studied every miss and closed all 12 gaps",
    narration: {
      mood: "curious",
      text: "He measured his own tool against a paid competitor, found where it lost, and fixed every gap.",
    },
  },
  "gogaa-cli": {
    headline: "When an AI service goes down, the work doesn't.",
    audience: "For developers who rely on AI every day",
    beforeContext: "of the AI's actions worked on the first try",
    afterContext: "work now, after I rebuilt how it reads AI replies",
    narration: {
      mood: "surprised",
      text: "1,400+ automatic checks run before every release. He does not ship without them.",
    },
  },
  rasad: {
    headline: "It found AI work costing 18x more than it needed to.",
    audience: "For teams paying for AI coding tools",
    beforeContext: "insight into what AI tools actually did, or what they cost",
    afterContext: "AI work sessions replayed step by step and graded A to F",
    narration: {
      mood: "default",
      text: "He built this to see inside his own AI tools. Everything stays on your computer.",
    },
  },
};

export interface CareerChapter {
  period: string;
  title: string;
  company: string;
  /** The biggest result of the role, stated as a plain outcome. */
  headline: string;
  points: string[];
}

export function getCareerChapters(oe: { clients: number; events: number }): CareerChapter[] {
  return [
    {
      period: "Sep 2025 to now",
      title: "Lead AI Developer",
      company: "More Life Hospitality GmbH",
      headline: `Took an AI product to ${oe.clients}+ active clients.`,
      points: [
        `I own the product roadmap and delivery for OpenEvent, now used across ${oe.events}+ events.`,
        "I built the whole AI side myself, from reading emails to sending invoices.",
      ],
    },
    {
      period: "2022 to 2024",
      title: "Director of IT & R&D",
      company: "Rouelite Techno Pvt. Ltd.",
      headline: "Cut a 14-day project cycle down to 5 days.",
      points: [
        "Led a team of 6 engineers and shipped a release every quarter.",
        "Brought AI into daily operations and cut manual data entry by 70%.",
        "Designed the company's customer system from scratch.",
      ],
    },
    {
      period: "2023 to now",
      title: "Co-Founder & AI Engineer",
      company: "Wadware House",
      headline: "Runs an AI automation agency for clients worldwide.",
      points: [
        "I find the clients, scope the work, and deliver it end to end.",
      ],
    },
  ];
}
