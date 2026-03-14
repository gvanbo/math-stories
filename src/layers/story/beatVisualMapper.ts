import {
  Beat,
  BeatType,
  BeatVisualSpec,
  DigitCharacterFull,
  PedagogyToolId,
  SceneType,
  StoryContext,
} from '../../types';

/**
 * Maps a BeatType to its canonical SceneType for Imagen 3.
 * This is the master lookup that drives every image generation call.
 */
const BEAT_TO_SCENE_TYPE: Record<BeatType, SceneType> = {
  setup: 'wideEstablishingShot',
  groupsIntro: 'manipulativeLayout',
  representation: 'pedagogyToolDiagram',
  reasoning: 'characterThinking',
  generalize: 'celebrationScene',
  reflection: 'closeUpReaction',
};

/**
 * Maps a BeatType to its default mood for Imagen prompt generation.
 */
const BEAT_TO_MOOD: Record<BeatType, BeatVisualSpec['mood']> = {
  setup: 'playful',
  groupsIntro: 'curious',
  representation: 'calm',
  reasoning: 'curious',
  generalize: 'triumphant',
  reflection: 'playful',
};

/**
 * Maps a BeatType to the pedagogy tool most likely to visualise that beat.
 * Only applies to beats that have a natural tool pairing.
 */
const BEAT_TO_PEDAGOGY_TOOL: Partial<Record<BeatType, PedagogyToolId>> = {
  groupsIntro: 'arrayExploration',
  representation: 'barModels',
  reasoning: 'thinkAloud',
  reflection: 'numberTalks',
};

/**
 * Build a complete Imagen 3 prompt for a given beat using character data.
 */
function buildImagenPrompt(
  beatType: BeatType,
  sceneType: SceneType,
  characters: DigitCharacterFull[],
  setting: string,
  mood: BeatVisualSpec['mood']
): string {
  const primaryChar = characters[0];
  if (!primaryChar) {
    return `${sceneType}, Grade 4 math educational illustration, ${mood}, vibrant, safe for children`;
  }

  const styleTagStr = primaryChar.imagenStyleTags.join(', ');
  const propsStr = primaryChar.sceneProps.slice(0, 2).join(' and ');
  const colorStr = primaryChar.colorPalette.join(', ');

  const sceneDescriptions: Record<SceneType, string> = {
    wideEstablishingShot: `wide establishing shot of ${primaryChar.basePrompt} in ${setting}`,
    closeUpReaction: `close-up portrait of ${primaryChar.basePrompt} with a ${beatType === 'reflection' ? 'questioning' : 'surprised'} expression`,
    manipulativeLayout: `${primaryChar.basePrompt} surrounded by ${propsStr} arranged to show groups in ${setting}`,
    diagramVisual: `${primaryChar.basePrompt} pointing to a glowing math diagram in ${setting}`,
    characterThinking: `${primaryChar.basePrompt} in a thinking pose with thought bubbles containing math symbols, ${setting}`,
    celebrationScene: `${primaryChar.basePrompt} celebrating triumphantly in ${setting}, confetti, glowing math symbols`,
    pedagogyToolDiagram: `educational diagram with ${primaryChar.basePrompt} presenting a visual math model, clean layout`,
  };

  const sceneDesc = sceneDescriptions[sceneType] ?? `${primaryChar.basePrompt} in ${setting}`;

  return [
    sceneDesc,
    `colour palette: ${colorStr}`,
    `mood: ${mood}`,
    styleTagStr,
    'Grade 4 math educational illustration',
    'safe for children',
    'no text in image',
  ].join(', ');
}

/**
 * Pure function: maps a single Beat to a BeatVisualSpec using the active characters.
 * This is the core of the visual pipeline — called for every beat before Imagen generation.
 */
export function mapBeatToVisualSpec(
  beat: Beat,
  characters: DigitCharacterFull[],
  setting: string
): BeatVisualSpec {
  const sceneType = BEAT_TO_SCENE_TYPE[beat.type];
  const mood = BEAT_TO_MOOD[beat.type];
  const pedagogyToolId = BEAT_TO_PEDAGOGY_TOOL[beat.type];

  // Use the first two characters for the scene; default to digit 3 (curious) if none
  const activeChars = characters.slice(0, 2);
  const colorPalette =
    activeChars[0]?.colorPalette ?? ['#7C3AED', '#F59E0B', '#10B981'];

  const imagenPrompt = buildImagenPrompt(
    beat.type,
    sceneType,
    activeChars,
    setting,
    mood
  );

  return {
    sceneType,
    characters: activeChars.map(c => c.digit),
    setting,
    colorPalette: [...colorPalette],
    mood,
    imagenPrompt,
    ...(pedagogyToolId ? { pedagogyToolId } : {}),
  };
}

/**
 * Map all personalized beats in a StoryContext to BeatVisualSpecs.
 * Returns the beats array with visualSpec attached to each beat.
 * This enriches the StoryContext before story generation without changing
 * any existing tool signatures — it is purely additive.
 */
export function attachVisualSpecsToBeats(
  context: StoryContext,
  setting: string
): Beat[] {
  return context.personalizedBeats.map(beat => ({
    ...beat,
    visualSpec: mapBeatToVisualSpec(beat, context.characters, setting),
  }));
}

/**
 * Generate a descriptive setting string from a StoryContext's user inputs.
 * Used as the `setting` parameter for all beat visual specs.
 */
export function buildSettingFromContext(context: StoryContext): string {
  const { place, mood } = context.userInputs;
  return `${place} with a ${mood} atmosphere`;
}
