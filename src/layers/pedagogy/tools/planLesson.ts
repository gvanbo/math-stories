import type { LessonPlan, UserProfile } from "@/types";
import { getPedagogyForConcept } from "./getPedagogyForConcept";

/**
 * planLesson(conceptId, userProfile) -> LessonPlan | null
 * Core.md Tool #7
 *
 * Creates a lesson plan by selecting the appropriate CPA stage and
 * differentiation level based on the user's profile.
 */
export function planLesson(
  conceptId: string,
  userProfile: UserProfile,
): LessonPlan | null {
  const pedagogy = getPedagogyForConcept(conceptId);
  if (!pedagogy) return null;

  // Select CPA stage based on modality preferences
  const selectedStage = selectStage(userProfile);

  // Select differentiation level — default to onLevel
  const selectedLevel = selectLevel(userProfile);

  const stage = pedagogy.stages[selectedStage];
  const level = pedagogy.differentiation[selectedLevel];

  return {
    conceptId,
    userId: userProfile.id,
    selectedStage,
    selectedLevel,
    activities: [...stage.activities, ...level.scaffolds],
    checksForUnderstanding: pedagogy.checksForUnderstanding,
    hostNotes: buildHostNotes(conceptId, selectedStage, selectedLevel, userProfile),
  };
}

function selectStage(profile: UserProfile): "concrete" | "pictorial" | "symbolic" {
  if (profile.modalityPrefs.includes("kinesthetic")) return "concrete";
  if (profile.modalityPrefs.includes("visual")) return "pictorial";
  return "symbolic";
}

function selectLevel(
  profile: UserProfile,
): "struggling" | "onLevel" | "advanced" {
  // Default to onLevel; future versions can use session history
  return "onLevel";
}

function buildHostNotes(
  conceptId: string,
  stage: string,
  level: string,
  profile: UserProfile,
): string {
  return [
    `Lesson for concept: ${conceptId}`,
    `CPA stage: ${stage} (based on student modality preferences: ${profile.modalityPrefs.join(", ")})`,
    `Differentiation: ${level}`,
    `Humor level: ${profile.humorLevel}`,
    `Remember: Use at least one visual model and ask at least one comprehension question requiring explanation.`,
  ].join("\n");
}
