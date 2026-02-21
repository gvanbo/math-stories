import type { Concept } from "@/types";

/**
 * Fractions concepts mapped to Alberta Grade 4 outcomes.
 * Core.md Section 6: Uses known non-proprietary models (part-whole, area, number lines).
 */
export const FRACTIONS_CONCEPTS: Concept[] = [
  {
    id: "frac-part-whole",
    outcomeCode: "4.N.8",
    models: [
      {
        id: "model-area-fractions",
        name: "Area Model for Fractions",
        type: "area",
        description:
          "Divide a shape (circle, rectangle, or square) into equal parts and shade some to show a fraction. For example, shading 3 of 4 equal parts of a rectangle shows 3/4.",
      },
      {
        id: "model-number-line-frac",
        name: "Number Line for Fractions",
        type: "numberLine",
        description:
          "Place fractions on a number line between 0 and 1. Divide the line into equal segments — 1/4 is the first mark when the line is split into 4 equal parts.",
      },
    ],
    strategies: [
      {
        id: "strat-equal-parts",
        name: "Equal Parts Reasoning",
        type: "makeTen",
        description:
          "To find a fraction of a set, divide the total into the number of equal parts shown by the denominator, then count the parts shown by the numerator. For 2/3 of 12: divide 12 into 3 groups (4 each), then take 2 groups = 8.",
      },
    ],
    whyItWorks:
      "Fractions work because they describe equal parts of a whole. The denominator tells how many equal parts the whole is divided into, and the numerator tells how many of those parts we are talking about. Area models and number lines make this concrete — you can see and count the parts. This is why 2/4 = 1/2: shading 2 of 4 parts covers the same area as shading 1 of 2 parts.",
  },
  {
    id: "frac-decimal-connection",
    outcomeCode: "4.N.9",
    models: [
      {
        id: "model-hundredths-grid",
        name: "Hundredths Grid",
        type: "area",
        description:
          "A 10×10 grid where each small square represents 1/100 (0.01). Shading 25 squares shows 25/100 = 0.25 = 1/4.",
      },
      {
        id: "model-number-line-decimal",
        name: "Number Line for Decimals",
        type: "numberLine",
        description:
          "Place decimals on a number line. Between 0 and 1, mark tenths (0.1, 0.2, …). Between each tenth, mark hundredths. This shows 0.25 is between 0.2 and 0.3.",
      },
    ],
    strategies: [
      {
        id: "strat-place-value",
        name: "Place Value Connection",
        type: "makeTen",
        description:
          "Connect fractions to decimals using place value. 3/10 = 0.3 because 3 tenths is 3 in the tenths place. 25/100 = 0.25 because 2 in the tenths place + 5 in the hundredths place.",
      },
    ],
    whyItWorks:
      "Decimals are just another way to write fractions with denominators of 10 or 100. The tenths place is 1/10, and the hundredths place is 1/100. A hundredths grid proves this visually: one column (10 squares) is 10/100 = 1/10 = 0.1. The grid connects the fraction, the decimal, and the visual model in one picture.",
  },
];
