import type { StorySkeleton } from "@/types";

/**
 * Fractions story skeletons — 6 canonical beats, required models, forbidden patterns.
 */
export const FRACTIONS_SKELETONS: StorySkeleton[] = [
  {
    conceptId: "frac-part-whole",
    beats: [
      { type: "setup", description: "Introduce a fair-sharing scenario in the student's chosen setting.", slots: ["place", "sidekick", "mood"] },
      { type: "groupsIntro", description: "Discover something that needs to be split into equal parts.", slots: ["nouns"] },
      { type: "representation", description: "Draw the whole divided into equal parts and shade the fraction.", slots: [] },
      { type: "reasoning", description: "Explain what numerator and denominator mean — equal parts are the key.", slots: [] },
      { type: "generalize", description: "Show that the same fraction can look different (different shapes, same parts).", slots: [] },
      { type: "reflection", description: "Summarize: fractions name equal parts of a whole.", slots: ["mood"] },
    ],
    requiredModels: ["model-area-fractions", "model-number-line-frac"],
    forbiddenPatterns: [
      "pure mnemonic with no model or reasoning",
      "pie chart without equal parts discussion",
    ],
  },
  {
    conceptId: "frac-decimal-connection",
    beats: [
      { type: "setup", description: "Introduce a measurement scenario requiring precise values.", slots: ["place", "sidekick", "mood"] },
      { type: "groupsIntro", description: "Discover that some amounts fall between whole numbers.", slots: ["nouns"] },
      { type: "representation", description: "Shade a hundredths grid and write the amount as both a fraction and decimal.", slots: [] },
      { type: "reasoning", description: "Explain why decimals and fractions are the same idea — place value is key.", slots: [] },
      { type: "generalize", description: "Convert several fractions to decimals and back to prove the connection.", slots: [] },
      { type: "reflection", description: "Summarize: decimals and fractions are two languages for the same number.", slots: ["mood"] },
    ],
    requiredModels: ["model-hundredths-grid", "model-number-line-decimal"],
    forbiddenPatterns: [
      "pure mnemonic with no model or reasoning",
      "decimal rules without visual proof",
    ],
  },
];
