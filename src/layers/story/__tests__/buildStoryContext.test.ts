import { describe, it, expect } from "vitest";
import { buildStoryContext } from "../tools/buildStoryContext";
import type { UserProfile, UserInputs } from "@/types";

const mockProfile: UserProfile = {
  id: "test-user-1",
  preferences: { theme: "space" },
  readingLevel: "grade4",
  humorLevel: "high",
  modalityPrefs: ["visual"],
};

const mockInputs: UserInputs = {
  verbs: ["zoomed", "launched"],
  nouns: ["rocket", "asteroid"],
  place: "a moon base",
  mood: "adventurous",
  sidekick: "a robot hamster",
};

describe("buildStoryContext", () => {
  it("returns a StoryContext for a valid concept ID", () => {
    const ctx = buildStoryContext("mult-equal-groups", mockProfile, mockInputs);
    expect(ctx).toBeDefined();
    expect(ctx!.conceptId).toBe("mult-equal-groups");
  });

  it("returns null for an invalid concept ID", () => {
    const ctx = buildStoryContext("nonexistent", mockProfile, mockInputs);
    expect(ctx).toBeNull();
  });

  it("context includes skeleton beats", () => {
    const ctx = buildStoryContext("mult-equal-groups", mockProfile, mockInputs);
    expect(ctx!.skeleton.beats.length).toBeGreaterThan(0);
  });

  it("context includes digit characters", () => {
    const ctx = buildStoryContext("mult-equal-groups", mockProfile, mockInputs);
    expect(ctx!.characters.length).toBeGreaterThan(0);
  });

  it("context includes user inputs", () => {
    const ctx = buildStoryContext("mult-equal-groups", mockProfile, mockInputs);
    expect(ctx!.userInputs).toEqual(mockInputs);
  });

  it("personalization changes skin only — math logic is preserved (Core.md Section 1 Rule 6)", () => {
    const ctx1 = buildStoryContext("mult-equal-groups", mockProfile, mockInputs);

    const differentInputs: UserInputs = {
      verbs: ["swam", "dove"],
      nouns: ["fish", "coral"],
      place: "an underwater cave",
      mood: "calm",
      sidekick: "a seahorse",
    };

    const ctx2 = buildStoryContext("mult-equal-groups", mockProfile, differentInputs);

    // Skeletons must be identical (same concept = same math)
    expect(ctx1!.skeleton).toEqual(ctx2!.skeleton);

    // Narrative prompts should differ (different skin)
    expect(ctx1!.narrativePrompt).not.toBe(ctx2!.narrativePrompt);
  });

  it("context generates a narrative prompt", () => {
    const ctx = buildStoryContext("mult-equal-groups", mockProfile, mockInputs);
    expect(ctx!.narrativePrompt).toBeTruthy();
    expect(ctx!.narrativePrompt.length).toBeGreaterThan(50);
  });
});
