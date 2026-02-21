import { describe, it, expect } from "vitest";
import { DIGIT_CHARACTERS } from "../data/characters";
import type { DigitCharacter } from "@/types";

/** Known true mathematical properties for digits 0-9 */
const VALID_MATH_RULES: Record<number, string[]> = {
  0: ["zero property", "additive identity", "multiplicative annihilator"],
  1: ["multiplicative identity", "identity element"],
  2: ["doubling", "even", "first prime"],
  3: ["odd", "prime", "triangular"],
  4: ["square number", "even", "composite"],
  5: ["half of ten", "skip counting anchor"],
  6: ["even", "composite", "product of 2 and 3"],
  7: ["prime", "odd"],
  8: ["cube of 2", "even", "composite"],
  9: ["square of 3", "odd", "composite", "complement of 10"],
};

describe("DigitCharacter type validation", () => {
  it("should have exactly 10 digit characters (0-9)", () => {
    expect(DIGIT_CHARACTERS.length).toBe(10);
  });

  it("digits must cover 0 through 9 exactly", () => {
    const digits = DIGIT_CHARACTERS.map((d) => d.digit).sort((a, b) => a - b);
    expect(digits).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("every character must have a non-empty trait", () => {
    for (const d of DIGIT_CHARACTERS) {
      expect(d.trait).toBeTruthy();
    }
  });

  it("every character must have a mathRule that is a true mathematical property (Core.md Section 1 Rule 5)", () => {
    for (const d of DIGIT_CHARACTERS) {
      expect(d.mathRule).toBeTruthy();
      // The mathRule must relate to a known true property of the digit
      const validRules = VALID_MATH_RULES[d.digit];
      const ruleMatchesKnownProperty = validRules.some(
        (rule) =>
          d.mathRule.toLowerCase().includes(rule.toLowerCase()) ||
          rule.toLowerCase().includes(d.mathRule.toLowerCase()),
      );
      expect(ruleMatchesKnownProperty).toBe(true);
    }
  });

  it("every character must have a non-empty voiceStyle", () => {
    for (const d of DIGIT_CHARACTERS) {
      expect(d.voiceStyle).toBeTruthy();
    }
  });

  it("traits must not contradict the mathRule (Core.md Section 1 Rule 5)", () => {
    for (const d of DIGIT_CHARACTERS) {
      // Trait and mathRule should be complementary, not contradictory
      // e.g., digit 0 should not have a trait like "powerful multiplier"
      if (d.digit === 0) {
        expect(d.trait.toLowerCase()).not.toContain("powerful multiplier");
      }
      if (d.digit === 1) {
        expect(d.trait.toLowerCase()).not.toContain("changes everything");
      }
    }
  });
});
