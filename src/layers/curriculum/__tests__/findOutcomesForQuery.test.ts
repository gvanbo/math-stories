import { describe, it, expect } from "vitest";
import { findOutcomesForQuery } from "../tools/findOutcomesForQuery";

describe("findOutcomesForQuery", () => {
  it("returns outcomes matching an exact keyword", () => {
    const results = findOutcomesForQuery("multiplication");
    expect(results.length).toBeGreaterThan(0);
    for (const o of results) {
      const hasKeyword = o.keywords.some((k) =>
        k.toLowerCase().includes("multiplication"),
      );
      const hasDescription = o.description.toLowerCase().includes("multiplication");
      expect(hasKeyword || hasDescription).toBe(true);
    }
  });

  it("returns outcomes for a partial keyword match", () => {
    const results = findOutcomesForQuery("doubling");
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns outcomes for multi-word queries", () => {
    const results = findOutcomesForQuery("mental math strategies");
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns an empty array for no match", () => {
    const results = findOutcomesForQuery("quantum physics");
    expect(results).toEqual([]);
  });

  it("is case-insensitive", () => {
    const lower = findOutcomesForQuery("multiplication");
    const upper = findOutcomesForQuery("MULTIPLICATION");
    expect(lower).toEqual(upper);
  });

  it("returns valid Outcome objects", () => {
    const results = findOutcomesForQuery("multiplication");
    for (const o of results) {
      expect(o.code).toBeTruthy();
      expect(o.strand).toBeTruthy();
      expect(o.description).toBeTruthy();
      expect(o.grade).toBe(4);
      expect(o.keywords.length).toBeGreaterThan(0);
    }
  });
});
