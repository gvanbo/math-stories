import type { Concept } from "@/types";

/**
 * Division concepts mapped to Alberta Grade 4 outcomes.
 * Core.md Section 6: Uses known non-proprietary models (equal sharing, number lines).
 */
export const DIVISION_CONCEPTS: Concept[] = [
  {
    id: "div-equal-sharing",
    outcomeCode: "4.N.6",
    models: [
      {
        id: "model-equal-sharing",
        name: "Equal Sharing",
        type: "equalGroups",
        description:
          "Show division as splitting a total into equal groups. For example, 12 ÷ 3 means sharing 12 items equally among 3 groups, giving 4 in each group.",
      },
      {
        id: "model-array-division",
        name: "Array for Division",
        type: "array",
        description:
          "Use an array to show division. 12 ÷ 3 means arranging 12 items into 3 equal rows — each row has 4 items.",
      },
    ],
    strategies: [
      {
        id: "strat-repeated-subtraction",
        name: "Repeated Subtraction",
        type: "factFamilies",
        description:
          "Think of division as repeated subtraction. 20 ÷ 5: subtract 5 from 20 repeatedly (20→15→10→5→0) — you subtracted 4 times, so 20 ÷ 5 = 4.",
      },
    ],
    whyItWorks:
      "Division works because it undoes multiplication — if you know 3 groups of 4 make 12, then sharing 12 into 3 groups must give 4 each. Arrays show this: building the array is multiplication, and reading how many per row is division. The total stays the same either way.",
  },
  {
    id: "div-fact-relationship",
    outcomeCode: "4.N.7",
    models: [
      {
        id: "model-fact-triangle",
        name: "Fact Triangle",
        type: "array",
        description:
          "A triangle showing three numbers related by multiplication and division. The product sits at the top, and the two factors sit at the base. Cover one number to see the operation needed.",
      },
    ],
    strategies: [
      {
        id: "strat-think-multiplication",
        name: "Think Multiplication",
        type: "factFamilies",
        description:
          "To solve a division problem, think of the related multiplication fact. For 42 ÷ 7, think '7 × ? = 42' — the answer is 6.",
      },
    ],
    whyItWorks:
      "Multiplication and division are inverse operations — they undo each other. Knowing one fact in a family gives you all four. If 6 × 7 = 42, then 7 × 6 = 42, 42 ÷ 6 = 7, and 42 ÷ 7 = 6. The array makes this visible: the same arrangement of objects can be read as multiplication (rows × columns) or division (total ÷ rows = columns).",
  },
];
