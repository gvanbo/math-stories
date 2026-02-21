import { describe, it, expect } from "vitest";
import { getPedagogyForConcept } from "../tools/getPedagogyForConcept";

describe("getPedagogyForConcept", () => {
  it("returns a pedagogy plan for a valid concept ID", () => {
    const plan = getPedagogyForConcept("mult-equal-groups");
    expect(plan).toBeDefined();
    expect(plan!.conceptId).toBe("mult-equal-groups");
  });

  it("returns null for an invalid concept ID", () => {
    const plan = getPedagogyForConcept("nonexistent-concept");
    expect(plan).toBeNull();
  });

  it("plan includes all three CPA stages", () => {
    const plan = getPedagogyForConcept("mult-equal-groups");
    expect(plan!.stages.concrete).toBeDefined();
    expect(plan!.stages.pictorial).toBeDefined();
    expect(plan!.stages.symbolic).toBeDefined();
  });

  it("plan includes differentiation at all three levels", () => {
    const plan = getPedagogyForConcept("mult-equal-groups");
    expect(plan!.differentiation.struggling).toBeDefined();
    expect(plan!.differentiation.onLevel).toBeDefined();
    expect(plan!.differentiation.advanced).toBeDefined();
  });

  it("plan has checks-for-understanding requiring explanation", () => {
    const plan = getPedagogyForConcept("mult-equal-groups");
    expect(plan!.checksForUnderstanding.length).toBeGreaterThan(0);
    const hasExplanation = plan!.checksForUnderstanding.some(
      (c) => c.requiresExplanation,
    );
    expect(hasExplanation).toBe(true);
  });
});
