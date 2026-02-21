import type { StoryContext, UserProfile, UserInputs } from "@/types";
import { getStorySkeleton } from "./getStorySkeleton";
import { getDigitCharacters } from "@/layers/characters/tools/getDigitCharacters";

/**
 * buildStoryContext(conceptId, userProfile, userInputs) -> StoryContext | null
 * Core.md Tool #6
 *
 * Assembles a complete story context by combining:
 * - StorySkeleton (from concept)
 * - DigitCharacters (relevant to the concept's models)
 * - UserInputs (skin-only: verbs, nouns, place, mood, sidekick)
 * - Narrative prompt (assembled from all the above)
 *
 * Key invariant: personalization changes skin only, never math logic (Core.md Section 1 Rule 6).
 */
export function buildStoryContext(
  conceptId: string,
  userProfile: UserProfile,
  userInputs: UserInputs,
): StoryContext | null {
  const skeleton = getStorySkeleton(conceptId);
  if (!skeleton) return null;

  // Select digit characters based on concept context
  // For multiplication, we typically need at least the factors being used
  const relevantDigits = [2, 3, 4, 5, 6, 7];
  const characters = getDigitCharacters(relevantDigits);

  // Personalize beats — fill slots with user inputs (skin only)
  const personalizedBeats = skeleton.beats.map((beat) => ({
    ...beat,
    description: applySlots(beat.description, beat.slots, userInputs),
  }));

  // Build narrative prompt
  const narrativePrompt = buildNarrativePrompt(
    skeleton,
    characters,
    userInputs,
    userProfile,
  );

  return {
    conceptId,
    skeleton, // Original skeleton preserved (math logic unchanged)
    characters,
    userInputs,
    personalizedBeats,
    narrativePrompt,
  };
}

/**
 * Fills slot placeholders in a beat description with user-provided values.
 * This is where "skin-only" personalization happens — the beat structure
 * and math logic remain unchanged.
 */
function applySlots(
  description: string,
  slots: string[],
  inputs: UserInputs,
): string {
  let result = description;

  const slotValues: Record<string, string> = {
    setting: inputs.place,
    character_name: inputs.sidekick,
    mood: inputs.mood,
    place: inputs.place,
    sidekick: inputs.sidekick,
    reflection_feeling: inputs.mood,
    challenge_context: `${inputs.nouns[0] || "problem"} challenge`,
    favorite_strategy: inputs.verbs[0] || "strategy",
  };

  for (const slot of slots) {
    if (slotValues[slot]) {
      result = result.replace(
        new RegExp(`\\{${slot}\\}`, "g"),
        slotValues[slot],
      );
    }
  }

  return result;
}

/**
 * Builds the narrative prompt that an AI host would use to generate the story.
 * Combines skeleton structure, character voices, and personalization.
 */
function buildNarrativePrompt(
  skeleton: StoryContext["skeleton"],
  characters: StoryContext["characters"],
  inputs: UserInputs,
  profile: UserProfile,
): string {
  const characterIntros = characters
    .map((c) => `${c.digit} (${c.trait}, speaks ${c.voiceStyle})`)
    .join("; ");

  const beatOutline = skeleton.beats
    .map((b, i) => `${i + 1}. [${b.type}] ${b.description}`)
    .join("\n");

  return [
    `STORY CONTEXT:`,
    `Setting: ${inputs.place}`,
    `Mood: ${inputs.mood}`,
    `Sidekick: ${inputs.sidekick}`,
    `Action words: ${inputs.verbs.join(", ")}`,
    `Props: ${inputs.nouns.join(", ")}`,
    `Student humor level: ${profile.humorLevel}`,
    ``,
    `CHARACTERS: ${characterIntros}`,
    ``,
    `REQUIRED MODELS: ${skeleton.requiredModels.join(", ")}`,
    ``,
    `BEAT SEQUENCE:`,
    beatOutline,
    ``,
    `FORBIDDEN: ${skeleton.forbiddenPatterns.join("; ")}`,
  ].join("\n");
}
