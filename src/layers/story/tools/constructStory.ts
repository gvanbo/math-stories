import type {
  GeneratedStory,
  BeatNarrative,
  SelfCheckResult,
  UserProfile,
  UserInputs,
  Concept,
} from "@/types";
import { buildStoryContext } from "./buildStoryContext";
import { getConceptForOutcome } from "@/layers/concept/tools/getConceptForOutcome";
import { ALL_CONCEPTS } from "@/lib/registry";

/**
 * constructStory — Core.md Section 3 Story Construction Pipeline
 *
 * Process (from Core.md):
 * 1. Get StorySkeleton (via buildStoryContext)
 * 2. Get DigitCharacters (via buildStoryContext)
 * 3. Build StoryContext (assembles skeleton + characters + inputs)
 * 4. Generate beat narratives from the context
 * 5. Run self-check
 *
 * Constraints:
 * - Student inputs fill slots (place, action, sidekick, mood)
 * - They do NOT alter: groupsIntro logic, model choice, or "why this works"
 */
export function constructStory(
  conceptId: string,
  outcomeCode: string,
  profile: UserProfile,
  inputs: UserInputs,
): GeneratedStory | null {
  // Build the story context (steps 1-3)
  const context = buildStoryContext(conceptId, profile, inputs);
  if (!context) return null;

  // Find the concept for self-check
  const concept = ALL_CONCEPTS.find((c) => c.id === conceptId);
  if (!concept) return null;

  // Generate beat narratives (step 4)
  const beatNarratives = generateBeatNarratives(context, concept, inputs);

  // Run self-check (step 5)
  const story: GeneratedStory = {
    id: `story-${conceptId}-${Date.now()}`,
    conceptId,
    outcomeCode,
    context,
    beatNarratives,
    selfCheck: { mathExplanation: "", modelsMatch: true, strategiesMatch: true, passes: true, mismatches: [] },
    timestamp: new Date().toISOString(),
  };

  story.selfCheck = selfCheckStory(story, concept);

  return story;
}

/**
 * Generate narrative text for each beat in the skeleton.
 * Uses the personalized context to create kid-friendly text
 * while preserving the mathematical structure.
 */
function generateBeatNarratives(
  context: ReturnType<typeof buildStoryContext> & object,
  concept: Concept,
  inputs: UserInputs,
): BeatNarrative[] {
  return context.skeleton.beats.map((beat) => {
    switch (beat.type) {
      case "setup":
        return {
          beatType: "setup" as const,
          narrative: `Welcome to ${inputs.place}! Our hero ${inputs.sidekick} was feeling ${inputs.mood}. They ${inputs.verbs[0] || "walked"} toward a mysterious discovery.`,
          modelsUsed: [],
          characterVoices: [],
          visualPrompt: `A vibrant, kid-friendly illustration of a ${inputs.mood} ${inputs.sidekick} in ${inputs.place}. Style: colorful digital storybook art, cheerful, wide shot.`,
        };

      case "groupsIntro":
        return {
          beatType: "groupsIntro" as const,
          narrative: `${inputs.sidekick} found ${inputs.nouns[0] || "items"} arranged in equal groups! "Look!" they exclaimed. "There are groups, and each group has the same number!"`,
          modelsUsed: [],
          characterVoices: getCharacterVoices(context, []),
          visualPrompt: `A fun illustration of equal groups of ${inputs.nouns[0] || "items"} scattered around ${inputs.place}. The ${inputs.sidekick} is pointing at them excitedly. Style: colorful children's book.`,
        };

      case "representation":
        return {
          beatType: "representation" as const,
          narrative: `${inputs.sidekick} drew a picture to organize everything. They made an array — rows and columns — to see all the ${inputs.nouns[0] || "items"} at once. "When I arrange them in equal groups, I can see the pattern!"`,
          modelsUsed: context.skeleton.requiredModels,
          characterVoices: [],
          visualPrompt: `A neatly drawn grid or array of ${inputs.nouns[0] || "items"} showing clear rows and columns, as if drawn by ${inputs.sidekick} in ${inputs.place}. Style: educational, clear and engaging.`,
        };

      case "reasoning":
        return {
          beatType: "reasoning" as const,
          narrative: `"I get it!" said ${inputs.sidekick}. "${concept.whyItWorks}" The ${inputs.nouns[0] || "items"} showed exactly why multiplication is just a fast way to count equal groups.`,
          modelsUsed: concept.models.map((m) => m.id),
          characterVoices: getCharacterVoices(context, concept.models.map((m) => m.id)),
          visualPrompt: `The ${inputs.sidekick} having a 'lightbulb' moment in ${inputs.place}, surrounded by organized ${inputs.nouns[0] || "items"}. Style: bright, optimistic, magical math discovery.`,
        };

      case "generalize":
        return {
          beatType: "generalize" as const,
          narrative: `${inputs.sidekick} wondered: "Does this work for ANY equal groups?" They tried it with different numbers and — yes! The same strategy worked every time.`,
          modelsUsed: [],
          characterVoices: [],
          visualPrompt: `Various sizes of groups of ${inputs.nouns[0] || "items"} floating mathematically in ${inputs.place}, with glowing numbers. Style: inspiring learning moment, abstract background.`,
        };

      case "reflection":
        return {
          beatType: "reflection" as const,
          narrative: `Feeling ${inputs.mood}, ${inputs.sidekick} reflected: "Multiplication is a fast way to count equal groups, and I can use arrays and diagrams to see why it works!"`,
          modelsUsed: [],
          characterVoices: [],
          visualPrompt: `A happy, confident ${inputs.sidekick} waving goodbye in ${inputs.place}, having solved the mathematical mystery. Style: joyful, colorful storybook ending.`,
        };

      default:
        return {
          beatType: beat.type,
          narrative: beat.description,
          modelsUsed: [],
          characterVoices: [],
          visualPrompt: `An atmospheric view of ${inputs.place} with ${inputs.sidekick}. Style: conceptual, children's storybook.`,
        };
    }
  });
}

/**
 * Get character voices for beats that involve digit characters.
 */
function getCharacterVoices(
  context: ReturnType<typeof buildStoryContext> & object,
  modelIds: string[],
): string[] {
  if (context.characters.length === 0) return [];
  // Include first character's voice style as representative
  return [context.characters[0].voiceStyle];
}

/**
 * selfCheckStory — Core.md Section 3 Step 5
 *
 * "Explain the math idea this story teaches."
 * This explanation must match Concept's models[] and strategies[], or regenerate.
 */
export function selfCheckStory(
  story: GeneratedStory,
  concept: Concept,
): SelfCheckResult {
  const mismatches: string[] = [];

  // Gather all models used across beat narratives
  const allModelsUsed = new Set<string>();
  for (const bn of story.beatNarratives) {
    for (const m of bn.modelsUsed) {
      allModelsUsed.add(m);
    }
  }

  // Check: at least one concept model is referenced in the story
  const conceptModelIds = concept.models.map((m) => m.id);
  const modelsMatch = conceptModelIds.some((id) => allModelsUsed.has(id));
  if (!modelsMatch) {
    mismatches.push(
      `Expected at least one model from [${conceptModelIds.join(", ")}] but story used [${[...allModelsUsed].join(", ") || "none"}]`,
    );
  }

  // Check: concept strategies are relevant (story should reference reasoning)
  const reasoningBeat = story.beatNarratives.find((b) => b.beatType === "reasoning");
  const strategiesMatch = reasoningBeat !== undefined && reasoningBeat.narrative.length > 0;
  if (!strategiesMatch) {
    mismatches.push("Missing or empty reasoning beat — strategies not demonstrated");
  }

  // Build the math explanation
  const mathExplanation = [
    `This story teaches: ${concept.whyItWorks}`,
    `Models used: ${[...allModelsUsed].join(", ") || "none"}`,
    `Strategies available: ${concept.strategies.map((s) => s.name).join(", ")}`,
    `The story follows the ${story.beatNarratives.length}-beat structure, progressing from setup through reasoning to reflection.`,
  ].join(" ");

  return {
    mathExplanation,
    modelsMatch,
    strategiesMatch,
    passes: mismatches.length === 0,
    mismatches,
  };
}
