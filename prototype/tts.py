"""
Text-to-speech wrapper for 'Once Upon a Number'.
Attempts to use Gemini TTS; gracefully falls back if unavailable.
"""

import base64
import os
from google import genai
from google.genai import types


def get_client():
    api_key = os.environ.get("GEMINI_API_KEY", "")
    return genai.Client(api_key=api_key)


def narrate(text: str) -> str | None:
    """Convert text to speech using Gemini TTS.

    Returns base64-encoded audio string, or None if TTS fails.
    """
    if not text:
        return None
    try:
        client = get_client()
        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
            contents=text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name="Puck"
                        )
                    )
                ),
            ),
        )
        audio_bytes = response.candidates[0].content.parts[0].inline_data.data
        if isinstance(audio_bytes, str):
            return audio_bytes
        return base64.b64encode(audio_bytes).decode()
    except Exception as e:
        print(f"TTS failed: {e}")
        return None
