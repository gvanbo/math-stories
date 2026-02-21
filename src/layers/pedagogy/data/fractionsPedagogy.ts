import type { PedagogyPlan } from "@/types";

/**
 * Fractions pedagogy plans for Alberta Grade 4.
 */
export const FRACTIONS_PEDAGOGY: PedagogyPlan[] = [
  {
    conceptId: "frac-part-whole",
    stages: {
      concrete: {
        description: "Students fold paper and use fraction tiles to show parts of a whole.",
        activities: [
          "Fold paper into halves, fourths, eighths — shade and name fractions",
          "Use fraction tiles to compare 1/2, 1/3, 1/4",
        ],
        materials: ["paper", "fraction tiles", "scissors"],
      },
      pictorial: {
        description: "Students draw shapes divided into equal parts and shade fractions.",
        activities: [
          "Draw rectangles divided into equal parts, shade to show 3/4",
          "Place fractions on a number line from 0 to 1",
        ],
        materials: ["rulers", "colored pencils", "number line templates"],
      },
      symbolic: {
        description: "Students write fractions using numerator/denominator notation.",
        activities: [
          "Name fractions from pictures and write symbolically",
          "Match fractions to their position on a number line",
        ],
        materials: ["worksheets", "fraction cards"],
      },
    },
    differentiation: {
      struggling: {
        description: "Focus on halves and fourths with concrete folding activities.",
        scaffolds: ["Start with 1/2 only", "Use food sharing contexts"],
      },
      onLevel: {
        description: "Work with all denominators up to 12 using multiple models.",
        scaffolds: ["Fraction wall comparisons", "Part-of-a-set problems"],
      },
      advanced: {
        description: "Explore equivalent fractions and fractions greater than 1.",
        scaffolds: ["Prove equivalence with models", "Mixed numbers"],
      },
    },
    checksForUnderstanding: [
      {
        id: "cfu-frac-explain",
        prompt: "If a pizza is cut into 8 equal slices and you eat 3 slices, what fraction did you eat? Explain what the top and bottom numbers mean.",
        requiresExplanation: true,
        expectedResponse:
          "I ate 3/8 of the pizza. The bottom number (8) tells how many equal parts the whole pizza was cut into. The top number (3) tells how many parts I ate. The parts must be equal for the fraction to be fair.",
      },
    ],
  },
  {
    conceptId: "frac-decimal-connection",
    stages: {
      concrete: {
        description: "Students shade hundredths grids and connect to decimal notation.",
        activities: [
          "Shade 50 squares on a 10×10 grid and write as 50/100 = 0.50 = 1/2",
          "Use base-ten blocks: flat = 1, rod = 1/10, unit = 1/100",
        ],
        materials: ["hundredths grids", "base-ten blocks", "colored pencils"],
      },
      pictorial: {
        description: "Students represent decimals on number lines and grids.",
        activities: [
          "Place 0.25, 0.5, 0.75 on a number line between 0 and 1",
          "Draw hundredths grids for given decimals",
        ],
        materials: ["number line templates", "grid paper"],
      },
      symbolic: {
        description: "Students convert between fraction and decimal notation.",
        activities: [
          "Write 3/10 as 0.3 and explain why",
          "Convert 0.75 to 75/100 and simplify to 3/4",
        ],
        materials: ["place value charts", "conversion worksheets"],
      },
    },
    differentiation: {
      struggling: {
        description: "Focus on tenths only using shaded strips.",
        scaffolds: ["One-row strips for tenths", "Money analogy (dimes)"],
      },
      onLevel: {
        description: "Work with tenths and hundredths using grids and number lines.",
        scaffolds: ["Grid shading", "Decimal-fraction matching games"],
      },
      advanced: {
        description: "Connect to percents and thousandths.",
        scaffolds: ["Percent connection", "Ordering mixed forms"],
      },
    },
    checksForUnderstanding: [
      {
        id: "cfu-decimal-explain",
        prompt: "Show 0.25 on a hundredths grid and explain what the digits mean. What fraction is 0.25?",
        requiresExplanation: true,
        expectedResponse:
          "I shade 25 squares out of 100. The 2 means 2 tenths (2 columns) and the 5 means 5 hundredths (5 more squares). 0.25 = 25/100, which simplifies to 1/4. So 0.25 is one quarter of the whole.",
      },
    ],
  },
];
