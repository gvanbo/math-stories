# Math Stories WebApp

An interactive Grade 4 (Alberta) math education platform that uses AI agents to generate curriculum-aligned stories, lessons, and interactive storybook graphics. Students learn math through personalized narratives powered by a Mad-Libs-style story engine grounded in real mathematical models, brought to life with generative AI imagery via Google Imagen 3.

---

## Project Purpose

Teach Grade 4 math concepts through stories that are:
- **Curriculum-aligned** — every story maps to Alberta Grade 4 math outcomes
- **Conceptually grounded** — every story uses visualizable models and reasoning strategies (never rote memorization)
- **Personalized** — students provide inputs (verbs, nouns, settings) that shape the narrative without altering the math
- **Character-driven** — digit characters (0-9) each embody a true mathematical property, with full generative visual models for Imagen 3
- **Visually immersive** — every story beat produces a structured `BeatVisualSpec` that drives Imagen 3 scene generation, replacing plain text with interactive storybook graphics

---

## Setup

1. Clone the repository
2. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

3. Fill in your values in `.env`:

   | Variable | Description | Required |
   |---|---|---|
   | `GOOGLE_CLOUD_PROJECT_ID` | Your GCP project ID | Yes |
   | `GOOGLE_CLOUD_REGION` | GCP region (default: `us-central1`) | Yes |
   | `GEMINI_API_KEY` | Gemini API key | Yes |
   | `IMAGEN_MODEL` | Imagen 3 model name (default: `imagen-3.0-generate-002`) | Yes |
   | `GCS_BUCKET_NAME` | GCS bucket for generated image caching | Yes |
   | `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON | Optional |

4. Install dependencies and run:

   ```bash
   npm install
   npm run dev
   ```

---

## Architecture

The system is built on **6 core layers** (defined in Math Stories WebApp Core.md):

| Layer | Responsibility | Data Model |
|---|---|---|
| 1. Curriculum | Alberta Grade 4 math outcomes | `Outcome` |
| 2. Concept Logic | Models, strategies, "why it works" | `Concept` |
| 3. Pedagogy | CPA stages, differentiation, comprehension checks, **pedagogy tool registry** | `PedagogyPlan`, `LessonPlan`, `PedagogyTool` |
| 4. Story Logic | Story skeletons, beat sequences, **visual prompt generation** | `StorySkeleton`, `StoryContext`, `BeatVisualSpec` |
| 5. Characters | Digit characters (0-9) with math-accurate traits, **generative visual models** | `DigitCharacter`, `DigitCharacterFull`, `Artifact` |
| 6. Personalization | User profiles, session data, feedback | `UserProfile`, `SessionData` |

---

## Agent System

**9 agents** operate the system. Each has a dedicated instruction file in `.agent/agents/`.

| Agent | File | Model | Role |
|---|---|---|---|
| Project Manager | `project-manager.md` | `gemini-2.5-pro` | Reviews all work against Core.md, prevents drift |
| Orchestrator | `orchestrator.md` | `gemini-2.5-pro` | Routes tasks, sequences agent calls |
| Curriculum | `curriculum.md` | `gemini-2.5-flash` | Outcome lookup |
| Concept Logic | `concept-logic.md` | `gemini-2.5-pro` | Concept mapping with models & strategies |
| Pedagogy | `pedagogy.md` | `gemini-2.5-pro` | Lesson planning & differentiation |
| Story Logic | `story-logic.md` | `gemini-2.5-flash` | Skeleton construction, context assembly & visual spec generation |
| Characters | `characters.md` | `gemini-2.5-flash` | Digit character registry & generative visual models |
| Personalization | `personalization.md` | `gemini-2.5-flash` | User profiles & feedback |
| Integrity Validator | `integrity-validator.md` | `gemini-2.5-pro` | Enforces conceptual integrity rules |

> [!IMPORTANT]
> Before starting any task, read the relevant agent file(s) and the AGENT_REGISTRY.md for the complete tool index and call flow.

---

## Key Files

| File | Purpose |
|---|---|
| `Math Stories WebApp Core.md` | **Source of truth** — all rules, data models, and invariants |
| `ROADMAP.md` | **TDD project roadmap** — milestones, tasks, agent ownership, PM gates |
| `.agent/agents/AGENT_REGISTRY.md` | Agent index, tool ownership, and call flow diagram |
| `.agent/agents/TEMPLATE.md` | Rigid 9-section template that all agents must follow |

---

## Call Flow

```
Student Query
  → Orchestrator
  → Curriculum.findOutcomesForQuery
  → ConceptLogic.getConceptForOutcome
  → Pedagogy.getPedagogyForConcept
  → StoryLogic.getStorySkeleton
  → Characters.getDigitCharacters
  → Personalization (getUserProfile)
  → StoryLogic.buildStoryContext
  → StoryLogic.attachVisualSpecsToBeats   ← NEW (Multimodal Agent Overhaul)
  → ImagenService.generateSceneImages     ← NEW (Multimodal Agent Overhaul)
  → IntegrityValidator.validateOutput
  → Orchestrator.assembleOutput
  → ProjectManager.reviewAgainstPlan
  → FinalOutput (text + storybook graphics)
```

---

## Hard Rules (Always Enforced)

1. Every output must reference **1+ Outcome.code**, **1+ explicit model**, and **1+ reasoning step**
2. Stories must never rely only on mnemonics — models and reasoning are required
3. Digit character traits must never contradict their mathematical property; **visual models (DigitCharacterFull) must be consistent with the same trait**
4. Student personalization changes **skin only** (setting, style, characters) — never math logic
5. Agents must call tools for structure first, then fill in language/visuals within that structure
6. New topics are added as **data only** — architecture and tool shapes never change
7. **Every story beat must produce a `BeatVisualSpec`** — the AI host generates interactive storybook graphics, not plain text alone

---

## Expanding the System

When adding new Grade 4 topics (fractions, division, area, etc.):

1. **Curriculum agent** — add new `Outcome` entries
2. **Concept Logic agent** — create new `Concept` entries with non-proprietary models
3. **Pedagogy agent** — create `PedagogyPlan` entries for new concepts
4. **Story Logic agent** — build `StorySkeleton` entries embedding the new models
5. **Integrity Validator** — same rules apply, no changes needed
6. **Project Manager** — reviews expansion for drift against Core.md

> [!CAUTION]
> Nothing about the system architecture changes during expansion. If a task requires a new tool, new layer, or new data model shape, it must be flagged as drift and reviewed by the Project Manager.
