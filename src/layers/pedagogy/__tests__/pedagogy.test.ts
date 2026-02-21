import { describe, it, expect } from "vitest";
import { MULTIPLICATION_PEDAGOGY } from "../data/pedagogy";
import type { PedagogyPlan } from "@/types";

describe("PedagogyPlan type validation", () => {
  it("should have at least one pedagogy plan", () => {
    expect(MULTIPLICATION_PEDAGOGY.length).toBeGreaterThan(0);
  });

  it("every plan must reference a concept", () => {
    for (const p of MULTIPLICATION_PEDAGOGY) {
      expect(p.conceptId).toBeTruthy();
    }
  });

  it("every plan must define all three CPA stages (Core.md Section 1 Rule 3)", () => {
    for (const p of MULTIPLICATION_PEDAGOGY) {
      expect(p.stages.concrete).toBeDefined();
      expect(p.stages.concrete.description).toBeTruthy();
      expect(p.stages.concrete.activities.length).toBeGreaterThan(0);

      expect(p.stages.pictorial).toBeDefined();
      expect(p.stages.pictorial.description).toBeTruthy();
      expect(p.stages.pictorial.activities.length).toBeGreaterThan(0);

      expect(p.stages.symbolic).toBeDefined();
      expect(p.stages.symbolic.description).toBeTruthy();
      expect(p.stages.symbolic.activities.length).toBeGreaterThan(0);
    }
  });

  it("every plan must define differentiation levels", () => {
    for (const p of MULTIPLICATION_PEDAGOGY) {
      expect(p.differentiation.struggling).toBeDefined();
      expect(p.differentiation.struggling.description).toBeTruthy();
      expect(p.differentiation.onLevel).toBeDefined();
      expect(p.differentiation.onLevel.description).toBeTruthy();
      expect(p.differentiation.advanced).toBeDefined();
      expect(p.differentiation.advanced.description).toBeTruthy();
    }
  });

  it("every plan must have at least one check-for-understanding that requires explanation (Core.md Section 1 Rule 3)", () => {
    for (const p of MULTIPLICATION_PEDAGOGY) {
      expect(p.checksForUnderstanding.length).toBeGreaterThan(0);
      const hasExplanationCheck = p.checksForUnderstanding.some(
        (c) => c.requiresExplanation === true,
      );
      expect(hasExplanationCheck).toBe(true);
    }
  });

  it("checks-for-understanding must have prompts and expected responses", () => {
    for (const p of MULTIPLICATION_PEDAGOGY) {
      for (const c of p.checksForUnderstanding) {
        expect(c.id).toBeTruthy();
        expect(c.prompt).toBeTruthy();
        expect(c.expectedResponse).toBeTruthy();
      }
    }
  });
});
