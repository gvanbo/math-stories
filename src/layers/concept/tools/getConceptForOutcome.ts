import type { Concept } from "@/types";
import { MULTIPLICATION_CONCEPTS } from "../data/concepts";

/**
 * getConceptForOutcome(outcomeCode) -> Concept | null
 * Core.md Tool #2
 *
 * Returns the concept mapped to the given outcome code, or null if not found.
 */
export function getConceptForOutcome(outcomeCode: string): Concept | null {
  return MULTIPLICATION_CONCEPTS.find((c) => c.outcomeCode === outcomeCode) ?? null;
}
