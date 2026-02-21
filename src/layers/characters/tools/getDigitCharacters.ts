import type { DigitCharacter } from "@/types";
import { DIGIT_CHARACTERS } from "../data/characters";

/**
 * getDigitCharacters(digits[]) -> DigitCharacter[]
 * Core.md Tool #5
 *
 * Returns digit characters for the requested digits.
 * Filters out invalid/out-of-range digits and deduplicates.
 */
export function getDigitCharacters(digits: number[]): DigitCharacter[] {
  const uniqueDigits = [...new Set(digits)].filter((d) => d >= 0 && d <= 9);
  return DIGIT_CHARACTERS.filter((c) => uniqueDigits.includes(c.digit));
}
