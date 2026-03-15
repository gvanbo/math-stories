# Once Upon a Number 📖✨

> Immersive, adaptive Grade 4 math stories powered by Gemini 2.0 Flash + Imagen 3

**Hackathon:** Gemini Live Agent Challenge — Creative Storyteller Category  
**Target Learner:** Grade 4 students (ages 9–10)

---

## Quick Start

```bash
cd prototype
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY from https://aistudio.google.com/apikey
pip install -r requirements.txt
python app.py
# Open http://localhost:5000
```

---

## What It Does

*Once Upon a Number* turns every math lesson into a 10-minute interactive story where the student is the hero. The app:

1. **Personalizes** every story with the student's favourite place, sidekick, and item
2. **Adapts** in real time based on student text responses
3. **Illustrates** each story beat with Imagen 3 generated art
4. **Narrates** the story with AI text-to-speech
5. **Evaluates** student understanding and awards badges
6. **Tracks** progress across the Alberta Grade 4 curriculum

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    STUDENT BROWSER                       │
│  index.html — Single Page App                           │
│  Mad-libs form → Story cards → Audio → Interaction      │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (JSON)
┌──────────────────────▼──────────────────────────────────┐
│              FLASK APP (Cloud Run)                       │
│                                                          │
│  app.py          — Routes + session management          │
│  story_engine.py — Beat prompts + conversation history  │
│  curriculum.py   — Alberta Gr4 concept definitions      │
│  evaluator.py    — Student response evaluation          │
│  imagen.py       — Illustration generation              │
│  tts.py          — Narration generation                 │
└──────┬───────────────────────┬───────────────────────────┘
       │                       │
┌──────▼──────┐    ┌───────────▼──────────┐
│ Gemini 2.0  │    │   Imagen 3.0         │
│ Flash       │    │   generate-001       │
│ Story gen   │    │   Illustrations      │
│ Evaluation  │    │                      │
└─────────────┘    └──────────────────────┘
```

---

## File Structure

```
prototype/
├── app.py                  # Flask app — all routes
├── story_engine.py         # Story generation, beat prompts, Gemini calls
├── curriculum.py           # Alberta Grade 4 math concepts + progression
├── evaluator.py            # Gemini-powered student response evaluation
├── tts.py                  # Text-to-speech wrapper
├── imagen.py               # Imagen 3 image generation wrapper
├── templates/
│   └── index.html          # Full single-page app UI
├── static/
│   └── placeholder.svg     # Fallback if Imagen fails
├── requirements.txt
├── Dockerfile
├── .env.example
└── README.md
```

---

## Cloud Run Deployment

```bash
gcloud run deploy once-upon-a-number \
  --source prototype/ \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key \
  --memory 512Mi \
  --timeout 120
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key |
| `SECRET_KEY` | Optional | Flask session secret (auto-generated if not set) |
