import { describe, it, expect } from "vitest";
import { searchKnowledge } from "../tools/searchKnowledge";

describe("searchKnowledge", () => {
  it("finds topics by exact keyword", () => {
    const results = searchKnowledge("fraction");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe("grade4-number-4");
  });

  it("finds topics by matching description words", () => {
    const results = searchKnowledge("subtract");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.id === "grade4-number-1")).toBe(true);
  });

  it("returns empty array for empty query", () => {
    const results = searchKnowledge("   ");
    expect(results.length).toBe(0);
  });

  it("finds multiple topics for broad query like 'number'", () => {
    const results = searchKnowledge("multiply");
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns empty array for unmatched query", () => {
    const results = searchKnowledge("xylophone");
    expect(results.length).toBe(0);
  });
});
