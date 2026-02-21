import type { Concept } from "@/types";
import { ALL_CONCEPTS } from "@/lib/registry";

/**
 * getConceptForOutcome(outcomeCode) -> Concept | null
 * Core.md Tool #2
 *
 * Returns the concept mapped to the given outcome code (across all topics).
 */
export function getConceptForOutcome(outcomeCode: string): Concept | null {
  return ALL_CONCEPTS.find((c) => c.outcomeCode === outcomeCode) ?? null;
}
