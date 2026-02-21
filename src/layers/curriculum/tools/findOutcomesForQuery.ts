import type { Outcome } from "@/types";
import { ALL_OUTCOMES } from "@/lib/registry";

/**
 * findOutcomesForQuery(query) -> Outcome[]
 * Core.md Tool #1
 *
 * Searches ALL outcomes (across all topics) by matching query words
 * against keywords and descriptions. Case-insensitive, multi-word support.
 */
export function findOutcomesForQuery(query: string): Outcome[] {
  if (!query.trim()) return [];

  const queryWords = query.toLowerCase().split(/\s+/);

  return ALL_OUTCOMES.filter((outcome) => {
    const keywordsLower = outcome.keywords.map((k) => k.toLowerCase());
    const descLower = outcome.description.toLowerCase();

    return queryWords.some(
      (word) =>
        keywordsLower.some((kw) => kw.includes(word)) || descLower.includes(word),
    );
  });
}
