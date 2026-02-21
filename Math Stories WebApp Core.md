## **1\. Core layers (must be separate)**

1. Curriculum Layer  
   * Data model: Outcome { code, strand, description, keywords\[\], grade }.  
   * Function: findOutcomesForQuery(query) \-\> Outcome\[\].  
   * Source: Alberta Grade 4 math outcomes only, non-proprietary wording.  
   * Rule: Every lesson or story must be tagged with at least one valid Outcome.code.  
2. Concept Logic Layer  
   * Data model:  
     * Concept { id, outcomeCode, models\[\], strategies\[\] }.  
     * Model examples: equalGroups, array, numberLine, area, decomposition.  
     * Strategy examples: doublingHalving, makeTen, factFamilies.  
   * Rule: Each concept must list:  
     * at least one visualizable model,  
     * at least one reasoning strategy,  
     * a short “why it works” explanation (conceptual, not rote).  
3. Pedagogy Layer  
   * Data model per concept:  
     * Stages: concrete, pictorial, symbolic.  
     * Differentiation: struggling, onLevel, advanced.  
     * ChecksForUnderstanding: short tasks asking for explanation, not just answers.  
   * Rule: For each Concept:  
     * define all three stages,  
     * define at least one check-for-understanding that requires explaining the idea.  
4. Story Logic Layer (Concept Story Studio)  
   * Data model:  
     * StorySkeleton { conceptId, beats\[\], requiredModels\[\], forbiddenPatterns\[\] }.  
     * Beat.type ∈ { setup, groupsIntro, representation, reasoning, generalize, reflection }.  
   * Rule:  
     * Skeleton must encode the concept and required models (e.g., equal groups \+ array).  
     * forbiddenPatterns must include “pure mnemonic with no model or reasoning.”  
5. Characters & Artifacts Layer  
   * Data model:  
     * DigitCharacter { digit, trait, mathRule, voiceStyle }.  
     * Artifact { id, type (character, animationTemplate, visualPromptCue), description }.  
   * Rule:  
     * DigitCharacter.mathRule must be a true property (e.g., 1 \= identity, 0 \= zero property, 2 \= doubling).​  
     * Stories must respect these rules; traits cannot contradict math.  
6. Personalization Layer  
   * Data model:  
     * UserProfile { id, preferences, readingLevel, humorLevel, modalityPrefs }.  
     * SessionData { userId, conceptId, storyId, feedback }.  
   * Rule:  
     * Personalization can change skin (setting, style, character selection),  
     * Personalization cannot change concept logic, models, or math rules.

---

## **2\. Tool set (for Gemini / agents)**

Agents should expose and consume these tools; they are the main API of your system:

1. findOutcomesForQuery(query) \-\> Outcome\[\]  
2. getConceptForOutcome(outcomeCode) \-\> Concept  
3. getPedagogyForConcept(conceptId) \-\> PedagogyPlan  
4. getStorySkeleton(conceptId) \-\> StorySkeleton  
5. getDigitCharacters(digits\[\]) \-\> DigitCharacter\[\]  
6. buildStoryContext(conceptId, userProfile, userInputs) \-\> StoryContext  
   * userInputs \= verbs, nouns, mood, etc.  
   * Must embed: skeleton beats, digit characters, personalization fields.  
7. planLesson(conceptId, userProfile) \-\> LessonPlan  
   * Uses pedagogy stages \+ differentiation.  
8. recordFeedback(sessionId, feedback) \-\> void  
   * For improving templates and personalization.

Rule:

* Agents must call tools for structure, then fill in language and visuals within that structure.

---

## **3\. Story construction rules (Mad-Libs with logic)**

Inputs:

* Outcome (from query).  
* Concept (linked to that outcome).  
* StorySkeleton.  
* DigitCharacters for digits in play.  
* UserInputs (verbs, places, sidekicks).

Process:

1. Agent calls getStorySkeleton(conceptId).  
2. Agent calls getDigitCharacters(digits).  
3. Agent calls buildStoryContext(conceptId, userProfile, userInputs).  
4. Agent generates story text/dialogue only by realizing the StoryContext:  
   * Each beat must appear in order.  
   * Required models (e.g., equal groups → array) must be explicitly described.  
5. Agent performs a self-check:  
   * “Explain the math idea this story teaches.”  
   * This explanation must match Concept’s models\[\] and strategies\[\], or regenerate.

Constraints:

* Student inputs fill slots (place, action, sidekick, mood).  
* They do not alter:  
  * groupsIntro logic (e.g., 6 groups of 7),  
  * the choice of models (array vs. equal groups),  
  * the explanation of “why this works.”

---

## **4\. AI host & Live interaction rules**

Host persona rules:

* Audience: Grade 4, Alberta.  
* Style: funny, kind, high-energy, never mean.  
* Always:  
  * Identify the math idea in kid-friendly language.  
  * Use at least one concrete or visual representation.  
  * Ask at least one comprehension question per mini-lesson.

Interaction sequence:

1. Student query (typed or spoken).  
2. Host:  
   * calls findOutcomesForQuery,  
   * calls getConceptForOutcome,  
   * briefly states: “We’re working on \[concept\] today.”  
3. Host gathers student inputs (verbs, nouns).  
4. Host calls buildStoryContext and narrates story using Live API audio.  
5. Host asks the student to explain the idea back (can be audio).  
6. Optional: Host calls a summarization tool to store a concise summary of the student’s understanding.

Rule:

* All Live sessions must route through the tools; host never “freewheels” math logic without checking against Concept and StorySkeleton.

---

## **5\. Conceptual integrity rules**

For every generated lesson/story:

* Must have:  
  * 1+ Outcome.code,  
  * 1+ Concept.models explicitly instantiated,  
  * 1+ explicit reasoning step (“why it works”).  
* Must not:  
  * rely only on rhymes or arbitrary mnemonics,  
  * contradict digit-character math rules,  
  * skip from problem to answer with no visible structure.

Agents should be instructed to reject or repair any plan that violates these invariants.

---

## **6\. Expansion rules (new topics, no redesign)**

When agents add new Grade 4 topics (fractions, division, area):

* They must:  
  * create new Concept entries using known non-proprietary models (equal sharing, part–whole, area, number lines),  
  * build StorySkeletons that embed those models,  
  * reuse the same tool shapes and invariants.

Nothing about the system’s architecture changes—only new data and concept mappings are added.

