import type { DigitCharacter } from "@/types";

/**
 * Canonical registry of all 10 digit characters (0-9).
 * Each character's mathRule must be a true mathematical property (Core.md Section 1 Rule 5).
 * Traits must never contradict the mathRule.
 */
export const DIGIT_CHARACTERS: DigitCharacter[] = [
  {
    digit: 0,
    trait: "The silent observer — always watching, never changing the total",
    mathRule: "Multiplicative annihilator: any number times zero equals zero",
    voiceStyle: "Whisper-like, mysterious, and thoughtful",
  },
  {
    digit: 1,
    trait: "The loyal echo — reflects back exactly what you give",
    mathRule: "Multiplicative identity: any number times one stays the same",
    voiceStyle: "Calm, steady, and reassuring",
  },
  {
    digit: 2,
    trait: "The energetic twin-maker — loves to create doubles",
    mathRule: "Doubling: multiplying by two doubles the value",
    voiceStyle: "Bouncy, excited, and enthusiastic",
  },
  {
    digit: 3,
    trait: "The triangle builder — finds groups of three everywhere",
    mathRule: "Triangular and prime: the first odd prime number",
    voiceStyle: "Quirky, playful, with a love of threes",
  },
  {
    digit: 4,
    trait: "The steady square — grounded and balanced in all directions",
    mathRule: "Square number: 4 = 2 × 2, the smallest composite square",
    voiceStyle: "Solid, dependable, and organized",
  },
  {
    digit: 5,
    trait: "The halfway hero — always finding the middle ground",
    mathRule: "Half of ten: the anchor for skip counting and mental math",
    voiceStyle: "Friendly, balanced, and easygoing",
  },
  {
    digit: 6,
    trait: "The team player — loves combining smaller groups",
    mathRule: "Product of 2 and 3: a composite number bridging even and odd",
    voiceStyle: "Cooperative, warm, and encouraging",
  },
  {
    digit: 7,
    trait: "The lone adventurer — marches to its own beat",
    mathRule: "Prime: cannot be divided evenly by any number except 1 and itself",
    voiceStyle: "Bold, independent, and slightly mysterious",
  },
  {
    digit: 8,
    trait: "The power doubler — doubles the doubles",
    mathRule: "Cube of 2: 8 = 2 × 2 × 2, three layers of doubling",
    voiceStyle: "Confident, strong, and rhythmic",
  },
  {
    digit: 9,
    trait: "The almost-ten — always just one step away from the big round number",
    mathRule: "Square of 3 and complement of 10: 9 = 3 × 3, and 9 + 1 = 10",
    voiceStyle: "Wise, reflective, and a little dramatic",
  },
];
