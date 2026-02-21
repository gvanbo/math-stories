import type { StorySkeleton } from "@/types";

/**
 * Story skeletons for multiplication concepts.
 * Each skeleton follows the 6-beat structure (Core.md Section 3) and
 * mandates at least one required model while forbidding pure-mnemonic patterns (Core.md Section 1 Rule 4).
 */
export const MULTIPLICATION_SKELETONS: StorySkeleton[] = [
  {
    conceptId: "mult-equal-groups",
    beats: [
      {
        type: "setup",
        description:
          "Introduce the setting and the character's problem. The character needs to count or organize something into equal groups.",
        slots: ["setting", "character_name", "mood"],
      },
      {
        type: "groupsIntro",
        description:
          "The character discovers items naturally arranged in equal groups. The number of groups and the size of each group are made explicit.",
        slots: ["item_type", "group_count", "items_per_group"],
      },
      {
        type: "representation",
        description:
          "The character creates a visual model (array or grouping diagram) to organize the items. The model must be described concretely.",
        slots: ["model_description_verb"],
      },
      {
        type: "reasoning",
        description:
          "The character explains WHY the model shows the total. They connect groups × items_per_group = total, and explore what happens if the groups are rearranged.",
        slots: ["reasoning_exclamation"],
      },
      {
        type: "generalize",
        description:
          "The character discovers the general rule: this strategy works for any number of equal groups. They try it with a new example.",
        slots: ["new_example_setting"],
      },
      {
        type: "reflection",
        description:
          "The character reflects on what they learned: multiplication is a faster way to count equal groups, and models make the math visible.",
        slots: ["reflection_feeling"],
      },
    ],
    requiredModels: ["model-equal-groups", "model-array"],
    forbiddenPatterns: [
      "Pure mnemonic with no model or reasoning",
      "Telling the answer without showing a model",
      "Skipping the reasoning beat",
      "Using the word 'just memorize'",
    ],
  },
  {
    conceptId: "mult-mental-strategies",
    beats: [
      {
        type: "setup",
        description:
          "The character faces a multiplication challenge that is too hard to solve by counting one-by-one. They need a faster strategy.",
        slots: ["setting", "character_name", "challenge_context"],
      },
      {
        type: "groupsIntro",
        description:
          "The character identifies the factors and considers which mental strategy to use. They examine the numbers for 'friendly' properties (near 10, even, known doubles).",
        slots: ["factor_a", "factor_b"],
      },
      {
        type: "representation",
        description:
          "The character draws a number line or decomposition diagram to visualize their chosen strategy. Each step is shown as a labeled jump or section.",
        slots: ["strategy_name", "diagram_description"],
      },
      {
        type: "reasoning",
        description:
          "The character explains WHY the strategy gives the correct answer. They connect it to the distributive property or doubling/halving equivalence.",
        slots: ["why_it_works_phrase"],
      },
      {
        type: "generalize",
        description:
          "The character tries the same strategy on a new, harder problem. They compare it to another strategy and discuss when each is most useful.",
        slots: ["harder_problem", "alternative_strategy"],
      },
      {
        type: "reflection",
        description:
          "The character reflects on having a toolkit of strategies. Different strategies work better for different numbers, and understanding WHY helps you choose.",
        slots: ["favorite_strategy", "reflection_feeling"],
      },
    ],
    requiredModels: ["model-number-line", "model-decomposition"],
    forbiddenPatterns: [
      "Pure mnemonic with no model or reasoning",
      "Saying 'just use the trick' without explaining why it works",
      "Providing the answer without a visual model",
      "Skipping the comparison between strategies",
    ],
  },
];
