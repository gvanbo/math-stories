import type { PedagogyPlan } from "@/types";

/**
 * Pedagogy plans for multiplication concepts.
 * Each plan follows CPA (Concrete → Pictorial → Abstract) staging (Core.md Section 1 Rule 3),
 * includes differentiation at three levels, and checks-for-understanding that require explanation.
 */
export const MULTIPLICATION_PEDAGOGY: PedagogyPlan[] = [
  {
    conceptId: "mult-equal-groups",
    stages: {
      concrete: {
        description:
          "Use physical objects (counters, cubes, toys) to build equal groups. Students physically create groups and count the total.",
        activities: [
          "Build 4 groups of 3 using counters on a mat",
          "Stack connecting cubes in equal towers and count the total",
          "Sort classroom objects into equal groups and record results",
        ],
        materials: ["Counters", "Connecting cubes", "Grouping mats", "Number cards"],
      },
      pictorial: {
        description:
          "Draw circles representing groups with dots inside. Transition from objects to pictures that represent the same concept.",
        activities: [
          "Draw circles for groups and dots for items in each group",
          "Build arrays on grid paper by coloring rows and columns",
          "Match array pictures to multiplication sentences",
        ],
        materials: ["Grid paper", "Colored pencils", "Array cards", "Whiteboard"],
      },
      symbolic: {
        description:
          "Write multiplication number sentences (e.g., 4 × 3 = 12). Connect the symbols back to the groups and arrays they represent.",
        activities: [
          "Write the multiplication sentence for a given array or group picture",
          "Fill in missing numbers: ___ × 3 = 12",
          "Create word problems that match a given multiplication sentence",
        ],
        materials: ["Worksheets", "Number lines", "Multiplication charts"],
      },
    },
    differentiation: {
      struggling: {
        description: "Use smaller numbers (1-5) and provide pre-made group templates.",
        scaffolds: [
          "Pre-drawn circle templates for grouping",
          "Number line with marked jumps",
          "Peer partner work with verbal explanation",
        ],
      },
      onLevel: {
        description: "Work with numbers up to 9 × 9, transitioning across CPA stages.",
        scaffolds: [
          "Self-selected models (groups, arrays, or number line)",
          "Journal writing: explain your strategy",
        ],
      },
      advanced: {
        description: "Extend to 2-digit × 1-digit and explore the distributive property.",
        scaffolds: [
          "Challenge: decompose 12 × 6 into (10 × 6) + (2 × 6)",
          "Create your own word problems for classmates",
          "Explore why the commutative property works using arrays",
        ],
      },
    },
    checksForUnderstanding: [
      {
        id: "cfu-equal-groups-1",
        prompt: "You have 5 bags with 4 apples in each bag. How many apples do you have? Explain how you know, using a model or drawing.",
        requiresExplanation: true,
        expectedResponse:
          "20 apples. I drew 5 circles (bags) with 4 dots (apples) in each. I counted: 4, 8, 12, 16, 20. This is 5 × 4 = 20 because there are 5 equal groups of 4.",
      },
      {
        id: "cfu-equal-groups-2",
        prompt: "Why does 3 × 4 give the same answer as 4 × 3? Use an array to explain.",
        requiresExplanation: true,
        expectedResponse:
          "A 3 × 4 array has 3 rows of 4 dots = 12. If you turn it sideways, you get a 4 × 3 array with 4 rows of 3 dots = 12. The same dots are there either way, just arranged differently. That's why the order doesn't matter in multiplication.",
      },
    ],
  },
  {
    conceptId: "mult-mental-strategies",
    stages: {
      concrete: {
        description:
          "Use linking cubes to physically demonstrate doubling, halving, and decomposition strategies.",
        activities: [
          "Build 4 × 6 with cubes, then rearrange to show 8 × 3 (doubling/halving)",
          "Break a 7 × 6 array into a 5 × 6 section and a 2 × 6 section",
          "Use a bead string to show jumps of equal size",
        ],
        materials: ["Linking cubes", "Bead strings", "Snap cubes", "Base-ten blocks"],
      },
      pictorial: {
        description:
          "Draw number lines with jump arcs and decomposed rectangles to visualize mental strategies.",
        activities: [
          "Draw number line jumps for 4 × 5 (four jumps of 5)",
          "Split an area model into two parts and add the sub-products",
          "Draw how doubling and halving transforms one array into another",
        ],
        materials: ["Number line templates", "Grid paper", "Colored markers"],
      },
      symbolic: {
        description:
          "Write equations showing decomposition, e.g. 7 × 8 = (5 × 8) + (2 × 8) = 40 + 16 = 56.",
        activities: [
          "Write the full decomposition equation for a given product",
          "Show two different mental strategies for the same multiplication",
          "Explain in writing why the Make Ten strategy works for 9 × anything",
        ],
        materials: ["Whiteboards", "Strategy cards", "Journals"],
      },
    },
    differentiation: {
      struggling: {
        description: "Focus on doubles (× 2) and × 5 facts first, with visual supports.",
        scaffolds: [
          "Hundred chart with color-coded skip counting",
          "Pre-drawn number lines with marked intervals",
          "Verbal think-alouds modeled by teacher or peer",
        ],
      },
      onLevel: {
        description: "Apply strategies to all single-digit facts, choosing preferred approach.",
        scaffolds: [
          "Strategy menu card listing all options",
          "Partner practice: solve and explain your strategy choice",
        ],
      },
      advanced: {
        description: "Apply mental strategies to 2-digit multiplication and create strategy guides.",
        scaffolds: [
          "Explain: when is Make Ten better than doubling? Write examples.",
          "Create a 'Mental Math Toolkit' poster for the class",
          "Invent your own mental math trick and prove it works",
        ],
      },
    },
    checksForUnderstanding: [
      {
        id: "cfu-mental-1",
        prompt: "Solve 9 × 7 using a mental math strategy. Show your thinking step by step.",
        requiresExplanation: true,
        expectedResponse:
          "I used Make Ten: 9 × 7 = (10 × 7) − (1 × 7) = 70 − 7 = 63. I thought of 9 as 'almost 10', multiplied 10 × 7 to get 70, then subtracted one group of 7 because I added one extra group.",
      },
      {
        id: "cfu-mental-2",
        prompt: "Why does doubling one factor and halving the other give the same product?",
        requiresExplanation: true,
        expectedResponse:
          "If you double the number of groups but halve the size of each group, the total stays the same. For example, 4 × 6: if you double 4 to 8 groups but halve 6 to 3 in each group, 8 × 3 = 24, same as 4 × 6 = 24. An array shows this — you're just rearranging the same dots.",
      },
    ],
  },
];
