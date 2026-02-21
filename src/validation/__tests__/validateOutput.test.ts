import { describe, it, expect } from "vitest";
import { validateOutput } from "../validateOutput";
import type { Concept, StorySkeleton, StoryContext, UserInputs } from "@/types";
import { MULTIPLICATION_CONCEPTS } from "@/layers/concept/data/concepts";
import { MULTIPLICATION_SKELETONS } from "@/layers/story/data/skeletons";
import { DIGIT_CHARACTERS } from "@/layers/characters/data/characters";

// ----- Helpers: build valid and invalid test artifacts -----

function makeValidStoryContext(): StoryContext {
  const skeleton = MULTIPLICATION_SKELETONS[0];
  return {
    conceptId: "mult-equal-groups",
    skeleton,
    characters: DIGIT_CHARACTERS.filter((d) => [3, 4, 5].includes(d.digit)),
    userInputs: {
      verbs: ["jumped"],
      nouns: ["treasure"],
      place: "a spaceship",
      mood: "excited",
      sidekick: "a robot",
    },
    personalizedBeats: skeleton.beats,
    narrativePrompt: "A narrative prompt with equal groups and array models and reasoning about why multiplication works.",
  };
}

// ----- Rule Tests -----

describe("validateOutput — Core.md Section 5 Rules", () => {
  // RULE 1: Must have 1+ Outcome.code
  describe("Rule: outcome code required", () => {
    it("passes when outcome code is present", () => {
      const result = validateOutput("story", makeValidStoryContext(), {
        outcomeCodes: ["4.N.3"],
        concept: MULTIPLICATION_CONCEPTS[0],
      });
      const check = result.checks.find((c) => c.rule === "outcome-code-present");
      expect(check?.status).toBe("pass");
    });

    it("fails when no outcome code is provided", () => {
      const result = validateOutput("story", makeValidStoryContext(), {
        outcomeCodes: [],
        concept: MULTIPLICATION_CONCEPTS[0],
      });
      const check = result.checks.find((c) => c.rule === "outcome-code-present");
      expect(check?.status).toBe("fail");
      expect(result.valid).toBe(false);
    });
  });

  // RULE 2: Must have 1+ Concept.models explicitly instantiated
  describe("Rule: model instantiated", () => {
    it("passes when concept has models", () => {
      const result = validateOutput("story", makeValidStoryContext(), {
        outcomeCodes: ["4.N.3"],
        concept: MULTIPLICATION_CONCEPTS[0],
      });
      const check = result.checks.find((c) => c.rule === "model-instantiated");
      expect(check?.status).toBe("pass");
    });

    it("fails when concept has no models", () => {
      const emptyModelsConcept: Concept = {
        ...MULTIPLICATION_CONCEPTS[0],
        models: [],
      };
      const result = validateOutput("story", makeValidStoryContext(), {
        outcomeCodes: ["4.N.3"],
        concept: emptyModelsConcept,
      });
      const check = result.checks.find((c) => c.rule === "model-instantiated");
      expect(check?.status).toBe("fail");
    });
  });

  // RULE 3: Must have 1+ explicit reasoning step ("why it works")
  describe("Rule: reasoning step present", () => {
    it("passes when concept has whyItWorks", () => {
      const result = validateOutput("story", makeValidStoryContext(), {
        outcomeCodes: ["4.N.3"],
        concept: MULTIPLICATION_CONCEPTS[0],
      });
      const check = result.checks.find((c) => c.rule === "reasoning-step-present");
      expect(check?.status).toBe("pass");
    });

    it("fails when whyItWorks is empty", () => {
      const noReasoning: Concept = {
        ...MULTIPLICATION_CONCEPTS[0],
        whyItWorks: "",
      };
      const result = validateOutput("story", makeValidStoryContext(), {
        outcomeCodes: ["4.N.3"],
        concept: noReasoning,
      });
      const check = result.checks.find((c) => c.rule === "reasoning-step-present");
      expect(check?.status).toBe("fail");
    });
  });

  // RULE 4: Must not rely only on mnemonics
  describe("Rule: no mnemonic-only", () => {
    it("passes when skeleton forbids mnemonics", () => {
      const result = validateOutput("story", makeValidStoryContext(), {
        outcomeCodes: ["4.N.3"],
        concept: MULTIPLICATION_CONCEPTS[0],
      });
      const check = result.checks.find((c) => c.rule === "no-mnemonic-only");
      expect(check?.status).toBe("pass");
    });

    it("fails when skeleton has no forbidden patterns", () => {
      const ctx = makeValidStoryContext();
      ctx.skeleton = { ...ctx.skeleton, forbiddenPatterns: [] };
      const result = validateOutput("story", ctx, {
        outcomeCodes: ["4.N.3"],
        concept: MULTIPLICATION_CONCEPTS[0],
      });
      const check = result.checks.find((c) => c.rule === "no-mnemonic-only");
      expect(check?.status).toBe("fail");
    });
  });

  // RULE 5: Digit character traits must not contradict math rules
  describe("Rule: digit traits consistent", () => {
    it("passes when all digit characters have valid mathRules", () => {
      const result = validateOutput("story", makeValidStoryContext(), {
        outcomeCodes: ["4.N.3"],
        concept: MULTIPLICATION_CONCEPTS[0],
      });
      const check = result.checks.find((c) => c.rule === "digit-traits-consistent");
      expect(check?.status).toBe("pass");
    });

    it("fails when a digit character has empty mathRule", () => {
      const ctx = makeValidStoryContext();
      ctx.characters = [{ digit: 3, trait: "Strong", mathRule: "", voiceStyle: "Bold" }];
      const result = validateOutput("story", ctx, {
        outcomeCodes: ["4.N.3"],
        concept: MULTIPLICATION_CONCEPTS[0],
      });
      const check = result.checks.find((c) => c.rule === "digit-traits-consistent");
      expect(check?.status).toBe("fail");
    });
  });

  // RULE 6: Must not skip from problem to answer with no visible structure
  describe("Rule: beat structure complete", () => {
    it("passes when all 6 beat types are present", () => {
      const result = validateOutput("story", makeValidStoryContext(), {
        outcomeCodes: ["4.N.3"],
        concept: MULTIPLICATION_CONCEPTS[0],
      });
      const check = result.checks.find((c) => c.rule === "beat-structure-complete");
      expect(check?.status).toBe("pass");
    });

    it("fails when beats are missing", () => {
      const ctx = makeValidStoryContext();
      ctx.skeleton = {
        ...ctx.skeleton,
        beats: ctx.skeleton.beats.filter((b) => b.type !== "reasoning"),
      };
      const result = validateOutput("story", ctx, {
        outcomeCodes: ["4.N.3"],
        concept: MULTIPLICATION_CONCEPTS[0],
      });
      const check = result.checks.find((c) => c.rule === "beat-structure-complete");
      expect(check?.status).toBe("fail");
    });
  });

  // RULE 7: Skeleton must have required models
  describe("Rule: skeleton models required", () => {
    it("passes when skeleton has requiredModels", () => {
      const result = validateOutput("story", makeValidStoryContext(), {
        outcomeCodes: ["4.N.3"],
        concept: MULTIPLICATION_CONCEPTS[0],
      });
      const check = result.checks.find((c) => c.rule === "skeleton-models-required");
      expect(check?.status).toBe("pass");
    });

    it("fails when requiredModels is empty", () => {
      const ctx = makeValidStoryContext();
      ctx.skeleton = { ...ctx.skeleton, requiredModels: [] };
      const result = validateOutput("story", ctx, {
        outcomeCodes: ["4.N.3"],
        concept: MULTIPLICATION_CONCEPTS[0],
      });
      const check = result.checks.find((c) => c.rule === "skeleton-models-required");
      expect(check?.status).toBe("fail");
    });
  });

  // RULE 8: Concept must have strategies
  describe("Rule: strategies present", () => {
    it("passes when concept has strategies", () => {
      const result = validateOutput("story", makeValidStoryContext(), {
        outcomeCodes: ["4.N.3"],
        concept: MULTIPLICATION_CONCEPTS[0],
      });
      const check = result.checks.find((c) => c.rule === "strategies-present");
      expect(check?.status).toBe("pass");
    });

    it("fails when concept has no strategies", () => {
      const noStrategies: Concept = {
        ...MULTIPLICATION_CONCEPTS[0],
        strategies: [],
      };
      const result = validateOutput("story", makeValidStoryContext(), {
        outcomeCodes: ["4.N.3"],
        concept: noStrategies,
      });
      const check = result.checks.find((c) => c.rule === "strategies-present");
      expect(check?.status).toBe("fail");
    });
  });

  // RULE 9: Personalization must not alter math logic
  describe("Rule: personalization skin-only", () => {
    it("passes when user inputs exist but skeleton is intact", () => {
      const result = validateOutput("story", makeValidStoryContext(), {
        outcomeCodes: ["4.N.3"],
        concept: MULTIPLICATION_CONCEPTS[0],
      });
      const check = result.checks.find((c) => c.rule === "personalization-skin-only");
      expect(check?.status).toBe("pass");
    });
  });
});

// ----- Aggregate tests -----

describe("validateOutput — aggregate behavior", () => {
  it("returns valid=true when all rules pass", () => {
    const result = validateOutput("story", makeValidStoryContext(), {
      outcomeCodes: ["4.N.3"],
      concept: MULTIPLICATION_CONCEPTS[0],
    });
    expect(result.valid).toBe(true);
    expect(result.violations.length).toBe(0);
  });

  it("returns valid=false with violations and repair suggestions for bad outputs", () => {
    const badConcept: Concept = {
      ...MULTIPLICATION_CONCEPTS[0],
      models: [],
      strategies: [],
      whyItWorks: "",
    };
    const result = validateOutput("story", makeValidStoryContext(), {
      outcomeCodes: [],
      concept: badConcept,
    });
    expect(result.valid).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.repairSuggestions.length).toBeGreaterThan(0);
  });

  it("every violation has severity and description", () => {
    const badConcept: Concept = {
      ...MULTIPLICATION_CONCEPTS[0],
      models: [],
    };
    const result = validateOutput("story", makeValidStoryContext(), {
      outcomeCodes: [],
      concept: badConcept,
    });
    for (const v of result.violations) {
      expect(v.rule).toBeTruthy();
      expect(v.description).toBeTruthy();
      expect(["must-fix", "should-fix"]).toContain(v.severity);
    }
  });
});

// ----- Integration with pipeline -----

describe("validateOutput — pipeline integration", () => {
  it("validates a full pipeline output successfully", () => {
    const result = validateOutput("storyContext", makeValidStoryContext(), {
      outcomeCodes: ["4.N.3"],
      concept: MULTIPLICATION_CONCEPTS[0],
    });
    expect(result.valid).toBe(true);
    expect(result.checkedArtifactType).toBe("storyContext");
  });
});
