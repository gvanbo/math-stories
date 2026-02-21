import { describe, it, expect } from "vitest";
import { constructStory } from "@/layers/story/tools/constructStory";
import { validateOutput } from "@/validation/validateOutput";
import { MULTIPLICATION_CONCEPTS } from "@/layers/concept/data/concepts";
import type { UserProfile, UserInputs } from "@/types";

/**
 * Core.md Section 3 + Section 5 — Generate 5 stories and validate all through Integrity Validator.
 * Exit criteria: 100% pass rate.
 */

const profiles: UserProfile[] = [
  { id: "student-1", preferences: {}, readingLevel: "grade4", humorLevel: "high", modalityPrefs: ["visual"] },
  { id: "student-2", preferences: {}, readingLevel: "grade3", humorLevel: "low", modalityPrefs: ["kinesthetic"] },
  { id: "student-3", preferences: { theme: "ocean" }, readingLevel: "grade4", humorLevel: "medium", modalityPrefs: ["auditory"] },
  { id: "student-4", preferences: {}, readingLevel: "grade5", humorLevel: "high", modalityPrefs: ["visual", "kinesthetic"] },
  { id: "student-5", preferences: { theme: "forest" }, readingLevel: "grade4", humorLevel: "medium", modalityPrefs: ["visual"] },
];

const inputSets: UserInputs[] = [
  { verbs: ["zoomed", "launched"], nouns: ["rocket", "asteroid"], place: "a space station", mood: "excited", sidekick: "a robot dog" },
  { verbs: ["dug", "discovered"], nouns: ["treasure", "map"], place: "a pirate island", mood: "brave", sidekick: "a talking parrot" },
  { verbs: ["swam", "dove"], nouns: ["shell", "pearl"], place: "an underwater reef", mood: "curious", sidekick: "a baby whale" },
  { verbs: ["climbed", "explored"], nouns: ["crystal", "cave"], place: "a mountain peak", mood: "determined", sidekick: "a friendly dragon" },
  { verbs: ["flew", "soared"], nouns: ["cloud", "rainbow"], place: "a sky kingdom", mood: "joyful", sidekick: "a magic owl" },
];

const conceptPairs = [
  { conceptId: "mult-equal-groups", outcomeCode: "4.N.3" },
  { conceptId: "mult-equal-groups", outcomeCode: "4.N.3" },
  { conceptId: "mult-mental-strategies", outcomeCode: "4.N.5" },
  { conceptId: "mult-equal-groups", outcomeCode: "4.N.3" },
  { conceptId: "mult-mental-strategies", outcomeCode: "4.N.5" },
];

describe("Story Validation — 5 complete stories × Integrity Validator", () => {
  for (let i = 0; i < 5; i++) {
    it(`Story ${i + 1}: ${inputSets[i].place} with ${inputSets[i].sidekick} — passes all integrity rules`, () => {
      const story = constructStory(
        conceptPairs[i].conceptId,
        conceptPairs[i].outcomeCode,
        profiles[i],
        inputSets[i],
      );

      expect(story).not.toBeNull();

      // Self-check should pass
      expect(story!.selfCheck.passes).toBe(true);

      // Run through the Integrity Validator
      const concept = MULTIPLICATION_CONCEPTS.find(
        (c) => c.id === conceptPairs[i].conceptId,
      )!;

      const validation = validateOutput("story", story!.context, {
        outcomeCodes: [conceptPairs[i].outcomeCode],
        concept,
      });

      expect(validation.valid).toBe(true);
      expect(validation.violations.length).toBe(0);
    });
  }
});
