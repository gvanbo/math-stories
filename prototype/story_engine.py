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
