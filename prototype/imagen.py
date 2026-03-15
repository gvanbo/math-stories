"""
Imagen 3 image generation wrapper for 'Once Upon a Number'.
Generates base64-encoded PNG illustrations from text prompts.
"""

import base64
import os
from google import genai
from google.genai import types


def get_client():
    api_key = os.environ.get("GEMINI_API_KEY", "")
    return genai.Client(api_key=api_key)


def generate_image(prompt: str) -> str | None:
    """Generate an image from a prompt using Imagen 3.

    Returns base64-encoded PNG string, or None if generation fails.
    """
    if not prompt:
        return None
    try:
        client = get_client()
        full_prompt = (
            f"Children's book illustration, colorful, bright, cheerful, "
            f"Grade 4 appropriate, cartoon style: {prompt}"
        )
        response = client.models.generate_images(
            model="imagen-3.0-generate-001",
            prompt=full_prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="16:9",
                safety_filter_level="block_low_and_above",
            ),
        )
        image_bytes = response.generated_images[0].image.image_bytes
        return base64.b64encode(image_bytes).decode()
    except Exception as e:
        print(f"Imagen failed: {e}")
        return None
