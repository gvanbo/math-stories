import { describe, it, expect } from "vitest";
import { MULTIPLICATION_SKELETONS } from "../data/skeletons";
import type { StorySkeleton, BeatType } from "@/types";

const REQUIRED_BEAT_ORDER: BeatType[] = [
  "setup",
  "groupsIntro",
  "representation",
  "reasoning",
  "generalize",
  "reflection",
];

describe("StorySkeleton type validation", () => {
  it("should have at least one story skeleton", () => {
    expect(MULTIPLICATION_SKELETONS.length).toBeGreaterThan(0);
  });

  it("every skeleton must reference a concept", () => {
    for (const s of MULTIPLICATION_SKELETONS) {
      expect(s.conceptId).toBeTruthy();
    }
  });

  it("beats must appear in the correct order (Core.md Section 3)", () => {
    for (const s of MULTIPLICATION_SKELETONS) {
      const beatTypes = s.beats.map((b) => b.type);
      // Filter to only the canonical beat types and check order is preserved
      const canonical = beatTypes.filter((t) => REQUIRED_BEAT_ORDER.includes(t));
      for (let i = 0; i < canonical.length - 1; i++) {
        const currentIdx = REQUIRED_BEAT_ORDER.indexOf(canonical[i]);
        const nextIdx = REQUIRED_BEAT_ORDER.indexOf(canonical[i + 1]);
        expect(nextIdx).toBeGreaterThanOrEqual(currentIdx);
      }
    }
  });

  it("every skeleton must include all 6 beat types", () => {
    for (const s of MULTIPLICATION_SKELETONS) {
      const beatTypes = new Set(s.beats.map((b) => b.type));
      for (const requiredBeat of REQUIRED_BEAT_ORDER) {
        expect(beatTypes.has(requiredBeat)).toBe(true);
      }
    }
  });

  it("every skeleton must have at least one required model (Core.md Section 1 Rule 4)", () => {
    for (const s of MULTIPLICATION_SKELETONS) {
      expect(s.requiredModels.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('forbiddenPatterns must include "pure mnemonic with no model or reasoning" (Core.md Section 1 Rule 4)', () => {
    for (const s of MULTIPLICATION_SKELETONS) {
      expect(s.forbiddenPatterns.length).toBeGreaterThan(0);
      const hasMnemonicForbidden = s.forbiddenPatterns.some(
        (p) =>
          p.toLowerCase().includes("mnemonic") &&
          p.toLowerCase().includes("no model"),
      );
      expect(hasMnemonicForbidden).toBe(true);
    }
  });

  it("every beat must have a description and slots array", () => {
    for (const s of MULTIPLICATION_SKELETONS) {
      for (const b of s.beats) {
        expect(b.description).toBeTruthy();
        expect(Array.isArray(b.slots)).toBe(true);
      }
    }
  });
});
