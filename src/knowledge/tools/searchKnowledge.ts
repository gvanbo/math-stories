import { CurriculumTopic } from "../types";
import curriculumData from "../data/grade4_curriculum.json";

const curriculum: CurriculumTopic[] = curriculumData as CurriculumTopic[];

/**
 * searchKnowledge(query) -> CurriculumTopic[]
 * 
 * Searches the Grade 4 Math Curriculum Knowledge Base.
 * Returns relevant curriculum topics based on keyword matching.
 */
export function searchKnowledge(query: string): CurriculumTopic[] {
  if (!query.trim()) return [];

  const queryWords = query.toLowerCase().split(/\s+/);

  return curriculum.filter((topic) => {
    const keywordsLower = topic.keywords.map((k) => k.toLowerCase());
    const descLower = topic.description.toLowerCase();
    const titleLower = topic.topic.toLowerCase();

    return queryWords.some(
      (word) =>
        keywordsLower.some((kw) => kw.includes(word)) ||
        descLower.includes(word) ||
        titleLower.includes(word),
    );
  });
}
