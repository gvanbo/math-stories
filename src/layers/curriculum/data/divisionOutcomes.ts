import type { Outcome } from "@/types";

/**
 * Alberta Grade 4 division outcomes.
 * Source: Alberta Mathematics Curriculum, Grade 4
 * Non-proprietary wording (Core.md Section 1 Rule 1)
 */
export const DIVISION_OUTCOMES: Outcome[] = [
  {
    code: "4.N.6",
    strand: "Number",
    description:
      "Demonstrate an understanding of division of whole numbers (2-digit by 1-digit) by using personal strategies, including the standard algorithm.",
    keywords: ["division", "whole numbers", "strategies", "algorithm", "2-digit"],
    grade: 4,
  },
  {
    code: "4.N.7",
    strand: "Number",
    description:
      "Demonstrate an understanding of the relationship between multiplication and division by using fact families and arrays.",
    keywords: [
      "division",
      "multiplication",
      "relationship",
      "fact families",
      "arrays",
      "inverse",
    ],
    grade: 4,
  },
];
