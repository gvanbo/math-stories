import { describe, it, expect } from "vitest";
import { findOutcomesForQuery } from "@/layers/curriculum/tools/findOutcomesForQuery";
import { getConceptForOutcome } from "@/layers/concept/tools/getConceptForOutcome";
import { getPedagogyForConcept } from "@/layers/pedagogy/tools/getPedagogyForConcept";
import { getStorySkeleton } from "@/layers/story/tools/getStorySkeleton";
import { getDigitCharacters } from "@/layers/characters/tools/getDigitCharacters";
import { buildStoryContext } from "@/layers/story/tools/buildStoryContext";
import { planLesson } from "@/layers/pedagogy/tools/planLesson";
import { recordFeedback, getUserProfile } from "@/layers/personalization/tools/feedback";
import type { UserInputs } from "@/types";

/**
 * Integration test: Full call chain from Core.md Section 4
 *
 * Student query → findOutcomes → getConcept → getPedagogy → getSkeleton
 * → getCharacters → buildContext → planLesson → recordFeedback
 */
describe("Full pipeline integration", () => {
  it("chains all 8 tools from student query to feedback", () => {
    // 1. Student query
    const outcomes = findOutcomesForQuery("multiplication groups");
    expect(outcomes.length).toBeGreaterThan(0);

    // 2. Get concept for the first matching outcome
    const concept = getConceptForOutcome(outcomes[0].code);
    expect(concept).not.toBeNull();

    // 3. Get pedagogy plan
    const pedagogy = getPedagogyForConcept(concept!.id);
    expect(pedagogy).not.toBeNull();

    // 4. Get story skeleton
    const skeleton = getStorySkeleton(concept!.id);
    expect(skeleton).not.toBeNull();

    // 5. Get digit characters
    const characters = getDigitCharacters([3, 4, 5]);
    expect(characters.length).toBe(3);

    // 6. Build story context with user inputs
    const profile = getUserProfile("integration-test-user");
    const userInputs: UserInputs = {
      verbs: ["jumped", "explored"],
      nouns: ["treasure", "map"],
      place: "a pirate ship",
      mood: "excited",
      sidekick: "a talking parrot",
    };
    const storyContext = buildStoryContext(concept!.id, profile, userInputs);
    expect(storyContext).not.toBeNull();

    // 7. Plan lesson
    const lesson = planLesson(concept!.id, profile);
    expect(lesson).not.toBeNull();

    // 8. Record feedback
    const result = recordFeedback("integration-session-001", {
      sessionId: "integration-session-001",
      rating: 5,
      enjoyedMost: "The pirate ship adventure",
      foundHardest: "Understanding arrays",
      timestamp: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it("ensures Core.md integrity invariants hold across the pipeline", () => {
    const outcomes = findOutcomesForQuery("multiplication");
    const concept = getConceptForOutcome(outcomes[0].code)!;
    const skeleton = getStorySkeleton(concept.id)!;

    // Invariant 1: concept has 1+ Outcome.code
    expect(concept.outcomeCode).toBeTruthy();

    // Invariant 2: concept has 1+ models explicitly instantiated
    expect(concept.models.length).toBeGreaterThanOrEqual(1);

    // Invariant 3: concept has 1+ explicit reasoning step
    expect(concept.whyItWorks).toBeTruthy();

    // Invariant 4: skeleton forbids mnemonic-only
    const forbidsMnemonic = skeleton.forbiddenPatterns.some((p) =>
      p.toLowerCase().includes("mnemonic"),
    );
    expect(forbidsMnemonic).toBe(true);

    // Invariant 5: skeleton requires models
    expect(skeleton.requiredModels.length).toBeGreaterThanOrEqual(1);
  });
});
