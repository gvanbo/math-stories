import { PedagogyTool } from '../types';

export const PEDAGOGY_TOOLS: PedagogyTool[] = [
  {
    id: 'numberTalks',
    name: 'Number Talks',
    category: 'metacognitive',
    gradeAppropriateness: 'Grade 1-6',
    hostScript: "Let's pause the story for a moment. I have a math challenge for you! Without using a pencil, how would you solve this in your head? Tell me your strategy.",
    interactionType: 'studentInput',
    imagenSceneType: 'characterThinking',
    mathAreas: ['Multiplication', 'Estimation', 'Number Sense']
  },
  {
    id: 'barModels',
    name: 'Bar Models (Singapore Math)',
    category: 'pictorial',
    gradeAppropriateness: 'Grade 3-6',
    hostScript: "Look at this map! We can represent the quantities as blocks in a row. See how they fit together to show the total?",
    interactionType: 'hostDemonstration',
    imagenSceneType: 'pedagogyToolDiagram',
    mathAreas: ['Fractions', 'Word Problems', 'Division']
  },
  {
    id: 'arrayExploration',
    name: 'Array Exploration',
    category: 'pictorial',
    gradeAppropriateness: 'Grade 3-4',
    hostScript: "Our friend Four is building a grid! See how the rows and columns perfectly match our multiplication sentence?",
    interactionType: 'collaborative',
    imagenSceneType: 'manipulativeLayout',
    mathAreas: ['Multiplication', 'Area']
  },
  {
    id: 'numberlineJourneys',
    name: 'Numberline Journeys',
    category: 'concrete',
    gradeAppropriateness: 'Grade 1-4',
    hostScript: "Follow Seven as they hop along the glowing path! Each jump takes us further into the math mystery.",
    interactionType: 'hostDemonstration',
    imagenSceneType: 'diagramVisual',
    mathAreas: ['Addition', 'Subtraction', 'Fractions']
  },
  {
    id: 'thinkAloud',
    name: 'Think-Aloud Metacognition',
    category: 'metacognitive',
    gradeAppropriateness: 'All Grades',
    hostScript: "I'm wondering... what do you notice about these numbers? I notice that they are all multiples of five. What do you wonder?",
    interactionType: 'collaborative',
    imagenSceneType: 'characterThinking',
    mathAreas: ['Problem Solving', 'Reasoning']
  },
  {
    id: 'errorAnalysis',
    name: 'Error Analysis',
    category: 'metacognitive',
    gradeAppropriateness: 'Grade 4-6',
    hostScript: "Detective Seven found a clue—but something is wrong with this math! Can you spot the mistake and help us fix it?",
    interactionType: 'studentInput',
    imagenSceneType: 'closeUpReaction',
    mathAreas: ['Multiplication Algorithm', 'Division']
  },
  {
    id: 'whichOneDoesntBelong',
    name: 'WODB (Which One Doesn\'t Belong)',
    category: 'metacognitive',
    gradeAppropriateness: 'All Grades',
    hostScript: "Here are four magical objects. Look closely... which one doesn't belong with the others? There's more than one right answer!",
    interactionType: 'studentInput',
    imagenSceneType: 'pedagogyToolDiagram',
    mathAreas: ['Geometry', 'Number Sense', 'Patterns']
  },
  {
    id: 'anchorTask',
    name: 'Anchor Tasks',
    category: 'concrete',
    gradeAppropriateness: 'Grade 4',
    hostScript: "Before we continue our journey, we must solve this grand puzzle. It's the key to the entire kingdom's math!",
    interactionType: 'collaborative',
    imagenSceneType: 'wideEstablishingShot',
    mathAreas: ['Introduction to Concepts', 'Rich Tasks']
  }
];
