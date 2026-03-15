# Math Stories — Flask Prototype

A standalone Python/Flask app that generates Grade 4 math stories using Google Gemini, with optional Imagen illustrations and Cloud TTS narration.

## Quick Start (Local)

```bash
# 1. Enter the prototype directory
cd prototype

# 2. Copy the environment template and add your API key
cp .env.example .env
#    → Edit .env and set GEMINI_API_KEY=<your Google AI Studio key>

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the development server
python app.py

# 5. Open in your browser
open http://localhost:5000
```

## Cloud Run Deploy

```bash
gcloud run deploy math-stories \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

Set the `GEMINI_API_KEY` secret in Cloud Run after deploying:

```bash
gcloud run services update math-stories \
  --set-env-vars GEMINI_API_KEY=<your-key> \
  --region us-central1
```

## Architecture

| File | Purpose |
|------|---------|
| `app.py` | Flask routes — `/`, `/api/story`, `/api/image`, `/api/narrate` |
| `story_engine.py` | Gemini prompt logic for all 6 story beats |
| `templates/index.html` | Kid-friendly single-page UI |
| `Dockerfile` | Container image for Cloud Run |
| `requirements.txt` | Python dependencies |

## API Reference

### `POST /api/story`
```json
{ "topic": "multiplication", "place": "candy volcano",
  "sidekick": "talking pizza", "item": "gems", "mood": "silly" }
```
Returns:
```json
{ "beats": [{ "type": "setup", "text": "...", "imagePrompt": "..." }, ...] }
```

### `POST /api/image`
```json
{ "prompt": "Colorful cartoon of a talking pizza at a candy volcano..." }
```
Returns: `{ "image": "<base64>", "mimeType": "image/png" }`  
Falls back to an SVG placeholder if Imagen is unavailable on your API key.

### `POST /api/narrate`
```json
{ "text": "Once upon a time at the candy volcano..." }
```
Returns: `{ "audio": "<base64 MP3>", "mimeType": "audio/mpeg" }`  
Returns `503` if Google Cloud TTS is not configured.
