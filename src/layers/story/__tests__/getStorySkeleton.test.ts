import { describe, it, expect } from "vitest";
import { getStorySkeleton } from "../tools/getStorySkeleton";

describe("getStorySkeleton", () => {
  it("returns a skeleton for a valid concept ID", () => {
    const skeleton = getStorySkeleton("mult-equal-groups");
    expect(skeleton).toBeDefined();
    expect(skeleton!.conceptId).toBe("mult-equal-groups");
  });

  it("returns null for an invalid concept ID", () => {
    const skeleton = getStorySkeleton("nonexistent");
    expect(skeleton).toBeNull();
  });

  it("skeleton has all 6 beat types in order", () => {
    const skeleton = getStorySkeleton("mult-equal-groups");
    const types = skeleton!.beats.map((b) => b.type);
    expect(types).toEqual([
      "setup",
      "groupsIntro",
      "representation",
      "reasoning",
      "generalize",
      "reflection",
    ]);
  });

  it("skeleton has required models", () => {
    const skeleton = getStorySkeleton("mult-equal-groups");
    expect(skeleton!.requiredModels.length).toBeGreaterThan(0);
  });

  it("skeleton forbids pure mnemonic without model or reasoning", () => {
    const skeleton = getStorySkeleton("mult-equal-groups");
    const hasForbidden = skeleton!.forbiddenPatterns.some((p) =>
      p.toLowerCase().includes("mnemonic"),
    );
    expect(hasForbidden).toBe(true);
  });
});
