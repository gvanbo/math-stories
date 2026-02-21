import { describe, it, expect } from "vitest";
import { constructStory, selfCheckStory } from "../tools/constructStory";
import { MULTIPLICATION_CONCEPTS } from "@/layers/concept/data/concepts";
import type { UserProfile, UserInputs, GeneratedStory, StoryContext } from "@/types";

const testProfile: UserProfile = {
  id: "test-user",
  preferences: { theme: "space" },
  readingLevel: "grade4",
  humorLevel: "high",
  modalityPrefs: ["visual"],
};

const testInputs: UserInputs = {
  verbs: ["zoomed", "launched"],
  nouns: ["rocket", "asteroid"],
  place: "a moon base",
  mood: "adventurous",
  sidekick: "a robot hamster",
};

const altInputs: UserInputs = {
  verbs: ["swam", "dove"],
  nouns: ["fish", "coral"],
  place: "an underwater cave",
  mood: "calm",
  sidekick: "a seahorse",
};

// ---- 4.1 / 4.2: Pipeline produces correct beat sequence ----

describe("constructStory — pipeline", () => {
  it("returns a GeneratedStory for a valid concept", () => {
    const story = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs);
    expect(story).not.toBeNull();
    expect(story!.conceptId).toBe("mult-equal-groups");
    expect(story!.outcomeCode).toBe("4.N.3");
  });

  it("returns null for an invalid concept", () => {
    const story = constructStory("nonexistent", "X.X.X", testProfile, testInputs);
    expect(story).toBeNull();
  });

  it("produces beat narratives in the correct order", () => {
    const story = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs)!;
    const types = story.beatNarratives.map((b) => b.beatType);
    expect(types).toEqual([
      "setup",
      "groupsIntro",
      "representation",
      "reasoning",
      "generalize",
      "reflection",
    ]);
  });

  it("each beat narrative is non-empty", () => {
    const story = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs)!;
    for (const bn of story.beatNarratives) {
      expect(bn.narrative.length).toBeGreaterThan(0);
    }
  });

  it("representation beat uses at least one required model", () => {
    const story = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs)!;
    const repBeat = story.beatNarratives.find((b) => b.beatType === "representation");
    expect(repBeat!.modelsUsed.length).toBeGreaterThan(0);
  });

  it("at least one beat includes character voices", () => {
    const story = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs)!;
    const hasVoices = story.beatNarratives.some((b) => b.characterVoices.length > 0);
    expect(hasVoices).toBe(true);
  });

  it("story has a timestamp", () => {
    const story = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs)!;
    expect(story.timestamp).toBeTruthy();
  });
});

// ---- 4.3 / 4.4: Slot-filling without altering math logic ----

describe("constructStory — slot-filling math invariance", () => {
  it("different user inputs produce different narratives", () => {
    const story1 = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs)!;
    const story2 = constructStory("mult-equal-groups", "4.N.3", testProfile, altInputs)!;

    const narrative1 = story1.beatNarratives.map((b) => b.narrative).join(" ");
    const narrative2 = story2.beatNarratives.map((b) => b.narrative).join(" ");
    expect(narrative1).not.toBe(narrative2);
  });

  it("skeleton structure is identical regardless of user inputs", () => {
    const story1 = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs)!;
    const story2 = constructStory("mult-equal-groups", "4.N.3", testProfile, altInputs)!;

    expect(story1.context.skeleton).toEqual(story2.context.skeleton);
  });

  it("required models are identical regardless of user inputs", () => {
    const story1 = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs)!;
    const story2 = constructStory("mult-equal-groups", "4.N.3", testProfile, altInputs)!;

    expect(story1.context.skeleton.requiredModels).toEqual(
      story2.context.skeleton.requiredModels,
    );
  });

  it("beat types are identical regardless of user inputs", () => {
    const story1 = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs)!;
    const story2 = constructStory("mult-equal-groups", "4.N.3", testProfile, altInputs)!;

    const types1 = story1.beatNarratives.map((b) => b.beatType);
    const types2 = story2.beatNarratives.map((b) => b.beatType);
    expect(types1).toEqual(types2);
  });
});

// ---- 4.5 / 4.6: Personalization is skin-only ----

describe("constructStory — personalization skin-only", () => {
  it("personalized context preserves forbiddenPatterns", () => {
    const story = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs)!;
    const hasForbidden = story.context.skeleton.forbiddenPatterns.some((p) =>
      p.toLowerCase().includes("mnemonic"),
    );
    expect(hasForbidden).toBe(true);
  });

  it("narrative prompt includes user input elements", () => {
    const story = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs)!;
    const prompt = story.context.narrativePrompt;
    expect(prompt).toContain(testInputs.place);
    expect(prompt).toContain(testInputs.mood);
    expect(prompt).toContain(testInputs.sidekick);
  });
});

// ---- 4.7 / 4.8: Self-check ----

describe("selfCheckStory", () => {
  it("passes for a valid story with correct models and strategies", () => {
    const story = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs)!;
    const concept = MULTIPLICATION_CONCEPTS.find((c) => c.id === "mult-equal-groups")!;
    const result = selfCheckStory(story, concept);
    expect(result.passes).toBe(true);
    expect(result.modelsMatch).toBe(true);
    expect(result.strategiesMatch).toBe(true);
    expect(result.mismatches).toEqual([]);
  });

  it("provides a math explanation", () => {
    const story = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs)!;
    const concept = MULTIPLICATION_CONCEPTS.find((c) => c.id === "mult-equal-groups")!;
    const result = selfCheckStory(story, concept);
    expect(result.mathExplanation.length).toBeGreaterThan(20);
  });

  it("fails when story has no model references", () => {
    const story = constructStory("mult-equal-groups", "4.N.3", testProfile, testInputs)!;
    // Strip all model references from beat narratives
    story.beatNarratives = story.beatNarratives.map((bn) => ({
      ...bn,
      modelsUsed: [],
    }));
    const concept = MULTIPLICATION_CONCEPTS.find((c) => c.id === "mult-equal-groups")!;
    const result = selfCheckStory(story, concept);
    expect(result.passes).toBe(false);
    expect(result.modelsMatch).toBe(false);
    expect(result.mismatches.length).toBeGreaterThan(0);
  });
});
