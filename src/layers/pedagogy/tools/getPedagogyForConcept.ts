import type { PedagogyPlan } from "@/types";
import { MULTIPLICATION_PEDAGOGY } from "../data/pedagogy";

/**
 * getPedagogyForConcept(conceptId) -> PedagogyPlan | null
 * Core.md Tool #3
 *
 * Returns the pedagogy plan for the given concept ID, or null if not found.
 */
export function getPedagogyForConcept(conceptId: string): PedagogyPlan | null {
  return MULTIPLICATION_PEDAGOGY.find((p) => p.conceptId === conceptId) ?? null;
}
