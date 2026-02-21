import type { PedagogyPlan } from "@/types";
import { ALL_PEDAGOGY } from "@/lib/registry";

/**
 * getPedagogyForConcept(conceptId) -> PedagogyPlan | null
 * Core.md Tool #3
 *
 * Returns the pedagogy plan for the given concept ID (across all topics).
 */
export function getPedagogyForConcept(conceptId: string): PedagogyPlan | null {
  return ALL_PEDAGOGY.find((p) => p.conceptId === conceptId) ?? null;
}
