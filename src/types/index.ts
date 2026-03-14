// =============================================================================
// Math Stories WebApp — Shared Types
// Source of truth: Math Stories WebApp Core.md
// =============================================================================

// ---------------------------------------------------------------------------
// Layer 1: Curriculum
// ---------------------------------------------------------------------------

/** Alberta Grade 4 math curriculum outcome */
export interface Outcome {
  code: string;
  strand: string;
  description: string;
  keywords: string[];
  grade: number;
}

// ---------------------------------------------------------------------------
// Layer 2: Concept Logic
// ---------------------------------------------------------------------------

/** A mathematical concept mapped to a curriculum outcome */
export interface Concept {
  id: string;
  outcomeCode: string;
  models: Model[];
  strategies: Strategy[];
  whyItWorks: string;
}

/** A visualizable mathematical model */
export interface Model {
  id: string;
  name: string;
  type:
    | "equalGroups"
    | "array"
    | "numberLine"
    | "area"
    | "decomposition"
    | "barModel"
    | "numberTalk"
    | "arrayExploration"
    | "numberlineJourney"
    | "errorAnalysis"
    | "whichOneDoesntBelong"
    | "anchorTask";
  description: string;
}

/** A reasoning strategy for a concept */
export interface Strategy {
  id: string;
  name: string;
  type:
    | "doublingHalving"
    | "makeTen"
    | "factFamilies"
    | "thinkAloud"
    | "metacognition"
    | "errorDetection"
    | "openMiddle";
  description: string;
}

// ---------------------------------------------------------------------------
// Layer 3: Pedagogy
// ---------------------------------------------------------------------------

/** Interaction mode for a pedagogy tool */
export type PedagogyInteractionType =
  | "studentInput"
  | "hostDemonstration"
  | "collaborative";

/** Reference to a pedagogy tool by its id */
export type PedagogyToolId =
  | "numberTalks"
  | "barModels"
  | "arrayExploration"
  | "numberlineJourneys"
  | "thinkAloud"
  | "errorAnalysis"
  | "whichOneDoesntBelong"
  | "anchorTask"
  | "cpa";

/** Scene types for Imagen 3 generation */
export type SceneType =
  | "wideEstablishingShot"
  | "closeUpReaction"
  | "manipulativeLayout"
  | "diagramVisual"
  | "characterThinking"
  | "celebrationScene"
  | "pedagogyToolDiagram";

/** Expression variants for character portraits */
export type ExpressionType =
  | "happy"
  | "confused"
  | "triumphant"
  | "thinking"
  | "surprised"
  | "encouraging";

/** Pedagogical plan for teaching a concept */
export interface PedagogyPlan {
  conceptId: string;
  stages: {
    concrete: StageDescription;
    pictorial: StageDescription;
    symbolic: StageDescription;
  };
  differentiation: {
    struggling: DifferentiationLevel;
    onLevel: DifferentiationLevel;
    advanced: DifferentiationLevel;
  };
  checksForUnderstanding: CheckForUnderstanding[];
  toolSelection: {
    concrete: PedagogyToolId[];
    pictorial: PedagogyToolId[];
    symbolic: PedagogyToolId[];
  };
}

export interface StageDescription {
  description: string;
  activities: string[];
  materials: string[];
  toolIds?: PedagogyToolId[];
}

export interface DifferentiationLevel {
  description: string;
  scaffolds: string[];
}

export interface CheckForUnderstanding {
  id: string;
  prompt: string;
  requiresExplanation: boolean;
  expectedResponse: string;
}

/** A complete lesson plan using pedagogy + personalization */
export interface LessonPlan {
  conceptId: string;
  userId: string;
  selectedStage: "concrete" | "pictorial" | "symbolic";
  selectedLevel: "struggling" | "onLevel" | "advanced";
  activities: string[];
  checksForUnderstanding: CheckForUnderstanding[];
  hostNotes: string;
}

/** A pedagogical tool definition */
export interface PedagogyTool {
  id: PedagogyToolId;
  name: string;
  category: "concrete" | "pictorial" | "symbolic" | "metacognitive";
  gradeAppropriateness: string;
  hostScript: string;
  interactionType: PedagogyInteractionType;
  imagenSceneType: SceneType;
  mathAreas: string[];
}

// ---------------------------------------------------------------------------
// Layer 4: Story Logic
// ---------------------------------------------------------------------------

/** The beat types that define story structure */
export type BeatType =
  | "setup"
  | "groupsIntro"
  | "representation"
  | "reasoning"
  | "generalize"
  | "reflection";

/** Full specification for generating an Imagen 3 scene */
export interface BeatVisualSpec {
  sceneType: SceneType;
  characters: number[];
  setting: string;
  colorPalette: string[];
  mood: "playful" | "curious" | "triumphant" | "calm" | "dramatic";
  imagenPrompt: string;
  pedagogyToolId?: PedagogyToolId;
}

/** Cache key for a generated scene image */
export interface ImageCacheKey {
  characterId: number;
  beatType: BeatType;
  conceptId: string;
}

/** A generated scene image with cache metadata */
export interface SceneImage {
  beatType: BeatType;
  characterId: number;
  conceptId: string;
  imageUrl: string;
  gcsCacheKey: string;
  generatedAt: string;
  sceneType: SceneType;
  prompt: string;
}

/** A single beat in a story skeleton */
export interface Beat {
  type: BeatType;
  description: string;
  slots: string[];
  visualSpec?: BeatVisualSpec;
}

/** A story skeleton encoding a concept */
export interface StorySkeleton {
  conceptId: string;
  beats: Beat[];
  requiredModels: string[];
  forbiddenPatterns: string[];
}

/** Fully assembled story context with personalization applied */
export interface StoryContext {
  conceptId: string;
  skeleton: StorySkeleton;
  characters: DigitCharacterFull[];
  userInputs: UserInputs;
  personalizedBeats: Beat[];
  narrativePrompt: string;
}

/** A fully generated story from the construction pipeline */
export interface GeneratedStory {
  id: string;
  conceptId: string;
  outcomeCode: string;
  context: StoryContext;
  beatNarratives: BeatNarrative[];
  selfCheck: SelfCheckResult;
  timestamp: string;
}

/** A single beat's generated narrative */
export interface BeatNarrative {
  beatType: BeatType;
  narrative: string;
  modelsUsed: string[];
  characterVoices: string[];
  visualSpec?: BeatVisualSpec;
  sceneImage?: SceneImage;
}

/** Result of the agent self-check (Core.md Section 3 step 5) */
export interface SelfCheckResult {
  mathExplanation: string;
  modelsMatch: boolean;
  strategiesMatch: boolean;
  passes: boolean;
  mismatches: string[];
}

/** Student-provided Mad-Libs inputs */
export interface UserInputs {
  verbs: string[];
  nouns: string[];
  place: string;
  mood: string;
  sidekick: string;
}

// ---------------------------------------------------------------------------
// Layer 5: Characters & Artifacts
// ---------------------------------------------------------------------------

/** A digit character (0-9) with math-accurate traits */
export interface DigitCharacter {
  digit: number;
  trait: string;
  mathRule: string;
  voiceStyle: string;
}

/** Expression variant prompt suffixes for portrait generation */
export interface CharacterExpressions {
  happy: string;
  confused: string;
  triumphant: string;
  thinking: string;
  surprised: string;
  encouraging: string;
}

/** Full visual model for Imagen 3 character generation */
export interface DigitCharacterVisual {
  basePrompt: string;
  colorPalette: [string, string, string];
  expressions: CharacterExpressions;
  sceneProps: string[];
  animationCue: string;
  imagenStyleTags: string[];
  archetype: string;
}

/** Complete character data combining identity and visual model */
export type DigitCharacterFull = DigitCharacter & DigitCharacterVisual;

/** A visual/interactive artifact */
export interface Artifact {
  id: string;
  type: "character" | "animationTemplate" | "visualPromptCue";
  description: string;
}

// ---------------------------------------------------------------------------
// Layer 6: Personalization
// ---------------------------------------------------------------------------

/** Student profile for personalization */
export interface UserProfile {
  id: string;
  preferences: Record<string, string>;
  readingLevel: string;
  humorLevel: "low" | "medium" | "high";
  modalityPrefs: ("visual" | "auditory" | "kinesthetic")[];
}

/** Session data for a student interaction */
export interface SessionData {
  userId: string;
  conceptId: string;
  storyId: string;
  feedback: Feedback | null;
}

/** Feedback from a student session */
export interface Feedback {
  sessionId: string;
  rating: number;
  enjoyedMost: string;
  foundHardest: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Integrity Validation (Cross-cutting)
// ---------------------------------------------------------------------------

/** Result of the Integrity Validator checking an output */
export interface ValidationResult {
  valid: boolean;
  checkedArtifactType: "story" | "lesson" | "concept" | "skeleton" | "storyContext";
  checks: IntegrityCheck[];
  violations: Violation[];
  repairSuggestions: string[];
}

export interface IntegrityCheck {
  rule: string;
  status: "pass" | "fail";
  evidence: string;
}

export interface Violation {
  rule: string;
  description: string;
  severity: "must-fix" | "should-fix";
  location: string;
}
