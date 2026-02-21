import type { StorySkeleton } from "@/types";
import { ALL_SKELETONS } from "@/lib/registry";

/**
 * getStorySkeleton(conceptId) -> StorySkeleton | null
 * Core.md Tool #4
 *
 * Returns the story skeleton for the given concept ID (across all topics).
 */
export function getStorySkeleton(conceptId: string): StorySkeleton | null {
  return ALL_SKELETONS.find((s) => s.conceptId === conceptId) ?? null;
}
