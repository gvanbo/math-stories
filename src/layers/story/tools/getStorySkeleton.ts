import type { StorySkeleton } from "@/types";
import { MULTIPLICATION_SKELETONS } from "../data/skeletons";

/**
 * getStorySkeleton(conceptId) -> StorySkeleton | null
 * Core.md Tool #4
 *
 * Returns the story skeleton for the given concept ID, or null if not found.
 */
export function getStorySkeleton(conceptId: string): StorySkeleton | null {
  return MULTIPLICATION_SKELETONS.find((s) => s.conceptId === conceptId) ?? null;
}
