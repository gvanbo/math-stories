import { describe, it, expect } from "vitest";
import { MULTIPLICATION_CONCEPTS } from "../data/concepts";
import type { Concept } from "@/types";

describe("Concept type validation", () => {
  it("should have at least one multiplication concept", () => {
    expect(MULTIPLICATION_CONCEPTS.length).toBeGreaterThan(0);
  });

  it("every concept must have a non-empty id", () => {
    for (const c of MULTIPLICATION_CONCEPTS) {
      expect(c.id).toBeTruthy();
    }
  });

  it("every concept must reference a valid outcome code", () => {
    for (const c of MULTIPLICATION_CONCEPTS) {
      expect(c.outcomeCode).toBeTruthy();
      expect(typeof c.outcomeCode).toBe("string");
    }
  });

  it("every concept must have at least one visualizable model (Core.md Section 1 Rule 2)", () => {
    for (const c of MULTIPLICATION_CONCEPTS) {
      expect(c.models.length).toBeGreaterThanOrEqual(1);
      for (const m of c.models) {
        expect(m.id).toBeTruthy();
        expect(m.name).toBeTruthy();
        expect(m.type).toBeTruthy();
        expect(m.description).toBeTruthy();
      }
    }
  });

  it("every concept must have at least one reasoning strategy (Core.md Section 1 Rule 2)", () => {
    for (const c of MULTIPLICATION_CONCEPTS) {
      expect(c.strategies.length).toBeGreaterThanOrEqual(1);
      for (const s of c.strategies) {
        expect(s.id).toBeTruthy();
        expect(s.name).toBeTruthy();
        expect(s.type).toBeTruthy();
        expect(s.description).toBeTruthy();
      }
    }
  });

  it("every concept must have a 'why it works' explanation (Core.md Section 1 Rule 2)", () => {
    for (const c of MULTIPLICATION_CONCEPTS) {
      expect(c.whyItWorks).toBeTruthy();
      expect(c.whyItWorks.length).toBeGreaterThan(20);
    }
  });

  it("concept ids must be unique", () => {
    const ids = MULTIPLICATION_CONCEPTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
