/**
 * Unified Data Registry — Core.md Section 6 Expansion Protocol
 *
 * This registry combines all topic data into a single searchable collection.
 * Adding a new topic = adding new data files and importing them here.
 * No tool or architecture changes needed.
 */

import type { Outcome, Concept, PedagogyPlan, StorySkeleton } from "@/types";

// Multiplication
import { MULTIPLICATION_OUTCOMES } from "@/layers/curriculum/data/outcomes";
import { MULTIPLICATION_CONCEPTS } from "@/layers/concept/data/concepts";
import { MULTIPLICATION_PEDAGOGY } from "@/layers/pedagogy/data/pedagogy";
import { MULTIPLICATION_SKELETONS } from "@/layers/story/data/skeletons";

// Division
import { DIVISION_OUTCOMES } from "@/layers/curriculum/data/divisionOutcomes";
import { DIVISION_CONCEPTS } from "@/layers/concept/data/divisionConcepts";
import { DIVISION_PEDAGOGY } from "@/layers/pedagogy/data/divisionPedagogy";
import { DIVISION_SKELETONS } from "@/layers/story/data/divisionSkeletons";

// Fractions
import { FRACTIONS_OUTCOMES } from "@/layers/curriculum/data/fractionsOutcomes";
import { FRACTIONS_CONCEPTS } from "@/layers/concept/data/fractionsConcepts";
import { FRACTIONS_PEDAGOGY } from "@/layers/pedagogy/data/fractionsPedagogy";
import { FRACTIONS_SKELETONS } from "@/layers/story/data/fractionsSkeletons";

/** All outcomes across all topics */
export const ALL_OUTCOMES: Outcome[] = [
  ...MULTIPLICATION_OUTCOMES,
  ...DIVISION_OUTCOMES,
  ...FRACTIONS_OUTCOMES,
];

/** All concepts across all topics */
export const ALL_CONCEPTS: Concept[] = [
  ...MULTIPLICATION_CONCEPTS,
  ...DIVISION_CONCEPTS,
  ...FRACTIONS_CONCEPTS,
];

/** All pedagogy plans across all topics */
export const ALL_PEDAGOGY: PedagogyPlan[] = [
  ...MULTIPLICATION_PEDAGOGY,
  ...DIVISION_PEDAGOGY,
  ...FRACTIONS_PEDAGOGY,
];

/** All story skeletons across all topics */
export const ALL_SKELETONS: StorySkeleton[] = [
  ...MULTIPLICATION_SKELETONS,
  ...DIVISION_SKELETONS,
  ...FRACTIONS_SKELETONS,
];
