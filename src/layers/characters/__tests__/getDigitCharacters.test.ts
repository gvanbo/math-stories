import { describe, it, expect } from "vitest";
import { getDigitCharacters } from "../tools/getDigitCharacters";

describe("getDigitCharacters", () => {
  it("returns characters for valid digits", () => {
    const chars = getDigitCharacters([3, 5, 7]);
    expect(chars.length).toBe(3);
    expect(chars.map((c) => c.digit).sort()).toEqual([3, 5, 7]);
  });

  it("returns all 10 characters when all digits requested", () => {
    const chars = getDigitCharacters([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(chars.length).toBe(10);
  });

  it("ignores out-of-range digits", () => {
    const chars = getDigitCharacters([3, 15, -1, 7]);
    expect(chars.length).toBe(2);
    expect(chars.map((c) => c.digit).sort()).toEqual([3, 7]);
  });

  it("returns empty array for empty input", () => {
    const chars = getDigitCharacters([]);
    expect(chars).toEqual([]);
  });

  it("every returned character has a true mathRule", () => {
    const chars = getDigitCharacters([0, 1, 2]);
    for (const c of chars) {
      expect(c.mathRule).toBeTruthy();
      expect(c.trait).toBeTruthy();
      expect(c.voiceStyle).toBeTruthy();
    }
  });

  it("handles duplicate digit requests", () => {
    const chars = getDigitCharacters([3, 3, 3]);
    expect(chars.length).toBe(1);
    expect(chars[0].digit).toBe(3);
  });
});
