"""
Gemini-powered student response evaluator for 'Once Upon a Number'.
"""

import os
import re
from google import genai
from google.genai import types


def get_client():
    api_key = os.environ.get("GEMINI_API_KEY", "")
    return genai.Client(api_key=api_key)


def evaluate_response(concept: dict, explanation: str, sidekick: str) -> dict:
    """Evaluate a student's final explanation of a concept.

    Returns a dict with keys: level, feedback, missed.
    level is one of: STRONG, PARTIAL, NEEDS_SUPPORT
    """
    client = get_client()
    prompt = f"""A Grade 4 student was just taught {concept['title']}.
Big idea: {concept['big_idea']}
They wrote this explanation: "{explanation}"

Evaluate their understanding on a scale:
- STRONG: They explained the core idea correctly in their own words
- PARTIAL: They got part of it but missed something important
- NEEDS_SUPPORT: Their explanation shows a misconception or is too vague

Respond with EXACTLY this format:
LEVEL: [STRONG/PARTIAL/NEEDS_SUPPORT]
FEEDBACK: [2-3 sentences of warm, encouraging feedback IN CHARACTER as {sidekick}]
MISSED: [If PARTIAL or NEEDS_SUPPORT, one sentence on what was missing. If STRONG, write "Nothing — great job!"]"""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[{"role": "user", "parts": [{"text": prompt}]}],
        config=types.GenerateContentConfig(temperature=0.3),
    )
    return parse_evaluation(response.text)


def parse_evaluation(text: str) -> dict:
    """Parse the structured evaluation response from Gemini."""
    result = {
        "level": "PARTIAL",
        "feedback": "Great effort! Keep going!",
        "missed": "",
    }

    level_match = re.search(r"LEVEL:\s*(STRONG|PARTIAL|NEEDS_SUPPORT)", text, re.IGNORECASE)
    if level_match:
        result["level"] = level_match.group(1).upper()

    feedback_match = re.search(r"FEEDBACK:\s*(.+?)(?=MISSED:|$)", text, re.IGNORECASE | re.DOTALL)
    if feedback_match:
        result["feedback"] = feedback_match.group(1).strip()

    missed_match = re.search(r"MISSED:\s*(.+?)(?=$)", text, re.IGNORECASE | re.DOTALL)
    if missed_match:
        result["missed"] = missed_match.group(1).strip()

    return result


BADGE_MAP = {
    "STRONG": {"label": "Master! 🏆", "tier": "gold"},
    "PARTIAL": {"label": "Explorer! ⭐", "tier": "silver"},
    "NEEDS_SUPPORT": {"label": "Adventurer! 🌱", "tier": "bronze"},
}


def award_badge(concept_title: str, level: str) -> dict:
    """Return badge info based on evaluation level."""
    badge_info = BADGE_MAP.get(level, BADGE_MAP["NEEDS_SUPPORT"])
    return {
        "title": f"{concept_title} {badge_info['label']}",
        "tier": badge_info["tier"],
        "retry": level == "NEEDS_SUPPORT",
    }
