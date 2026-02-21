# Math Stories WebApp — Project Roadmap

> **Methodology:** Test-Driven Development (TDD) — every task writes tests first, then implementation, then validation.
>
> **Source of truth:** [Math Stories WebApp Core.md](file:///l:/math-stories/Math%20Stories%20WebApp%20Core.md)
>
> **Agents:** See [AGENT_REGISTRY.md](file:///l:/math-stories/.agent/agents/AGENT_REGISTRY.md) for agent ownership of each task area.

---

## TDD Workflow (All Tasks Follow This Pattern)

```
1. RED    — Write failing tests that define the expected behavior
2. GREEN  — Write the minimum code to make tests pass
3. REFACTOR — Clean up without breaking tests
4. VALIDATE — Run full test suite + Integrity Validator + PM drift check
```

> [!IMPORTANT]
> No task is "done" until: all tests pass, the Integrity Validator approves, and the Project Manager confirms alignment with Core.md.

---

## Milestone 0 — Project Scaffolding

**Goal:** Set up the project structure, tooling, and test infrastructure so agents can begin building.

**Owner:** Human (you) + Orchestrator

| # | Task | TDD Artifact | Status |
|---|---|---|---|
| 0.1 | Choose web framework (Next.js / Vite) and initialize project | — | `[ ]` |
| 0.2 | Set up TypeScript configuration | — | `[ ]` |
| 0.3 | Set up test framework (Vitest or Jest) with coverage | `vitest.config.ts` | `[ ]` |
| 0.4 | Set up linter + formatter (ESLint, Prettier) | `.eslintrc`, `.prettierrc` | `[ ]` |
| 0.5 | Create directory structure matching the 6 core layers | `src/layers/{curriculum,concept,pedagogy,story,characters,personalization}/` | `[ ]` |
| 0.6 | Create shared TypeScript types from Core.md data models | `src/types/index.ts` | `[ ]` |
| 0.7 | Set up CI pipeline (lint → test → build) | `.github/workflows/ci.yml` | `[ ]` |
| 0.8 | PM drift check on scaffolding | PM reviews against Core.md | `[ ]` |

**Exit criteria:** `npm run test` runs (0 tests, 0 failures), `npm run build` succeeds, directory structure matches Core.md layers.

---

## Milestone 1 — Data Layer (Types + Seed Data)

**Goal:** Define all TypeScript types and create seed data for one complete topic (multiplication).

**Owner:** Curriculum Agent, Concept Logic Agent, Characters Agent

| # | Task | Agent | TDD Pattern | Status |
|---|---|---|---|---|
| 1.1 | **TEST:** Write type validation tests for `Outcome` | Curriculum | Assert shape, required fields, valid codes | `[ ]` |
| 1.2 | **IMPL:** Create `Outcome` type + seed Alberta Grade 4 multiplication outcomes | Curriculum | Make 1.1 pass | `[ ]` |
| 1.3 | **TEST:** Write type validation tests for `Concept` | Concept Logic | Assert models[], strategies[], whyItWorks present | `[ ]` |
| 1.4 | **IMPL:** Create `Concept` type + seed multiplication concepts | Concept Logic | Make 1.3 pass | `[ ]` |
| 1.5 | **TEST:** Write type validation tests for `DigitCharacter` | Characters | Assert mathRule is a true math property | `[ ]` |
| 1.6 | **IMPL:** Create `DigitCharacter` type + seed all 10 digit characters (0-9) | Characters | Make 1.5 pass | `[ ]` |
| 1.7 | **TEST:** Write type validation tests for `PedagogyPlan`, `StorySkeleton`, `UserProfile`, `SessionData` | All layer agents | Assert all Core.md constraints | `[ ]` |
| 1.8 | **IMPL:** Create remaining types + seed pedagogy and skeleton data for multiplication | Pedagogy, Story Logic | Make 1.7 pass | `[ ]` |
| 1.9 | **VALIDATE:** Run Integrity Validator on all seed data | Integrity Validator | All Section 5 rules pass | `[ ]` |
| 1.10 | **PM GATE:** Project Manager reviews Milestone 1 | Project Manager | No drift from Core.md | `[ ]` |

**Exit criteria:** All types compile, all seed data passes validation tests, Integrity Validator approves, PM signs off.

---

## Milestone 2 — Tool Layer (Core API Functions)

**Goal:** Implement the 8 tools from Section 2 of Core.md as testable functions.

**Owner:** Each tool's owning agent (see Agent Registry)

| # | Task | Agent | TDD Pattern | Status |
|---|---|---|---|---|
| 2.1 | **TEST:** `findOutcomesForQuery` — exact match, partial match, no match, edge cases | Curriculum | Input/output contract tests | `[ ]` |
| 2.2 | **IMPL:** `findOutcomesForQuery` | Curriculum | Make 2.1 pass | `[ ]` |
| 2.3 | **TEST:** `getConceptForOutcome` — valid code, invalid code, concept completeness | Concept Logic | Assert models + strategies + whyItWorks | `[ ]` |
| 2.4 | **IMPL:** `getConceptForOutcome` | Concept Logic | Make 2.3 pass | `[ ]` |
| 2.5 | **TEST:** `getPedagogyForConcept` — all 3 stages, differentiation, explanation check | Pedagogy | Assert CPA completeness | `[ ]` |
| 2.6 | **IMPL:** `getPedagogyForConcept` | Pedagogy | Make 2.5 pass | `[ ]` |
| 2.7 | **TEST:** `getStorySkeleton` — beat order, required models, forbidden patterns | Story Logic | Assert beat sequence + forbidden list | `[ ]` |
| 2.8 | **IMPL:** `getStorySkeleton` | Story Logic | Make 2.7 pass | `[ ]` |
| 2.9 | **TEST:** `getDigitCharacters` — valid digits, out-of-range, math rule accuracy | Characters | Assert mathRule truthfulness | `[ ]` |
| 2.10 | **IMPL:** `getDigitCharacters` | Characters | Make 2.9 pass | `[ ]` |
| 2.11 | **TEST:** `buildStoryContext` — context assembly, personalization boundaries, slot filling | Story Logic | Assert skin-only personalization | `[ ]` |
| 2.12 | **IMPL:** `buildStoryContext` | Story Logic | Make 2.11 pass | `[ ]` |
| 2.13 | **TEST:** `planLesson` — lesson structure, differentiation selection, host notes | Pedagogy | Assert lesson completeness | `[ ]` |
| 2.14 | **IMPL:** `planLesson` | Pedagogy | Make 2.13 pass | `[ ]` |
| 2.15 | **TEST:** `recordFeedback` — valid session, invalid session, feedback storage | Personalization | Assert data persistence | `[ ]` |
| 2.16 | **IMPL:** `recordFeedback` | Personalization | Make 2.15 pass | `[ ]` |
| 2.17 | **VALIDATE:** Integration tests — chain tools in Section 4 interaction sequence | Orchestrator | Full pipeline test | `[ ]` |
| 2.18 | **PM GATE:** Project Manager reviews Milestone 2 | Project Manager | No drift from Core.md | `[ ]` |

**Exit criteria:** All 8 tools pass unit tests, integration test passes the full call chain, PM signs off.

---

## Milestone 3 — Integrity & Validation Layer

**Goal:** Implement the Integrity Validator as an automated test harness that can validate any output.

**Owner:** Integrity Validator Agent

| # | Task | Agent | TDD Pattern | Status |
|---|---|---|---|---|
| 3.1 | **TEST:** Write tests for each of the 9 integrity rules (Section 5 + structural) | Integrity Validator | One test per rule, pass and fail cases | `[ ]` |
| 3.2 | **IMPL:** `validateOutput` function with all 9 rule checks | Integrity Validator | Make 3.1 pass | `[ ]` |
| 3.3 | **TEST:** Write tests with intentionally bad outputs (mnemonic-only, missing models, contradicted digit rules) | Integrity Validator | Must detect and report violations | `[ ]` |
| 3.4 | **IMPL:** Repair suggestion generation | Integrity Validator | Make 3.3 pass | `[ ]` |
| 3.5 | **TEST:** Integration — feed full pipeline output through validator | Integrity Validator | End-to-end validation | `[ ]` |
| 3.6 | **PM GATE:** Project Manager reviews Milestone 3 | Project Manager | No drift from Core.md | `[ ]` |

**Exit criteria:** Validator catches all known bad patterns, passes all known good patterns, generates actionable repair suggestions.

---

## Milestone 4 — Story Construction Engine

**Goal:** Build the Mad-Libs story construction pipeline from Section 3 of Core.md.

**Owner:** Story Logic Agent, Characters Agent, Personalization Agent

| # | Task | Agent | TDD Pattern | Status |
|---|---|---|---|---|
| 4.1 | **TEST:** Story construction with fixed inputs produces correct beat sequence | Story Logic | Assert beat order, model presence | `[ ]` |
| 4.2 | **IMPL:** Story construction pipeline (skeleton → characters → context → narrative prompt) | Story Logic | Make 4.1 pass | `[ ]` |
| 4.3 | **TEST:** Student inputs fill slots without altering math logic | Story Logic | Assert math invariance | `[ ]` |
| 4.4 | **IMPL:** Slot-filling with constraint enforcement | Story Logic | Make 4.3 pass | `[ ]` |
| 4.5 | **TEST:** Personalization changes skin without changing math | Personalization | Assert concept logic unchanged | `[ ]` |
| 4.6 | **IMPL:** Personalization layer integration | Personalization | Make 4.5 pass | `[ ]` |
| 4.7 | **TEST:** Agent self-check — "explain the math idea" matches Concept.models and strategies | Story Logic | Assert self-check catches mismatches | `[ ]` |
| 4.8 | **IMPL:** Self-check routine for story generation | Story Logic | Make 4.7 pass | `[ ]` |
| 4.9 | **VALIDATE:** Generate 5 complete stories, run all through Integrity Validator | Integrity Validator | 100% pass rate | `[ ]` |
| 4.10 | **PM GATE:** Project Manager reviews Milestone 4 | Project Manager | No drift from Core.md | `[ ]` |

**Exit criteria:** Full story construction pipeline works end-to-end, self-check catches bad stories, 5 sample stories pass validation.

---

## Milestone 5 — UI Layer

**Goal:** Build the student-facing web interface.

**Owner:** Orchestrator (coordination), Human (design review)

| # | Task | TDD Pattern | Status |
|---|---|---|---|
| 5.1 | **TEST:** Component tests for query input, story display, feedback form | Render + interaction tests | `[ ]` |
| 5.2 | **IMPL:** Student query input component | Make 5.1 pass | `[ ]` |
| 5.3 | **IMPL:** Story display component (renders beats with character voices) | Make 5.1 pass | `[ ]` |
| 5.4 | **IMPL:** Mad-Libs input form (verbs, nouns, place, mood, sidekick) | Make 5.1 pass | `[ ]` |
| 5.5 | **IMPL:** Feedback/rating component | Make 5.1 pass | `[ ]` |
| 5.6 | **TEST:** Page-level integration tests — full flow from query → story → feedback | E2E tests | `[ ]` |
| 5.7 | **IMPL:** Main page assembling all components with Orchestrator call flow | Make 5.6 pass | `[ ]` |
| 5.8 | **IMPL:** Styling — kid-friendly, high-energy, Grade 4 appropriate design | Visual review | `[ ]` |
| 5.9 | **PM GATE:** Project Manager reviews Milestone 5 | No drift from Core.md | `[ ]` |

**Exit criteria:** Student can enter a query, provide Mad-Libs inputs, see a complete story, and submit feedback. All component and E2E tests pass.

---

## Milestone 6 — AI Host & Live Interaction

**Goal:** Implement the AI Host persona and live interaction sequence from Section 4.

**Owner:** Orchestrator, Story Logic Agent

| # | Task | TDD Pattern | Status |
|---|---|---|---|
| 6.1 | **TEST:** Host persona rules — funny, kind, high-energy, never mean | Content analysis tests | `[ ]` |
| 6.2 | **IMPL:** Host persona configuration and prompt engineering | Make 6.1 pass | `[ ]` |
| 6.3 | **TEST:** Interaction sequence — query → outcomes → concept → inputs → story → comprehension | Sequence assertion tests | `[ ]` |
| 6.4 | **IMPL:** Live interaction controller following Section 4 sequence | Make 6.3 pass | `[ ]` |
| 6.5 | **TEST:** Host always routes through tools, never "freewheels" math | Tool-call assertion tests | `[ ]` |
| 6.6 | **IMPL:** Tool-routing enforcement layer | Make 6.5 pass | `[ ]` |
| 6.7 | **TEST:** Comprehension question requires student explanation | Response analysis tests | `[ ]` |
| 6.8 | **IMPL:** Comprehension check with explanation detection | Make 6.7 pass | `[ ]` |
| 6.9 | **VALIDATE:** Run 3 full live interaction simulations through Integrity Validator | 100% pass rate | `[ ]` |
| 6.10 | **PM GATE:** Project Manager reviews Milestone 6 | No drift from Core.md | `[ ]` |

**Exit criteria:** AI Host follows Section 4 sequence exactly, never freewheels, asks comprehension questions, passes persona quality checks.

---

## Milestone 7 — Expansion & Hardening

**Goal:** Add 2 more Grade 4 topics (division, fractions) to prove the expansion protocol works, then harden the system.

**Owner:** All agents following Section 6 expansion rules

| # | Task | TDD Pattern | Status |
|---|---|---|---|
| 7.1 | **TEST:** Expansion tests — new topic adds data only, no architecture changes | Assert no new tools/layers/model shapes | `[ ]` |
| 7.2 | **IMPL:** Add division topic — Outcomes, Concepts, Pedagogy, Skeletons | Data-only additions | `[ ]` |
| 7.3 | **VALIDATE:** Division topic passes all existing tests + Integrity Validator | Regression + validation | `[ ]` |
| 7.4 | **IMPL:** Add fractions topic — Outcomes, Concepts, Pedagogy, Skeletons | Data-only additions | `[ ]` |
| 7.5 | **VALIDATE:** Fractions topic passes all existing tests + Integrity Validator | Regression + validation | `[ ]` |
| 7.6 | **TEST:** Load/stress tests — concurrent users, large outcome sets | Performance tests | `[ ]` |
| 7.7 | **IMPL:** Performance optimizations if needed | Make 7.6 pass | `[ ]` |
| 7.8 | **TEST:** Accessibility audit — screen reader, keyboard nav, color contrast | A11y tests | `[ ]` |
| 7.9 | **IMPL:** Accessibility fixes | Make 7.8 pass | `[ ]` |
| 7.10 | **PM GATE:** Final Project Manager review | Full system drift check | `[ ]` |

**Exit criteria:** 3 topics work (multiplication, division, fractions), expansion required zero architecture changes, all tests pass, accessible, PM gives final approval.

---

## Milestone Summary

| Milestone | Goal | Key Deliverable | PM Gate |
|---|---|---|---|
| **M0** | Scaffolding | Project structure, types, CI | ✓ |
| **M1** | Data Layer | Seed data for 1 topic | ✓ |
| **M2** | Tool Layer | 8 working API functions | ✓ |
| **M3** | Validation | Integrity Validator | ✓ |
| **M4** | Story Engine | Mad-Libs pipeline | ✓ |
| **M5** | UI | Student-facing web app | ✓ |
| **M6** | AI Host | Live interaction | ✓ |
| **M7** | Expansion | 2 more topics + hardening | ✓ |

> [!CAUTION]
> **No milestone proceeds without its PM Gate passing.** If drift is detected, the milestone is blocked until remediation is complete and the Project Manager re-approves.
