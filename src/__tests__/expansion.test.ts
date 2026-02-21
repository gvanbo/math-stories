import { describe, it, expect } from "vitest";
import { ALL_OUTCOMES, ALL_CONCEPTS, ALL_PEDAGOGY, ALL_SKELETONS } from "@/lib/registry";
import { findOutcomesForQuery } from "@/layers/curriculum/tools/findOutcomesForQuery";
import { getConceptForOutcome } from "@/layers/concept/tools/getConceptForOutcome";
import { getPedagogyForConcept } from "@/layers/pedagogy/tools/getPedagogyForConcept";
import { getStorySkeleton } from "@/layers/story/tools/getStorySkeleton";
import { constructStory } from "@/layers/story/tools/constructStory";
import { validateOutput } from "@/validation/validateOutput";
import type { UserInputs, UserProfile } from "@/types";

const profile: UserProfile = {
  id: "expansion-tester",
  preferences: {},
  readingLevel: "grade4",
  humorLevel: "high",
  modalityPrefs: ["visual"],
};

const inputs: UserInputs = {
  verbs: ["explored", "discovered"],
  nouns: ["treasure", "crystal"],
  place: "a hidden temple",
  mood: "curious",
  sidekick: "a brave fox",
};

// ---- Core.md Section 6: Expansion requires data-only, no architecture changes ----

describe("Expansion Protocol — data-only additions", () => {
  it("registry has 3 topics worth of outcomes (8 total)", () => {
    expect(ALL_OUTCOMES.length).toBe(8);
  });

  it("registry has 3 topics worth of concepts (7 total)", () => {
    expect(ALL_CONCEPTS.length).toBe(7);
  });

  it("registry has 3 topics worth of pedagogy plans (6 total)", () => {
    expect(ALL_PEDAGOGY.length).toBe(6);
  });

  it("registry has 3 topics worth of skeletons (6 total)", () => {
    expect(ALL_SKELETONS.length).toBe(6);
  });

  it("all concepts have at least 1 model (Core.md Rule 2)", () => {
    for (const c of ALL_CONCEPTS) {
      expect(c.models.length).toBeGreaterThan(0);
    }
  });

  it("all concepts have at least 1 strategy (Core.md Rule 8)", () => {
    for (const c of ALL_CONCEPTS) {
      expect(c.strategies.length).toBeGreaterThan(0);
    }
  });

  it("all concepts have a whyItWorks explanation (Core.md Rule 3)", () => {
    for (const c of ALL_CONCEPTS) {
      expect(c.whyItWorks.length).toBeGreaterThan(20);
    }
  });

  it("all skeletons have 6 beats (Core.md Rule 6)", () => {
    for (const s of ALL_SKELETONS) {
      expect(s.beats.length).toBe(6);
      const types = s.beats.map((b) => b.type);
      expect(types).toContain("setup");
      expect(types).toContain("reasoning");
      expect(types).toContain("reflection");
    }
  });

  it("all skeletons forbid mnemonic-only (Core.md Rule 4)", () => {
    for (const s of ALL_SKELETONS) {
      const hasForbidden = s.forbiddenPatterns.some((p) =>
        p.toLowerCase().includes("mnemonic"),
      );
      expect(hasForbidden).toBe(true);
    }
  });
});

// ---- Division topic discovery ----

describe("Division topic — full pipeline", () => {
  it("findOutcomesForQuery finds division outcomes", () => {
    const results = findOutcomesForQuery("division");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.code === "4.N.6")).toBe(true);
  });

  it("getConceptForOutcome returns division concept", () => {
    const concept = getConceptForOutcome("4.N.6");
    expect(concept).not.toBeNull();
    expect(concept!.id).toBe("div-equal-sharing");
  });

  it("getPedagogyForConcept returns division pedagogy", () => {
    const ped = getPedagogyForConcept("div-equal-sharing");
    expect(ped).not.toBeNull();
    expect(ped!.checksForUnderstanding[0].requiresExplanation).toBe(true);
  });

  it("getStorySkeleton returns division skeleton", () => {
    const skel = getStorySkeleton("div-equal-sharing");
    expect(skel).not.toBeNull();
    expect(skel!.beats.length).toBe(6);
  });

  it("constructStory generates a valid division story", () => {
    const story = constructStory("div-equal-sharing", "4.N.6", profile, inputs);
    expect(story).not.toBeNull();
    expect(story!.selfCheck.passes).toBe(true);
  });

  it("division story passes Integrity Validator", () => {
    const story = constructStory("div-equal-sharing", "4.N.6", profile, inputs)!;
    const concept = getConceptForOutcome("4.N.6")!;
    const result = validateOutput("story", story.context, {
      outcomeCodes: ["4.N.6"],
      concept,
    });
    expect(result.valid).toBe(true);
    expect(result.violations.length).toBe(0);
  });
});

// ---- Fractions topic discovery ----

describe("Fractions topic — full pipeline", () => {
  it("findOutcomesForQuery finds fractions outcomes", () => {
    const results = findOutcomesForQuery("fractions");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.code === "4.N.8")).toBe(true);
  });

  it("getConceptForOutcome returns fractions concept", () => {
    const concept = getConceptForOutcome("4.N.8");
    expect(concept).not.toBeNull();
    expect(concept!.id).toBe("frac-part-whole");
  });

  it("getPedagogyForConcept returns fractions pedagogy", () => {
    const ped = getPedagogyForConcept("frac-part-whole");
    expect(ped).not.toBeNull();
    expect(ped!.checksForUnderstanding[0].requiresExplanation).toBe(true);
  });

  it("getStorySkeleton returns fractions skeleton", () => {
    const skel = getStorySkeleton("frac-part-whole");
    expect(skel).not.toBeNull();
    expect(skel!.beats.length).toBe(6);
  });

  it("constructStory generates a valid fractions story", () => {
    const story = constructStory("frac-part-whole", "4.N.8", profile, inputs);
    expect(story).not.toBeNull();
    expect(story!.selfCheck.passes).toBe(true);
  });

  it("fractions story passes Integrity Validator", () => {
    const story = constructStory("frac-part-whole", "4.N.8", profile, inputs)!;
    const concept = getConceptForOutcome("4.N.8")!;
    const result = validateOutput("story", story.context, {
      outcomeCodes: ["4.N.8"],
      concept,
    });
    expect(result.valid).toBe(true);
    expect(result.violations.length).toBe(0);
  });
});

// ---- Cross-topic: topics are discoverable via relevant queries ----

describe("Cross-topic discovery", () => {
  it("query 'strategies' finds multiplication outcomes", () => {
    const results = findOutcomesForQuery("strategies");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.code.startsWith("4.N"))).toBe(true);
  });

  it("query 'division multiplication' finds both topics", () => {
    const results = findOutcomesForQuery("division multiplication");
    const hasMult = results.some((r) => r.description.toLowerCase().includes("multiplication"));
    const hasDiv = results.some((r) => r.description.toLowerCase().includes("division"));
    expect(hasMult).toBe(true);
    expect(hasDiv).toBe(true);
  });
});
