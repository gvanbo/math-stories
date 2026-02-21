import type { Outcome, Concept, UserProfile, UserInputs, GeneratedStory, StoryContext, CheckForUnderstanding } from '@/types';
import { findOutcomesForQuery } from '@/layers/curriculum/tools/findOutcomesForQuery';
import { searchKnowledge } from '@/knowledge/tools/searchKnowledge';
import { getConceptForOutcome } from '@/layers/concept/tools/getConceptForOutcome';
import { getPedagogyForConcept } from '@/layers/pedagogy/tools/getPedagogyForConcept';
import { constructStory } from '@/layers/story/tools/constructStory';
import { getUserProfile } from '@/layers/personalization/tools/feedback';
import { validateOutput } from '@/validation/validateOutput';
import type { ValidationContext } from '@/validation/validateOutput';

/**
 * Interaction Sequence — Core.md Section 4
 *
 * Every live session follows this exact flow:
 * 1. Student query (typed or spoken)
 * 2. Host calls findOutcomesForQuery → getConcept → states concept
 * 3. Host gathers student inputs (verbs, nouns, etc.)
 * 4. Host calls constructStory → narrates story
 * 5. Host asks comprehension question requiring explanation
 * 6. Optional: summarize student understanding
 *
 * RULE: All sessions must route through tools; host never freewheels.
 */

export type InteractionStep =
  | 'idle'
  | 'querying'
  | 'selecting_outcome'
  | 'explaining_goal'
  | 'gathering_inputs'
  | 'generating_story'
  | 'streaming'
  | 'narrating'
  | 'comprehension'
  | 'complete';

export interface InteractionState {
  step: InteractionStep;
  query: string | null;
  outcomes: Outcome[];
  selectedOutcome: Outcome | null;
  concept: Concept | null;
  userProfile: UserProfile;
  userInputs: UserInputs | null;
  story: GeneratedStory | null;
  comprehensionQuestion: CheckForUnderstanding | null;
  studentExplanation: string | null;
  /** Audit trail: which tools were called and in what order */
  toolCalls: ToolCall[];
  /** Validation result from Integrity Validator */
  validationResult: ReturnType<typeof validateOutput> | null;
}

export interface ToolCall {
  tool: string;
  input: string;
  output: string;
  timestamp: string;
}

/**
 * Creates a new interaction state.
 */
export function createInteraction(userId: string): InteractionState {
  return {
    step: 'idle',
    query: null,
    outcomes: [],
    selectedOutcome: null,
    concept: null,
    userProfile: getUserProfile(userId),
    userInputs: null,
    story: null,
    comprehensionQuestion: null,
    studentExplanation: null,
    toolCalls: [],
    validationResult: null,
  };
}

/**
 * Step 1: Process student query.
 * MUST call findOutcomesForQuery — never freewheel.
 */
export function processQuery(state: InteractionState, query: string): InteractionState {
  const outcomes = findOutcomesForQuery(query);
  const toolCall: ToolCall = {
    tool: 'findOutcomesForQuery',
    input: query,
    output: `Found ${outcomes.length} outcome(s)`,
    timestamp: new Date().toISOString(),
  };

  return {
    ...state,
    step: outcomes.length > 0 ? 'selecting_outcome' : 'idle',
    query,
    outcomes,
    toolCalls: [...state.toolCalls, toolCall],
  };
}

/**
 * Step 2: Select outcome and get concept.
 * MUST call getConceptForOutcome — never freewheel.
 */
export function selectOutcome(state: InteractionState, outcomeCode: string): InteractionState {
  const outcome = state.outcomes.find((o) => o.code === outcomeCode);
  if (!outcome) return state;

  const concept = getConceptForOutcome(outcomeCode);
  const toolCall: ToolCall = {
    tool: 'getConceptForOutcome',
    input: outcomeCode,
    output: concept ? `Concept: ${concept.id}` : 'No concept found',
    timestamp: new Date().toISOString(),
  };

  return {
    ...state,
    step: concept ? 'explaining_goal' : 'selecting_outcome',
    selectedOutcome: outcome,
    concept,
    toolCalls: [...state.toolCalls, toolCall],
  };
}

/**
 * Step 2.5: Explain Math Goal using Knowledge Repository
 */
export function explainMathGoal(state: InteractionState): InteractionState {
  if (!state.selectedOutcome) return state;

  const topics = searchKnowledge(state.selectedOutcome.description);
  const toolCall: ToolCall = {
    tool: 'searchKnowledge',
    input: state.selectedOutcome.description,
    output: topics.length > 0 ? `Found topic: ${topics[0].topic}` : 'No topic found',
    timestamp: new Date().toISOString(),
  };

  return {
    ...state,
    step: 'gathering_inputs',
    toolCalls: [...state.toolCalls, toolCall],
  };
}

/**
 * Step 3: Gather student inputs.
 */
export function setUserInputs(state: InteractionState, inputs: UserInputs): InteractionState {
  return {
    ...state,
    step: 'generating_story',
    userInputs: inputs,
  };
}

/**
 * Step 4: Generate story.
 * MUST call constructStory — never freewheel.
 */
export function generateStory(state: InteractionState): InteractionState {
  if (!state.concept || !state.selectedOutcome || !state.userInputs) return state;

  const story = constructStory(
    state.concept.id,
    state.selectedOutcome.code,
    state.userProfile,
    state.userInputs,
  );

  const toolCall: ToolCall = {
    tool: 'constructStory',
    input: `${state.concept.id}, ${state.selectedOutcome.code}`,
    output: story ? `Story: ${story.id}` : 'Generation failed',
    timestamp: new Date().toISOString(),
  };

  // Get comprehension question from pedagogy
  const pedagogy = getPedagogyForConcept(state.concept.id);
  const comprehensionQuestion = pedagogy?.checksForUnderstanding.find(
    (c) => c.requiresExplanation,
  ) ?? null;

  // Run integrity validation
  let validationResult = null;
  if (story) {
    const validationContext: ValidationContext = {
      outcomeCodes: [state.selectedOutcome.code],
      concept: state.concept,
    };
    validationResult = validateOutput('story', story.context, validationContext);
  }

  return {
    ...state,
    step: story ? 'narrating' : 'generating_story',
    story,
    comprehensionQuestion,
    validationResult,
    toolCalls: [
      ...state.toolCalls,
      toolCall,
      {
        tool: 'getPedagogyForConcept',
        input: state.concept.id,
        output: comprehensionQuestion ? `CFU: ${comprehensionQuestion.id}` : 'No CFU found',
        timestamp: new Date().toISOString(),
      },
      {
        tool: 'validateOutput',
        input: story?.id ?? 'none',
        output: validationResult?.valid ? 'PASS' : 'FAIL',
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

/**
 * Step 5: Move to comprehension question.
 */
export function startComprehension(state: InteractionState): InteractionState {
  return {
    ...state,
    step: 'comprehension',
  };
}

/**
 * Transition to streaming state during Gemini Live API sessions.
 */
export function startStreaming(state: InteractionState): InteractionState {
  return {
    ...state,
    step: 'streaming',
  };
}

/**
 * Step 6: Record student explanation and complete.
 */
export function submitExplanation(state: InteractionState, explanation: string): InteractionState {
  return {
    ...state,
    step: 'complete',
    studentExplanation: explanation,
  };
}

/**
 * Verify that the interaction followed proper tool routing.
 * Core.md Section 4 Rule: All sessions must route through tools.
 */
export function verifyToolRouting(state: InteractionState): {
  valid: boolean;
  missingTools: string[];
  toolSequence: string[];
} {
  const requiredTools = [
    'findOutcomesForQuery',
    'getConceptForOutcome',
    'searchKnowledge',
    'constructStory',
    'getPedagogyForConcept',
    'validateOutput',
  ];

  const calledTools = state.toolCalls.map((tc) => tc.tool);
  const missingTools = requiredTools.filter((t) => !calledTools.includes(t));

  return {
    valid: missingTools.length === 0,
    missingTools,
    toolSequence: calledTools,
  };
}

/**
 * Verify the comprehension question requires explanation.
 * Core.md Section 4: Host asks student to explain the idea back.
 */
export function verifyComprehensionCheck(state: InteractionState): {
  hasQuestion: boolean;
  requiresExplanation: boolean;
  hasStudentResponse: boolean;
} {
  return {
    hasQuestion: state.comprehensionQuestion !== null,
    requiresExplanation: state.comprehensionQuestion?.requiresExplanation ?? false,
    hasStudentResponse: state.studentExplanation !== null && state.studentExplanation.length > 0,
  };
}
