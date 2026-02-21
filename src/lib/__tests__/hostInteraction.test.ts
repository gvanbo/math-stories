import { describe, it, expect } from 'vitest';
import {
  HOST_PERSONA,
  FORBIDDEN_TONES,
  buildHostSystemPrompt,
} from '@/lib/hostPersona';
import {
  createInteraction,
  processQuery,
  selectOutcome,
  setUserInputs,
  generateStory,
  startComprehension,
  submitExplanation,
  explainMathGoal,
  verifyToolRouting,
  verifyComprehensionCheck,
} from '@/lib/interactionController';
import { MULTIPLICATION_CONCEPTS } from '@/layers/concept/data/concepts';
import type { UserInputs } from '@/types';

// ---- Host Persona ----

describe('Host Persona', () => {
  it('has the required style traits', () => {
    expect(HOST_PERSONA.style).toContain('funny');
    expect(HOST_PERSONA.style).toContain('kind');
    expect(HOST_PERSONA.style).toContain('high-energy');
  });

  it('targets Grade 4 Alberta audience', () => {
    expect(HOST_PERSONA.audience).toContain('Grade 4');
    expect(HOST_PERSONA.audience).toContain('Alberta');
  });

  it('forbids mean, sarcastic, and condescending tones', () => {
    expect(FORBIDDEN_TONES).toContain('mean');
    expect(FORBIDDEN_TONES).toContain('sarcastic');
    expect(FORBIDDEN_TONES).toContain('condescending');
  });

  it('rules include tool-routing enforcement', () => {
    const hasToolRule = HOST_PERSONA.rules.some((r) =>
      r.toLowerCase().includes('route through tools'),
    );
    expect(hasToolRule).toBe(true);
  });

  it('rules include comprehension question requirement', () => {
    const hasCFURule = HOST_PERSONA.rules.some((r) =>
      r.toLowerCase().includes('comprehension question'),
    );
    expect(hasCFURule).toBe(true);
  });
});

describe('buildHostSystemPrompt', () => {
  it('includes persona name and style', () => {
    const prompt = buildHostSystemPrompt();
    expect(prompt).toContain(HOST_PERSONA.name);
    expect(prompt).toContain('funny');
    expect(prompt).toContain('kind');
    expect(prompt).toContain('high-energy');
  });

  it('includes forbidden tones', () => {
    const prompt = buildHostSystemPrompt();
    for (const tone of FORBIDDEN_TONES) {
      expect(prompt).toContain(tone);
    }
  });

  it('includes concept details when provided', () => {
    const concept = MULTIPLICATION_CONCEPTS[0];
    const prompt = buildHostSystemPrompt(concept);
    expect(prompt).toContain(concept.id);
    expect(prompt).toContain(concept.whyItWorks);
    expect(prompt).toContain('Do NOT invent different math explanations');
  });

  it('includes interaction flow steps', () => {
    const prompt = buildHostSystemPrompt();
    expect(prompt).toContain('Greet the student');
    expect(prompt).toContain('comprehension question');
  });
});

// ---- Interaction Controller ----

const TEST_INPUTS: UserInputs = {
  verbs: ['zoomed', 'launched'],
  nouns: ['rocket', 'asteroid'],
  place: 'a space station',
  mood: 'excited',
  sidekick: 'a robot dog',
};

describe('Interaction Controller — step sequence', () => {
  it('starts in idle state', () => {
    const state = createInteraction('test-user');
    expect(state.step).toBe('idle');
    expect(state.toolCalls).toEqual([]);
  });

  it('processQuery transitions to selecting_outcome', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    expect(state.step).toBe('selecting_outcome');
    expect(state.outcomes.length).toBeGreaterThan(0);
  });

  it('processQuery records tool call', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    expect(state.toolCalls.length).toBe(1);
    expect(state.toolCalls[0].tool).toBe('findOutcomesForQuery');
  });

  it('processQuery stays idle for no results', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'xyznonexistent');
    expect(state.step).toBe('idle');
  });

  it('selectOutcome transitions to explaining_goal', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    state = selectOutcome(state, state.outcomes[0].code);
    expect(state.step).toBe('explaining_goal');
    expect(state.concept).not.toBeNull();
  });

  it('explainMathGoal transitions to gathering_inputs', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    state = selectOutcome(state, state.outcomes[0].code);
    state = explainMathGoal(state);
    expect(state.step).toBe('gathering_inputs');
  });

  it('selectOutcome records getConceptForOutcome call', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    state = selectOutcome(state, state.outcomes[0].code);
    const conceptCall = state.toolCalls.find((tc) => tc.tool === 'getConceptForOutcome');
    expect(conceptCall).toBeDefined();
  });

  it('setUserInputs transitions to generating_story', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    state = selectOutcome(state, state.outcomes[0].code);
    state = explainMathGoal(state);
    state = setUserInputs(state, TEST_INPUTS);
    expect(state.step).toBe('generating_story');
    expect(state.userInputs).toEqual(TEST_INPUTS);
  });

  it('generateStory transitions to narrating', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    state = selectOutcome(state, state.outcomes[0].code);
    state = explainMathGoal(state);
    state = setUserInputs(state, TEST_INPUTS);
    state = generateStory(state);
    expect(state.step).toBe('narrating');
    expect(state.story).not.toBeNull();
  });

  it('generateStory runs integrity validation', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    state = selectOutcome(state, state.outcomes[0].code);
    state = explainMathGoal(state);
    state = setUserInputs(state, TEST_INPUTS);
    state = generateStory(state);
    expect(state.validationResult).not.toBeNull();
    expect(state.validationResult!.valid).toBe(true);
  });

  it('full sequence reaches complete', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    state = selectOutcome(state, state.outcomes[0].code);
    state = explainMathGoal(state);
    state = setUserInputs(state, TEST_INPUTS);
    state = generateStory(state);
    state = startComprehension(state);
    expect(state.step).toBe('comprehension');
    state = submitExplanation(state, 'Multiplication means making equal groups and counting them all.');
    expect(state.step).toBe('complete');
  });
});

// ---- Tool Routing Verification ----

describe('verifyToolRouting', () => {
  it('passes when all required tools have been called', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    state = selectOutcome(state, state.outcomes[0].code);
    state = explainMathGoal(state);
    state = setUserInputs(state, TEST_INPUTS);
    state = generateStory(state);
    const routing = verifyToolRouting(state);
    expect(routing.valid).toBe(true);
    expect(routing.missingTools).toEqual([]);
  });

  it('fails when interaction is incomplete', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    // Did not call selectOutcome or later steps
    const routing = verifyToolRouting(state);
    expect(routing.valid).toBe(false);
    expect(routing.missingTools.length).toBeGreaterThan(0);
  });

  it('records tool sequence in order', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    state = selectOutcome(state, state.outcomes[0].code);
    state = explainMathGoal(state);
    state = setUserInputs(state, TEST_INPUTS);
    state = generateStory(state);
    const routing = verifyToolRouting(state);
    expect(routing.toolSequence[0]).toBe('findOutcomesForQuery');
    expect(routing.toolSequence[1]).toBe('getConceptForOutcome');
    expect(routing.toolSequence[2]).toBe('searchKnowledge');
  });
});

// ---- Comprehension Verification ----

describe('verifyComprehensionCheck', () => {
  it('detects when comprehension question is present', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    state = selectOutcome(state, state.outcomes[0].code);
    state = explainMathGoal(state);
    state = setUserInputs(state, TEST_INPUTS);
    state = generateStory(state);
    const check = verifyComprehensionCheck(state);
    expect(check.hasQuestion).toBe(true);
    expect(check.requiresExplanation).toBe(true);
  });

  it('detects missing student response', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    state = selectOutcome(state, state.outcomes[0].code);
    state = explainMathGoal(state);
    state = setUserInputs(state, TEST_INPUTS);
    state = generateStory(state);
    const check = verifyComprehensionCheck(state);
    expect(check.hasStudentResponse).toBe(false);
  });

  it('detects student response after submission', () => {
    let state = createInteraction('test-user');
    state = processQuery(state, 'multiplication');
    state = selectOutcome(state, state.outcomes[0].code);
    state = explainMathGoal(state);
    state = setUserInputs(state, TEST_INPUTS);
    state = generateStory(state);
    state = startComprehension(state);
    state = submitExplanation(state, 'Groups help us count faster.');
    const check = verifyComprehensionCheck(state);
    expect(check.hasStudentResponse).toBe(true);
  });
});

// ---- 3 Full Interaction Simulations ----

describe('Full Interaction Simulations — 3 diverse sessions', () => {
  const simInputs: UserInputs[] = [
    { verbs: ['dug', 'found'], nouns: ['treasure', 'map'], place: 'a pirate island', mood: 'brave', sidekick: 'a talking parrot' },
    { verbs: ['flew', 'soared'], nouns: ['cloud', 'rainbow'], place: 'a sky kingdom', mood: 'joyful', sidekick: 'a magic owl' },
    { verbs: ['swam', 'explored'], nouns: ['shell', 'pearl'], place: 'an ocean cave', mood: 'curious', sidekick: 'a baby whale' },
  ];

  for (let i = 0; i < 3; i++) {
    it(`Simulation ${i + 1}: ${simInputs[i].place} — full pipeline passes all checks`, () => {
      let state = createInteraction(`sim-user-${i}`);
      state = processQuery(state, 'multiplication');
      state = selectOutcome(state, state.outcomes[0].code);
      state = explainMathGoal(state);
      state = setUserInputs(state, simInputs[i]);
      state = generateStory(state);
      state = startComprehension(state);
      state = submitExplanation(state, 'Multiplication is repeated addition of equal groups.');

      // Step verification
      expect(state.step).toBe('complete');

      // Story generated
      expect(state.story).not.toBeNull();
      expect(state.story!.selfCheck.passes).toBe(true);

      // Integrity validation passes
      expect(state.validationResult).not.toBeNull();
      expect(state.validationResult!.valid).toBe(true);
      expect(state.validationResult!.violations.length).toBe(0);

      // Tool routing is valid
      const routing = verifyToolRouting(state);
      expect(routing.valid).toBe(true);

      // Comprehension check present + answered
      const cfu = verifyComprehensionCheck(state);
      expect(cfu.hasQuestion).toBe(true);
      expect(cfu.requiresExplanation).toBe(true);
      expect(cfu.hasStudentResponse).toBe(true);
    });
  }
});
