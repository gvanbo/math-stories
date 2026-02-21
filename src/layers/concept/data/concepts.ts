import type { Concept } from "@/types";

/**
 * Multiplication concepts mapped to Alberta Grade 4 outcomes.
 * Each concept includes at least one visualizable model, one reasoning strategy,
 * and a "why it works" explanation (Core.md Section 1 Rule 2).
 */
export const MULTIPLICATION_CONCEPTS: Concept[] = [
  {
    id: "mult-equal-groups",
    outcomeCode: "4.N.3",
    models: [
      {
        id: "model-equal-groups",
        name: "Equal Groups",
        type: "equalGroups",
        description:
          "Show multiplication as a number of groups, each containing the same quantity. For example, 4 × 3 means 4 groups of 3 objects.",
      },
      {
        id: "model-array",
        name: "Array",
        type: "array",
        description:
          "Arrange objects in rows and columns to show multiplication. A 4 × 3 array has 4 rows and 3 columns, totaling 12.",
      },
    ],
    strategies: [
      {
        id: "strat-doubling",
        name: "Doubling and Halving",
        type: "doublingHalving",
        description:
          "If one factor is doubled and the other is halved, the product stays the same. For example, 4 × 6 = 8 × 3 = 24.",
      },
    ],
    whyItWorks:
      "Multiplication works because it counts total items in equal-sized groups. An array makes this visible — the rows show the number of groups and the columns show the size of each group. Rearranging the array (turning rows into columns) proves that 4 × 3 = 3 × 4, which is the commutative property.",
  },
  {
    id: "mult-fact-families",
    outcomeCode: "4.N.4",
    models: [
      {
        id: "model-array-facts",
        name: "Array for Fact Families",
        type: "array",
        description:
          "Use a single array to show all four related facts. A 3 × 5 array shows: 3 × 5 = 15, 5 × 3 = 15, 15 ÷ 3 = 5, and 15 ÷ 5 = 3.",
      },
    ],
    strategies: [
      {
        id: "strat-fact-families",
        name: "Fact Families",
        type: "factFamilies",
        description:
          "Group related multiplication and division facts together. Knowing 6 × 7 = 42 means you also know 7 × 6 = 42, 42 ÷ 6 = 7, and 42 ÷ 7 = 6.",
      },
    ],
    whyItWorks:
      "Fact families work because multiplication and division are inverse operations. If you know the total (product) and one group size (factor), you can find the other factor by dividing. Arrays make this concrete — covering part of the array and counting what remains shows division as the reverse of building the array.",
  },
  {
    id: "mult-mental-strategies",
    outcomeCode: "4.N.5",
    models: [
      {
        id: "model-number-line",
        name: "Number Line Jumps",
        type: "numberLine",
        description:
          "Show multiplication as repeated jumps of equal size on a number line. 4 × 5 is shown as 4 jumps of 5: 0 → 5 → 10 → 15 → 20.",
      },
      {
        id: "model-decomposition",
        name: "Area Decomposition",
        type: "decomposition",
        description:
          "Break a multiplication into two simpler parts using the distributive property. For example, 7 × 6 = (5 × 6) + (2 × 6) = 30 + 12 = 42.",
      },
    ],
    strategies: [
      {
        id: "strat-make-ten",
        name: "Make Ten",
        type: "makeTen",
        description:
          "Adjust factors to create a multiple of 10, then compensate. For 9 × 6: think (10 × 6) − (1 × 6) = 60 − 6 = 54.",
      },
      {
        id: "strat-doubling-mental",
        name: "Doubling for Mental Math",
        type: "doublingHalving",
        description:
          "Use known doubles to find harder facts. For 4 × 7: double 7 to get 14, then double 14 to get 28.",
      },
    ],
    whyItWorks:
      "Mental math strategies work because of the distributive property — you can break a hard multiplication into easier parts and add the results. The number line shows this visually: instead of one big jump, you take several smaller jumps that are easier to count. Decomposition makes the invisible structure of multiplication visible.",
  },
];
