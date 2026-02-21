import type {
  ValidationResult,
  IntegrityCheck,
  Violation,
  Concept,
  StoryContext,
  BeatType,
} from "@/types";

/**
 * Context provided alongside the artifact for validation.
 * The validator needs these to check cross-cutting rules.
 */
export interface ValidationContext {
  outcomeCodes: string[];
  concept: Concept;
}

/** The 6 canonical beat types that must be present */
const REQUIRED_BEATS: BeatType[] = [
  "setup",
  "groupsIntro",
  "representation",
  "reasoning",
  "generalize",
  "reflection",
];

/**
 * validateOutput(artifactType, artifact, context) -> ValidationResult
 * Core.md Section 5 — Integrity Validator
 *
 * Checks all generated output against the 9 integrity rules:
 * 1. Must have 1+ Outcome.code
 * 2. Must have 1+ Concept.models
 * 3. Must have 1+ reasoning step (whyItWorks)
 * 4. Must not rely only on mnemonics
 * 5. Digit character traits must not contradict mathRule
 * 6. Must not skip problem to answer (beat structure complete)
 * 7. Skeleton must have required models
 * 8. Concept must have strategies
 * 9. Personalization must be skin-only
 */
export function validateOutput(
  artifactType: string,
  artifact: StoryContext,
  context: ValidationContext,
): ValidationResult {
  const checks: IntegrityCheck[] = [];
  const violations: Violation[] = [];
  const repairSuggestions: string[] = [];

  // Rule 1: outcome code present
  checkRule(
    checks,
    violations,
    repairSuggestions,
    "outcome-code-present",
    context.outcomeCodes.length > 0,
    context.outcomeCodes.length > 0
      ? `Found ${context.outcomeCodes.length} outcome code(s): ${context.outcomeCodes.join(", ")}`
      : "No outcome codes provided",
    "must-fix",
    "outcome codes",
    "Add at least one valid Outcome.code to tag this lesson/story.",
  );

  // Rule 2: model instantiated
  checkRule(
    checks,
    violations,
    repairSuggestions,
    "model-instantiated",
    context.concept.models.length > 0,
    context.concept.models.length > 0
      ? `Found ${context.concept.models.length} model(s): ${context.concept.models.map((m) => m.name).join(", ")}`
      : "No models found on concept",
    "must-fix",
    "concept.models",
    "Add at least one visualizable model (equalGroups, array, numberLine, etc.) to the concept.",
  );

  // Rule 3: reasoning step present
  checkRule(
    checks,
    violations,
    repairSuggestions,
    "reasoning-step-present",
    context.concept.whyItWorks.length > 0,
    context.concept.whyItWorks
      ? `whyItWorks: "${context.concept.whyItWorks.substring(0, 80)}..."`
      : "No whyItWorks explanation",
    "must-fix",
    "concept.whyItWorks",
    "Add a 'why it works' explanation that is conceptual, not rote memorization.",
  );

  // Rule 4: no mnemonic-only
  const hasMnemonicForbidden = artifact.skeleton.forbiddenPatterns.some(
    (p) => p.toLowerCase().includes("mnemonic"),
  );
  checkRule(
    checks,
    violations,
    repairSuggestions,
    "no-mnemonic-only",
    hasMnemonicForbidden,
    hasMnemonicForbidden
      ? "Skeleton forbids mnemonic-only patterns"
      : "Skeleton does not explicitly forbid mnemonic-only patterns",
    "must-fix",
    "skeleton.forbiddenPatterns",
    'Add "pure mnemonic with no model or reasoning" to forbiddenPatterns.',
  );

  // Rule 5: digit traits consistent
  const allDigitsValid = artifact.characters.every(
    (c) => c.mathRule && c.mathRule.length > 0,
  );
  checkRule(
    checks,
    violations,
    repairSuggestions,
    "digit-traits-consistent",
    allDigitsValid,
    allDigitsValid
      ? `All ${artifact.characters.length} digit characters have valid mathRules`
      : "One or more digit characters have empty or missing mathRules",
    "must-fix",
    "characters[].mathRule",
    "Ensure every DigitCharacter has a mathRule that is a true mathematical property.",
  );

  // Rule 6: beat structure complete
  const beatTypes = new Set(artifact.skeleton.beats.map((b) => b.type));
  const allBeatsPresent = REQUIRED_BEATS.every((bt) => beatTypes.has(bt));
  const missingBeats = REQUIRED_BEATS.filter((bt) => !beatTypes.has(bt));
  checkRule(
    checks,
    violations,
    repairSuggestions,
    "beat-structure-complete",
    allBeatsPresent,
    allBeatsPresent
      ? "All 6 beat types present"
      : `Missing beats: ${missingBeats.join(", ")}`,
    "must-fix",
    "skeleton.beats",
    `Add the missing beat types: ${missingBeats.join(", ")}.`,
  );

  // Rule 7: skeleton models required
  checkRule(
    checks,
    violations,
    repairSuggestions,
    "skeleton-models-required",
    artifact.skeleton.requiredModels.length > 0,
    artifact.skeleton.requiredModels.length > 0
      ? `Required models: ${artifact.skeleton.requiredModels.join(", ")}`
      : "No required models in skeleton",
    "must-fix",
    "skeleton.requiredModels",
    "Add at least one required model to the skeleton's requiredModels array.",
  );

  // Rule 8: strategies present
  checkRule(
    checks,
    violations,
    repairSuggestions,
    "strategies-present",
    context.concept.strategies.length > 0,
    context.concept.strategies.length > 0
      ? `Found ${context.concept.strategies.length} strategy(ies): ${context.concept.strategies.map((s) => s.name).join(", ")}`
      : "No strategies found on concept",
    "must-fix",
    "concept.strategies",
    "Add at least one reasoning strategy (doublingHalving, makeTen, factFamilies, etc.).",
  );

  // Rule 9: personalization skin-only
  // Check that user inputs exist but skeleton structure is intact
  const skeletonIntact =
    artifact.skeleton.beats.length > 0 &&
    artifact.skeleton.requiredModels.length > 0;
  checkRule(
    checks,
    violations,
    repairSuggestions,
    "personalization-skin-only",
    skeletonIntact,
    skeletonIntact
      ? "Skeleton structure intact despite personalization"
      : "Skeleton structure appears compromised",
    "must-fix",
    "storyContext",
    "Ensure personalization only changes skin (setting, style, characters) — never math logic.",
  );

  return {
    valid: violations.length === 0,
    checkedArtifactType: artifactType as ValidationResult["checkedArtifactType"],
    checks,
    violations,
    repairSuggestions: violations.length > 0 ? repairSuggestions : [],
  };
}

/**
 * Helper: evaluates a single rule and records results.
 */
function checkRule(
  checks: IntegrityCheck[],
  violations: Violation[],
  repairs: string[],
  rule: string,
  passes: boolean,
  evidence: string,
  severity: Violation["severity"],
  location: string,
  repairSuggestion: string,
): void {
  checks.push({
    rule,
    status: passes ? "pass" : "fail",
    evidence,
  });

  if (!passes) {
    violations.push({
      rule,
      description: evidence,
      severity,
      location,
    });
    repairs.push(`[${rule}] ${repairSuggestion}`);
  }
}
