# Agent Registry

Central index of all agents in the Math Stories WebApp system. Used by the Orchestrator for dispatch and by the Project Manager for review coverage.

## Agent Table

| Agent | File | Layer | Model | Tools Exposed |
|---|---|---|---|---|
| **Project Manager** | [project-manager.md](file:///l:/math-stories/.agent/agents/project-manager.md) | Cross-cutting | `gemini-2.5-pro` | `reviewAgainstPlan`, `approveDeliverable` |
| **Orchestrator** | [orchestrator.md](file:///l:/math-stories/.agent/agents/orchestrator.md) | Cross-cutting | `gemini-2.5-pro` | `dispatchTask`, `assembleOutput` |
| **Curriculum** | [curriculum.md](file:///l:/math-stories/.agent/agents/curriculum.md) | 1 | `gemini-2.5-flash` | `findOutcomesForQuery` |
| **Concept Logic** | [concept-logic.md](file:///l:/math-stories/.agent/agents/concept-logic.md) | 2 | `gemini-2.5-pro` | `getConceptForOutcome` |
| **Pedagogy** | [pedagogy.md](file:///l:/math-stories/.agent/agents/pedagogy.md) | 3 | `gemini-2.5-pro` | `getPedagogyForConcept`, `planLesson` |
| **Story Logic** | [story-logic.md](file:///l:/math-stories/.agent/agents/story-logic.md) | 4 | `gemini-2.5-flash` | `getStorySkeleton`, `buildStoryContext` |
| **Characters** | [characters.md](file:///l:/math-stories/.agent/agents/characters.md) | 5 | `gemini-2.5-flash` | `getDigitCharacters` |
| **Personalization** | [personalization.md](file:///l:/math-stories/.agent/agents/personalization.md) | 6 | `gemini-2.5-flash` | `recordFeedback` |
| **Integrity Validator** | [integrity-validator.md](file:///l:/math-stories/.agent/agents/integrity-validator.md) | Cross-cutting | `gemini-2.5-pro` | `validateOutput` |

## Tool Index

Complete mapping of project tools (Section 2) to owning agents:

| # | Tool | Owner Agent |
|---|---|---|
| 1 | `findOutcomesForQuery(query) -> Outcome[]` | Curriculum |
| 2 | `getConceptForOutcome(outcomeCode) -> Concept` | Concept Logic |
| 3 | `getPedagogyForConcept(conceptId) -> PedagogyPlan` | Pedagogy |
| 4 | `getStorySkeleton(conceptId) -> StorySkeleton` | Story Logic |
| 5 | `getDigitCharacters(digits[]) -> DigitCharacter[]` | Characters |
| 6 | `buildStoryContext(conceptId, userProfile, userInputs) -> StoryContext` | Story Logic |
| 7 | `planLesson(conceptId, userProfile) -> LessonPlan` | Pedagogy |
| 8 | `recordFeedback(sessionId, feedback) -> void` | Personalization |
| — | `reviewAgainstPlan(artifact) -> DriftReport` | Project Manager |
| — | `approveDeliverable(artifactId) -> Approval` | Project Manager |
| — | `validateOutput(output) -> ValidationResult` | Integrity Validator |
| — | `dispatchTask(agentName, taskPayload) -> AgentResult` | Orchestrator |
| — | `assembleOutput(results) -> FinalOutput` | Orchestrator |

## Call Flow Reference

```
Student Query
  → Orchestrator.dispatchTask
    → Curriculum.findOutcomesForQuery
    → ConceptLogic.getConceptForOutcome
    → Pedagogy.getPedagogyForConcept
    → StoryLogic.getStorySkeleton
    → Characters.getDigitCharacters
    → Personalization (getUserProfile)
    → StoryLogic.buildStoryContext
    → IntegrityValidator.validateOutput
  → Orchestrator.assembleOutput
  → ProjectManager.reviewAgainstPlan
  → ProjectManager.approveDeliverable
  → FinalOutput
```
