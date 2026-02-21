import type { StorySkeleton } from "@/types";

/**
 * Division story skeletons — 6 canonical beats, required models, forbidden patterns.
 */
export const DIVISION_SKELETONS: StorySkeleton[] = [
  {
    conceptId: "div-equal-sharing",
    beats: [
      { type: "setup", description: "Introduce a sharing problem in the student's chosen setting.", slots: ["place", "sidekick", "mood"] },
      { type: "groupsIntro", description: "Discover items that need to be shared equally among groups.", slots: ["nouns"] },
      { type: "representation", description: "Draw groups and deal items one-by-one to find equal shares.", slots: [] },
      { type: "reasoning", description: "Explain why equal sharing gives the same answer as division — connect to multiplication.", slots: [] },
      { type: "generalize", description: "Try sharing different totals to see the pattern holds.", slots: [] },
      { type: "reflection", description: "Summarize: division finds how many in each group when sharing equally.", slots: ["mood"] },
    ],
    requiredModels: ["model-equal-sharing", "model-array-division"],
    forbiddenPatterns: [
      "pure mnemonic with no model or reasoning",
      "long division algorithm without conceptual understanding",
    ],
  },
  {
    conceptId: "div-fact-relationship",
    beats: [
      { type: "setup", description: "Introduce a mystery where knowing one fact unlocks others.", slots: ["place", "sidekick", "mood"] },
      { type: "groupsIntro", description: "Discover a multiplication fact and wonder: what division facts hide inside?", slots: ["nouns"] },
      { type: "representation", description: "Build an array and read it as both multiplication and division.", slots: [] },
      { type: "reasoning", description: "Explain why × and ÷ are inverse operations — the array proves it.", slots: [] },
      { type: "generalize", description: "Test with other fact families to confirm the pattern.", slots: [] },
      { type: "reflection", description: "Summarize: one array, four facts — multiplication and division are partners.", slots: ["mood"] },
    ],
    requiredModels: ["model-fact-triangle"],
    forbiddenPatterns: [
      "pure mnemonic with no model or reasoning",
      "memorize without understanding inverse relationship",
    ],
  },
];
