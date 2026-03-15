"""Flask app for Math Stories prototype."""

import base64
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
from google import genai
from google.genai import types

from story_engine import generate_story

load_dotenv()

app = Flask(__name__)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.route("/")
def index():
    """Serve the main HTML page."""
    return render_template("index.html")


@app.route("/api/story", methods=["POST"])
def api_story():
    """Generate a full math story.

    Accepts JSON: {topic, place, sidekick, item, mood}
    Returns JSON: {beats: [{type, text, imagePrompt}]}
    """
    data = request.get_json(force=True) or {}
    topic = data.get("topic", "multiplication")
    place = data.get("place", "a magical forest")
    sidekick = data.get("sidekick", "a friendly robot")
    item = data.get("item", "apples")
    mood = data.get("mood", "silly")

    try:
        beats = generate_story(topic, place, sidekick, item, mood)
        return jsonify({"beats": beats})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/image", methods=["POST"])
def api_image():
    """Generate an image using Imagen 3.

    Accepts JSON: {prompt}
    Returns base64 PNG or a placeholder SVG if Imagen is unavailable.
    """
    data = request.get_json(force=True) or {}
    prompt = data.get("prompt", "A colorful cartoon scene")

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        svg = _make_placeholder_svg(prompt)
        b64 = base64.b64encode(svg.encode("utf-8")).decode("utf-8")
        return jsonify({"image": b64, "mimeType": "image/svg+xml"})

    try:
        client = genai.Client(api_key=api_key)
        result = client.models.generate_images(
            model="imagen-3.0-generate-001",
            prompt=prompt,
            config=types.GenerateImagesConfig(number_of_images=1),
        )
        image_bytes = result.generated_images[0].image.image_bytes
        b64 = base64.b64encode(image_bytes).decode("utf-8")
        return jsonify({"image": b64, "mimeType": "image/png"})
    except Exception:
        # Return a cheerful placeholder SVG when Imagen is unavailable
        svg = _make_placeholder_svg(prompt)
        b64 = base64.b64encode(svg.encode("utf-8")).decode("utf-8")
        return jsonify({"image": b64, "mimeType": "image/svg+xml"})


@app.route("/api/narrate", methods=["POST"])
def api_narrate():
    """Convert text to speech using Google Cloud TTS.

    Accepts JSON: {text}
    Returns base64 MP3.
    """
    data = request.get_json(force=True) or {}
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "text is required"}), 400

    try:
        from google.cloud import texttospeech  # type: ignore

        tts_client = texttospeech.TextToSpeechClient()
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL,
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )
        response = tts_client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )
        b64 = base64.b64encode(response.audio_content).decode("utf-8")
        return jsonify({"audio": b64, "mimeType": "audio/mpeg"})
    except Exception as exc:
        return jsonify({"error": f"TTS unavailable: {exc}"}), 503


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _make_placeholder_svg(prompt: str) -> str:
    """Return a colorful SVG placeholder with the prompt text."""
    # Truncate prompt so it fits inside the SVG
    display = prompt[:120] + ("…" if len(prompt) > 120 else "")
    # Escape XML special characters
    safe = (
        display.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )
    # Wrap long text into ~40-char lines for readability
    words = safe.split()
    lines: list[str] = []
    current = ""
    for word in words:
        if len(current) + len(word) + 1 > 42:
            lines.append(current.strip())
            current = word + " "
        else:
            current += word + " "
    if current.strip():
        lines.append(current.strip())

    text_elements = "".join(
        f'<text x="200" y="{130 + i * 26}" font-size="15" fill="#4a1d96" '
        f'text-anchor="middle">{line}</text>'
        for i, line in enumerate(lines[:6])
    )

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e0f2fe"/>
      <stop offset="100%" style="stop-color:#fce7f3"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg)" rx="16"/>
  <text x="200" y="60" font-size="48" text-anchor="middle">🎨</text>
  <text x="200" y="100" font-size="16" fill="#6b21a8" text-anchor="middle"
        font-weight="bold">Illustration coming soon!</text>
  {text_elements}
</svg>"""


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
