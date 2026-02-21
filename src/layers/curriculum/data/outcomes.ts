import type { Outcome } from "@/types";

/**
 * Alberta Grade 4 multiplication outcomes.
 * Source: Alberta Mathematics Curriculum, Grade 4
 * Non-proprietary wording (Core.md Section 1 Rule 1)
 */
export const MULTIPLICATION_OUTCOMES: Outcome[] = [
  {
    code: "4.N.3",
    strand: "Number",
    description:
      "Demonstrate an understanding of multiplication of whole numbers (2-digit or 3-digit by 1-digit) by using personal strategies, including the standard algorithm.",
    keywords: ["multiplication", "whole numbers", "strategies", "algorithm", "2-digit", "3-digit"],
    grade: 4,
  },
  {
    code: "4.N.4",
    strand: "Number",
    description:
      "Demonstrate an understanding of multiplication (1-digit by 1-digit) to recall multiplication facts to 9 × 9 and determine related division facts.",
    keywords: [
      "multiplication facts",
      "recall",
      "division facts",
      "fact families",
      "1-digit",
    ],
    grade: 4,
  },
  {
    code: "4.N.5",
    strand: "Number",
    description:
      "Describe and apply mental math strategies for multiplication, such as doubling and halving, using known facts, and making tens.",
    keywords: [
      "mental math",
      "doubling",
      "halving",
      "known facts",
      "strategies",
    ],
    grade: 4,
  },
  {
    code: "4.PR.1",
    strand: "Patterns and Relations",
    description:
      "Identify and describe patterns found in multiplication charts and tables, including skip counting patterns and relationships between rows and columns.",
    keywords: [
      "patterns",
      "multiplication chart",
      "skip counting",
      "tables",
      "relationships",
    ],
    grade: 4,
  },
];
