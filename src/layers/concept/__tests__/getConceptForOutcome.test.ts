import { describe, it, expect } from "vitest";
import { getConceptForOutcome } from "../tools/getConceptForOutcome";

describe("getConceptForOutcome", () => {
  it("returns a concept for a valid outcome code", () => {
    const concept = getConceptForOutcome("4.N.3");
    expect(concept).toBeDefined();
    expect(concept!.outcomeCode).toBe("4.N.3");
  });

  it("returns null for an invalid outcome code", () => {
    const concept = getConceptForOutcome("99.X.99");
    expect(concept).toBeNull();
  });

  it("returned concept has at least one model (Core.md Section 1 Rule 2)", () => {
    const concept = getConceptForOutcome("4.N.3");
    expect(concept!.models.length).toBeGreaterThanOrEqual(1);
  });

  it("returned concept has at least one strategy (Core.md Section 1 Rule 2)", () => {
    const concept = getConceptForOutcome("4.N.3");
    expect(concept!.strategies.length).toBeGreaterThanOrEqual(1);
  });

  it("returned concept has a whyItWorks explanation", () => {
    const concept = getConceptForOutcome("4.N.3");
    expect(concept!.whyItWorks).toBeTruthy();
  });
});
