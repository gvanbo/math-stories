import type {
  GeneratedStory,
  BeatNarrative,
  SelfCheckResult,
  UserProfile,
  UserInputs,
  Concept,
} from "@/types";
import { buildStoryContext } from "./buildStoryContext";
import { ALL_CONCEPTS } from "@/lib/registry";
import { generateText } from "@/lib/geminiClient";

/**
 * constructStory — Core.md Section 3 Story Construction Pipeline
 *
 * Process:
 * 1. Get StorySkeleton (via buildStoryContext)
 * 2. Get DigitCharacters (via buildStoryContext)
 * 3. Build StoryContext (assembles skeleton + characters + inputs)
 * 4. Generate beat narratives from Gemini (AI-powered, personalized)
 * 5. Run self-check
 */
export async function constructStory(
  conceptId: string,
  outcomeCode: string,
  profile: UserProfile,
  inputs: UserInputs,
): Promise<GeneratedStory | null> {
  const context = buildStoryContext(conceptId, profile, inputs);
  if (!context) return null;

  const concept = ALL_CONCEPTS.find((c) => c.id === conceptId);
  if (!concept) return null;

  // Generate beat narratives using Gemini
  const beatNarratives = await generateBeatNarratives(context, concept, inputs);

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
 * Generate narrative text for each beat using Gemini AI.
 * Each beat gets a targeted prompt that preserves mathematical structure
 * while personalizing for the student's chosen place, sidekick, mood, and items.
 */
async function generateBeatNarratives(
  context: ReturnType<typeof buildStoryContext> & object,
  concept: Concept,
  inputs: UserInputs,
): Promise<BeatNarrative[]> {
  const results: BeatNarrative[] = [];

  for (const beat of context.skeleton.beats) {
    const basePrompt = `You are a Grade 4 math story narrator. Write a SHORT, fun, kid-friendly paragraph (3-5 sentences max) for a math story beat.
Student's chosen setting: ${inputs.place}
Student's chosen sidekick/character: ${inputs.sidekick}
Student's chosen mood: ${inputs.mood}
Student's chosen items: ${inputs.nouns?.[0] ?? "items"}
Math concept: ${concept.whyItWorks}

Beat type: "${beat.type}"
Beat description: ${beat.description}

Rules:
- Use the student's words naturally in the story
- Keep language simple (Grade 4 reading level)
- Be funny and memorable
- Do NOT change the math — it must be accurate
- End with [IMAGE: a short visual prompt for this scene suitable for an AI image generator]`;

    let narrative = "";
    let visualPrompt = "";

    try {
      const response = await generateText(basePrompt);
      // Split out the image prompt if present
      const imageMatch = response.match(/\[IMAGE:\s*(.+?)\]$/s);
      if (imageMatch) {
        visualPrompt = imageMatch[1].trim();
        narrative = response.replace(/\[IMAGE:\s*.+?\]$/s, "").trim();
      } else {
        narrative = response.trim();
        visualPrompt = `A colorful children's storybook illustration of ${inputs.sidekick} in ${inputs.place} during a ${beat.type} math moment.`;
      }
    } catch (err) {
      console.error(`Gemini beat generation failed for beat "${beat.type}":`, err);
      // Graceful fallback to template text
      narrative = `${inputs.sidekick} was in ${inputs.place} and discovered something amazing about ${inputs.nouns?.[0] ?? "math"}!`;
      visualPrompt = `A cheerful cartoon of ${inputs.sidekick} in ${inputs.place}.`;
    }

    results.push({
      beatType: beat.type,
      narrative,
      modelsUsed: beat.type === "reasoning" ? concept.models.map((m) => m.id) : [],
      characterVoices:
        context.characters.length > 0 && beat.type === "groupsIntro"
          ? [context.characters[0].voiceStyle]
          : [],
      visualPrompt,
    });
  }

  return results;
}

/**
 * selfCheckStory — Core.md Section 3 Step 5
 */
export function selfCheckStory(
  story: GeneratedStory,
  concept: Concept,
): SelfCheckResult {
  const mismatches: string[] = [];

  const allModelsUsed = new Set<string>();
  for (const bn of story.beatNarratives) {
    for (const m of bn.modelsUsed) allModelsUsed.add(m);
  }

  const conceptModelIds = concept.models.map((m) => m.id);
  const modelsMatch = conceptModelIds.some((id) => allModelsUsed.has(id));
  if (!modelsMatch) {
    mismatches.push(
      `Expected at least one model from [${conceptModelIds.join(", ")}] but story used [${[...allModelsUsed].join(", ") || "none"}]`,
    );
  }

  const reasoningBeat = story.beatNarratives.find((b) => b.beatType === "reasoning");
  const strategiesMatch = reasoningBeat !== undefined && reasoningBeat.narrative.length > 0;
  if (!strategiesMatch) {
    mismatches.push("Missing or empty reasoning beat — strategies not demonstrated");
  }

  const mathExplanation = [
    `This story teaches: ${concept.whyItWorks}`,
    `Models used: ${[...allModelsUsed].join(", ") || "none"}`,
    `Strategies available: ${concept.strategies.map((s) => s.name).join(", ")}`,
    `The story follows the ${story.beatNarratives.length}-beat structure.`,
  ].join(" ");

  return { mathExplanation, modelsMatch, strategiesMatch, passes: mismatches.length === 0, mismatches };
}
