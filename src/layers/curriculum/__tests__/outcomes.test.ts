import { describe, it, expect } from "vitest";
import { MULTIPLICATION_OUTCOMES } from "../data/outcomes";
import type { Outcome } from "@/types";

describe("Outcome type validation", () => {
  it("should have at least one multiplication outcome", () => {
    expect(MULTIPLICATION_OUTCOMES.length).toBeGreaterThan(0);
  });

  it("every outcome must have a non-empty code", () => {
    for (const o of MULTIPLICATION_OUTCOMES) {
      expect(o.code).toBeTruthy();
      expect(typeof o.code).toBe("string");
    }
  });

  it("every outcome must have grade 4", () => {
    for (const o of MULTIPLICATION_OUTCOMES) {
      expect(o.grade).toBe(4);
    }
  });

  it("every outcome must have a non-empty strand", () => {
    for (const o of MULTIPLICATION_OUTCOMES) {
      expect(o.strand).toBeTruthy();
    }
  });

  it("every outcome must have a non-empty description", () => {
    for (const o of MULTIPLICATION_OUTCOMES) {
      expect(o.description).toBeTruthy();
      expect(o.description.length).toBeGreaterThan(10);
    }
  });

  it("every outcome must have at least one keyword", () => {
    for (const o of MULTIPLICATION_OUTCOMES) {
      expect(o.keywords.length).toBeGreaterThan(0);
      for (const kw of o.keywords) {
        expect(kw).toBeTruthy();
      }
    }
  });

  it("outcome codes must be unique", () => {
    const codes = MULTIPLICATION_OUTCOMES.map((o) => o.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});
