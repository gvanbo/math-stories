"""
Gemini-powered story engine for 'Once Upon a Number'.
Manages beat prompts and maintains conversation history.
"""

import os
import re
from google import genai
from google.genai import types

SYSTEM_INSTRUCTION = """You are a master educational storyteller for Grade 4 students (ages 9-10).
You write immersive, funny, richly detailed math stories that teach through narrative.
Every story must be mathematically accurate for Alberta Grade 4 curriculum.
Always explain WHY math works, not just how. Use CPA progression: Concrete → Pictorial → Abstract.
Keep reading level at Grade 4.
Generate vivid, detailed stories — aim for 300-500 words per beat."""


def get_client():
    api_key = os.environ.get("GEMINI_API_KEY", "")
    return genai.Client(api_key=api_key)


def generate_beat(prompt: str, history: list) -> str:
    """Generate story content for a beat, maintaining full conversation history."""
    client = get_client()
    history.append({"role": "user", "parts": [{"text": prompt}]})
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=history,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            temperature=0.8,
            max_output_tokens=1500,
        ),
    )
    reply = response.text
    history.append({"role": "model", "parts": [{"text": reply}]})
    return reply


def extract_image_prompt(text: str) -> tuple[str, str]:
    """Extract IMAGE_PROMPT from story text. Returns (story_text, image_prompt)."""
    pattern = r"\n?IMAGE_PROMPT:\s*(.+?)(?:\n|$)"
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        image_prompt = match.group(1).strip()
        # Remove just the IMAGE_PROMPT line, preserve any content before/after
        story_text = (text[: match.start()] + text[match.end() :]).strip()
        return story_text, image_prompt
    return text.strip(), ""


def extract_challenge_data(text: str) -> tuple[str, str, str, str]:
    """Extract CHALLENGE_QUESTION, CHALLENGE_ANSWER, IMAGE_PROMPT from Beat 6 output.
    Returns (story_text, question, answer, image_prompt)."""
    story_text = text
    question = ""
    answer = ""
    image_prompt = ""

    for field, pattern in [
        ("CHALLENGE_QUESTION", r"CHALLENGE_QUESTION:\s*(.+?)(?:\n|$)"),
        ("CHALLENGE_ANSWER", r"CHALLENGE_ANSWER:\s*(.+?)(?:\n|$)"),
        ("IMAGE_PROMPT", r"IMAGE_PROMPT:\s*(.+?)(?:\n|$)"),
    ]:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            value = match.group(1).strip()
            if field == "CHALLENGE_QUESTION":
                question = value
                story_text = story_text.replace(match.group(0), "").strip()
            elif field == "CHALLENGE_ANSWER":
                answer = value
                story_text = story_text.replace(match.group(0), "").strip()
            elif field == "IMAGE_PROMPT":
                image_prompt = value
                story_text = story_text.replace(match.group(0), "").strip()

    return story_text.strip(), question, answer, image_prompt


# ── Beat prompt builders ──────────────────────────────────────────────────────

def beat1_prompt(place, sidekick, item, mood, concept_title, big_idea):
    return f"""You are writing an immersive, richly detailed math story for a Grade 4 student.
Student's world: place={place}, sidekick={sidekick}, item={item}, mood={mood}.
Math concept being taught: {concept_title}. Big idea: {big_idea}.

Write the story opening. This should be 4-5 vivid paragraphs that:
- Paint a rich, sensory picture of {place} — smells, sounds, colors, textures
- Introduce {sidekick} with a distinct personality and a funny quirk
- Establish the student as the hero who has arrived here for a reason
- End with a mysterious hint that something involving {item}s needs solving
- Tone: joyful, funny, slightly chaotic, Grade 4 reading level
- Do NOT introduce the math concept yet. Just set the scene.

Also output on a new line: IMAGE_PROMPT: [one sentence vivid cartoon illustration description of this scene]"""


def beat2_prompt(sidekick, item, concept_title):
    return f"""Continue the story. The student and {sidekick} discover a problem that urgently needs solving.
The problem MUST require {concept_title} to solve efficiently.
Do NOT explain the math yet. Just present the problem naturally through the story.

Write 3-4 paragraphs that:
- Show the scale of the problem (lots of {item}s to deal with)
- Show {sidekick} panicking or being confused
- Make the student feel like THEY are the only one who can figure this out
- End with a direct question to the student: ask them to predict or decide something
  (e.g. "How would YOU figure out how many {item}s there are?")

Also output: IMAGE_PROMPT: [illustration of the problem moment]"""


def beat3_prompt(sidekick, student_response):
    return f"""The student responded: "{student_response}"

Continue the story. {sidekick} tries the slow/inefficient approach first 
(counting one by one, repeated addition, guessing). It fails or takes forever.
Make this funny — {sidekick} makes a spectacular, humorous mess of it.

Write 3-4 paragraphs showing:
- The inefficient approach in action
- Why it breaks down (too slow, error-prone, exhausting)
- {sidekick} dramatically giving up
- A moment where the student realizes there MUST be a better way

Reference the student's prediction naturally in the narrative.
Also output: IMAGE_PROMPT: [illustration of the funny failure moment]"""


def beat4_prompt(sidekick, item, place, concept_title, mnemonic_anchor):
    anchor_text = ""
    if mnemonic_anchor:
        first_anchor = list(mnemonic_anchor.values())[0]
        anchor_text = f"\nPlant the mnemonic anchor: {first_anchor} — weave this specific image into the story."

    return f"""Now reveal {concept_title} as the elegant solution.

Write 4-5 paragraphs that show the concept THREE ways inside the story:
1. CONCRETE: {sidekick} physically arranges {item}s into equal groups/arrays in {place}
   Use real numbers appropriate for Grade 4 (not just 2x3 — use 4x6, 7x8, etc.)
2. PICTORIAL: Describe exactly how it looks visually — rows, columns, groups
   Write it so vividly the student can picture it without seeing a diagram
3. ABSTRACT: The equation appears naturally in dialogue
   e.g. {sidekick} says "Wait... 4 groups of 6 is the SAME as saying 4 times 6 equals 24!"

Make the moment of discovery feel like a genuine eureka moment.{anchor_text}

Also output: IMAGE_PROMPT: [illustration showing the concrete model clearly — groups/array/number line]"""


def beat4_confused_prompt(concept_title, sidekick, item):
    return f"""The student is confused about {concept_title}. That's okay! 

Provide a fresh, simpler re-explanation using a DIFFERENT analogy than before.
Have {sidekick} try explaining it a completely new way — maybe using {item}s differently.

Write 2-3 short, clear paragraphs with:
- A brand new concrete example with small, easy numbers
- A simple visual description
- The "aha" equation written out clearly

Keep it gentle, encouraging, and funny. End with {sidekick} checking: "Does THAT make more sense?"

Also output: IMAGE_PROMPT: [simple, clear illustration of the new explanation]"""


def beat5_prompt(sidekick, concept_title):
    return f"""The student understands the basic concept. Now deepen it.

Present 2 more examples in the story using DIFFERENT numbers.
For each example:
- Set up the situation in 1 sentence
- PAUSE and ask the student to predict the answer before {sidekick} reveals it
- After the student answers, continue the story with the result

Also show the PATTERN — what do all three examples have in common?
End with {sidekick} asking: "Can you see why this always works?"

Make it clear there are TWO prediction moments (label them PREDICTION 1 and PREDICTION 2).

Also output: IMAGE_PROMPT: [illustration showing the pattern across multiple examples]"""


def beat5_continue_prompt(sidekick, prediction1, prediction2, concept_title):
    return f"""The student made two predictions:
Prediction 1: "{prediction1}"
Prediction 2: "{prediction2}"

Continue the story, revealing whether each prediction was close or not.
Have {sidekick} respond in character to each prediction.
Then show the PATTERN clearly — what do all the examples have in common?
End with {sidekick} saying: "Can you see why {concept_title} always works?"

Write 3-4 paragraphs. Also output: IMAGE_PROMPT: [illustration of the pattern being revealed]"""


def beat6_prompt(sidekick, item, concept_title):
    return f"""Present the climactic challenge. The main problem from earlier is now solvable.
But give it a twist — slightly different numbers than the examples used.

Write 2 paragraphs setting up the final challenge.
End with a clear, specific math question the student must answer to save the day.
The question should require {concept_title} and use numbers in the Grade 4 range.

Also output: 
CHALLENGE_QUESTION: [the exact math question, e.g. "If there are 6 groups of 8 {item}s, how many {item}s are there in total?"]
CHALLENGE_ANSWER: [the correct answer — integer only, no words]
IMAGE_PROMPT: [illustration of the climactic moment]"""


def beat6_hint_prompt(sidekick, challenge_question, wrong_answer):
    return f"""The student answered "{wrong_answer}" to this challenge: "{challenge_question}"
That's not quite right, but don't give away the answer!

Have {sidekick} give a funny, encouraging hint in the story — maybe acting out the problem physically.
Make it a 1-2 paragraph story moment that guides without telling.
End with: "Give it one more try! You're SO close!"

Also output: IMAGE_PROMPT: [illustration of {sidekick} giving the hint]"""


def beat6_solution_prompt(sidekick, challenge_question, correct_answer):
    return f"""The student tried twice and struggled with: "{challenge_question}"
The answer is {correct_answer}.

Walk through the solution step-by-step inside the story.
Have {sidekick} guide the student through it in 2-3 paragraphs.
Make it encouraging — celebrate the learning, not just the answer.
Then transition to the celebration ending.

Also output: IMAGE_PROMPT: [illustration of {sidekick} teaching the solution]"""


def beat7_prompt(sidekick, concept_title, item):
    return f"""The student solved the challenge! Write the triumphant story ending (2-3 paragraphs).
{sidekick} celebrates dramatically and asks the student to explain 
what they learned in their own words.

End with {sidekick} saying: "Before we go — can you explain {concept_title} 
to ME like I'm a confused robot? Use your own words!"

Also output: IMAGE_PROMPT: [celebration illustration with {sidekick} and {item}s]"""
"""Story generation engine for Math Stories prototype."""

import os
from google import genai

SYSTEM_PROMPT = """You are MathBot, an educational storytelling agent for Grade 4 students.
Your job is to teach math using fun, memorable stories with humor and relatable characters.
Keep all language at Grade 4 reading level. Be encouraging and playful.
Always explain WHY the math works, not just HOW.
Use equal groups, arrays, and number lines as models.
All math must be accurate for Grade 4 Alberta curriculum."""

STORY_BEATS = [
    "setup",
    "discovery",
    "representation",
    "reasoning",
    "generalize",
    "reflection",
]

BEAT_PROMPTS = {
    "setup": (
        "Write a fun 3-sentence story setup. The student is visiting {place} with their "
        "sidekick {sidekick}. Make it exciting and silly. End with them discovering a math "
        "problem involving {item}s."
    ),
    "discovery": (
        "Continue the story. {sidekick} discovers a math problem: they need to understand "
        "{topic} using {item}s. Write 2-3 sentences where the problem appears naturally and "
        "feels urgent/fun."
    ),
    "representation": (
        "Show the math visually in the story. Write 2-3 sentences describing how {sidekick} "
        "arranges {item}s to show {topic}. Include a concrete example with real numbers "
        "suitable for Grade 4."
    ),
    "reasoning": (
        "Explain WHY the math works. Write 2-3 sentences in simple Grade 4 language "
        "explaining the mathematical reasoning behind {topic}. Use the {item}s and {place} "
        "as context."
    ),
    "generalize": (
        "Show this works for any numbers. Write 2 sentences showing the pattern works beyond "
        "just one example. Keep it simple and satisfying."
    ),
    "reflection": (
        "End the story. Write 2-3 sentences where {sidekick} asks the student to explain "
        "what they learned in their own words. Make it feel like a celebration."
    ),
}

IMAGE_PROMPT_SUFFIX = (
    " Also write exactly one sentence starting with 'IMAGE:' describing a vivid cartoon "
    "illustration for this beat, featuring {place}, {sidekick}, and {item}s. "
    "Style: colorful children's book illustration, bright and cheerful."
)


def _build_prompt(beat: str, topic: str, place: str, sidekick: str, item: str, mood: str) -> str:
    """Build the full prompt for a single story beat."""
    base = BEAT_PROMPTS[beat].format(
        topic=topic, place=place, sidekick=sidekick, item=item, mood=mood
    )
    image_hint = IMAGE_PROMPT_SUFFIX.format(place=place, sidekick=sidekick, item=item)
    return (
        f"The story has a {mood} mood.\n\n"
        f"{base}\n\n"
        f"{image_hint}"
    )


def _split_image_prompt(raw_text: str, beat: str, place: str, sidekick: str, item: str) -> tuple[str, str]:
    """Split the model response into story text and image prompt."""
    lines = raw_text.strip().splitlines()
    story_lines = []
    image_prompt = (
        f"Colorful children's book illustration of {sidekick} at {place} with {item}s, "
        "bright and cheerful cartoon style."
    )
    for line in lines:
        stripped = line.strip()
        if stripped.upper().startswith("IMAGE:"):
            image_prompt = stripped[6:].strip()
        else:
            story_lines.append(line)
    story_text = "\n".join(story_lines).strip()
    return story_text, image_prompt


def generate_story(topic: str, place: str, sidekick: str, item: str, mood: str) -> list[dict]:
    """Generate a full math story as a list of beat dicts.

    Each dict has keys: type, text, imagePrompt.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set.")

    client = genai.Client(api_key=api_key)

    beats = []
    for beat in STORY_BEATS:
        prompt = _build_prompt(beat, topic, place, sidekick, item, mood)
        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config={"system_instruction": SYSTEM_PROMPT},
            )
            raw = response.text or ""
        except Exception as exc:
            raw = f"[Story generation error for {beat}: {exc}]"

        story_text, image_prompt = _split_image_prompt(raw, beat, place, sidekick, item)
        beats.append(
            {
                "type": beat,
                "text": story_text,
                "imagePrompt": image_prompt,
            }
        )

    return beats
