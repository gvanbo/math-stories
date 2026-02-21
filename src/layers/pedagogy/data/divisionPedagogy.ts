import type { PedagogyPlan } from "@/types";

/**
 * Division pedagogy plans for Alberta Grade 4.
 */
export const DIVISION_PEDAGOGY: PedagogyPlan[] = [
  {
    conceptId: "div-equal-sharing",
    stages: {
      concrete: {
        description: "Students physically share counters into equal groups.",
        activities: [
          "Give students 12 counters and 3 cups — share equally",
          "Try different totals and group sizes with real objects",
        ],
        materials: ["counters", "paper cups", "small toys"],
      },
      pictorial: {
        description: "Students draw circles representing groups and distribute dots equally.",
        activities: [
          "Draw 3 circles for 12 ÷ 3 and deal dots one at a time",
          "Use arrays to connect division to multiplication",
        ],
        materials: ["grid paper", "whiteboard", "markers"],
      },
      symbolic: {
        description: "Students write division equations and connect to multiplication facts.",
        activities: [
          "Write 12 ÷ 3 = 4 and verify with 3 × 4 = 12",
          "Solve word problems using division notation",
        ],
        materials: ["worksheets", "number cards"],
      },
    },
    differentiation: {
      struggling: {
        description: "Use smaller numbers and hands-on sharing with real objects.",
        scaffolds: ["Start with totals ≤ 10", "Share one-by-one into groups"],
      },
      onLevel: {
        description: "Use 2-digit dividends with visual models.",
        scaffolds: ["Connect to arrays", "Use fact families"],
      },
      advanced: {
        description: "Explore division with remainders and larger numbers.",
        scaffolds: ["Introduce remainders", "Multi-step word problems"],
      },
    },
    checksForUnderstanding: [
      {
        id: "cfu-div-explain",
        prompt: "If you have 20 stickers and 5 friends, explain how you would share them equally. Why does this work?",
        requiresExplanation: true,
        expectedResponse:
          "I would give each friend one sticker at a time until they are all gone. Each friend gets 4 stickers because 5 × 4 = 20. Division lets us find how many each group gets when we share equally.",
      },
    ],
  },
  {
    conceptId: "div-fact-relationship",
    stages: {
      concrete: {
        description: "Students build arrays and describe them using both multiplication and division.",
        activities: [
          "Build a 4 × 6 array and find all four related facts",
          "Cover rows/columns to show the related division",
        ],
        materials: ["square tiles", "counters", "fact triangles"],
      },
      pictorial: {
        description: "Students draw fact triangles and arrays showing inverse relationships.",
        activities: [
          "Draw fact triangles for given products",
          "Draw array and write 4 equations it represents",
        ],
        materials: ["grid paper", "markers", "fact triangle templates"],
      },
      symbolic: {
        description: "Students write complete fact families from a single equation.",
        activities: [
          "Given 7 × 8 = 56, write all four related facts",
          "Missing factor problems: ? × 9 = 63",
        ],
        materials: ["flashcards", "worksheets"],
      },
    },
    differentiation: {
      struggling: {
        description: "Use arrays to see the connection between × and ÷ visually.",
        scaffolds: ["Smaller facts (2, 5, 10)", "Physical fact triangles"],
      },
      onLevel: {
        description: "Complete fact families for all basic facts.",
        scaffolds: ["Fact family games", "Array matching activities"],
      },
      advanced: {
        description: "Apply inverse relationships to solve multi-step problems.",
        scaffolds: ["Two-step word problems", "Missing factor chains"],
      },
    },
    checksForUnderstanding: [
      {
        id: "cfu-div-inverse",
        prompt: "If you know that 8 × 6 = 48, what division facts can you figure out? Explain why multiplication and division are connected.",
        requiresExplanation: true,
        expectedResponse:
          "48 ÷ 8 = 6 and 48 ÷ 6 = 8. They are connected because division is the opposite of multiplication — if 8 groups of 6 make 48, then 48 shared into 8 groups must give 6 each.",
      },
    ],
  },
];
