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
  type: "equalGroups" | "array" | "numberLine" | "area" | "decomposition";
  description: string;
}

/** A reasoning strategy for a concept */
export interface Strategy {
  id: string;
  name: string;
  type: "doublingHalving" | "makeTen" | "factFamilies";
  description: string;
}

// ---------------------------------------------------------------------------
// Layer 3: Pedagogy
// ---------------------------------------------------------------------------

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
}

export interface StageDescription {
  description: string;
  activities: string[];
  materials: string[];
}

export interface DifferentiationLevel {
  description: string;
  scaffolds: string[];
}

export interface CheckForUnderstanding {
  id: string;
  prompt: string;
  /** Must require explanation, not just an answer */
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

/** A single beat in a story skeleton */
export interface Beat {
  type: BeatType;
  description: string;
  /** Slots that can be filled with student/personalization inputs */
  slots: string[];
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
  characters: DigitCharacter[];
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
  /** Generated narrative text for each beat */
  beatNarratives: BeatNarrative[];
  /** Self-check result (Core.md Section 3 step 5) */
  selfCheck: SelfCheckResult;
  timestamp: string;
}

/** A single beat's generated narrative */
export interface BeatNarrative {
  beatType: BeatType;
  narrative: string;
  /** Models explicitly described in this beat */
  modelsUsed: string[];
  /** Character voices used in this beat */
  characterVoices: string[];
}

/** Result of the agent self-check (Core.md Section 3 step 5) */
export interface SelfCheckResult {
  /** "Explain the math idea this story teaches" */
  mathExplanation: string;
  /** Does the explanation match Concept.models[]? */
  modelsMatch: boolean;
  /** Does the explanation match Concept.strategies[]? */
  strategiesMatch: boolean;
  /** Overall pass/fail */
  passes: boolean;
  /** If failed, what mismatched */
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
  /** Must be a true mathematical property */
  mathRule: string;
  voiceStyle: string;
}

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
