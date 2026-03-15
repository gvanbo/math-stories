"""
'Once Upon a Number' — Flask application.
Immersive, adaptive Grade 4 math stories powered by Gemini + Imagen.
"""

import os
import secrets

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request, session

from curriculum import CONCEPTS
from evaluator import award_badge, evaluate_response
from imagen import generate_image
from story_engine import (
    beat1_prompt,
    beat2_prompt,
    beat3_prompt,
    beat4_confused_prompt,
    beat4_prompt,
    beat5_continue_prompt,
    beat5_prompt,
    beat6_hint_prompt,
    beat6_prompt,
    beat6_solution_prompt,
    beat7_prompt,
    extract_challenge_data,
    extract_image_prompt,
    generate_beat,
)
from tts import narrate

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", secrets.token_hex(32))
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_HTTPONLY"] = True


# ── Helpers ───────────────────────────────────────────────────────────────────


def _get_concept(concept_id: str) -> dict | None:
    return CONCEPTS.get(concept_id)


def _build_beat_response(
    beat_number: int,
    story_text: str,
    image_prompt: str,
    interaction_type: str,
    interaction_prompt: str,
    *,
    challenge_question: str | None = None,
    challenge_answer: str | None = None,
    is_final_beat: bool = False,
    generate_img: bool = True,
    generate_audio: bool = True,
) -> dict:
    image_b64 = generate_image(image_prompt) if (generate_img and image_prompt) else None
    audio_b64 = narrate(story_text) if generate_audio else None

    return {
        "beat_number": beat_number,
        "story_text": story_text,
        "image_prompt": image_prompt,
        "image_base64": image_b64,
        "audio_base64": audio_b64,
        "interaction_type": interaction_type,
        "interaction_prompt": interaction_prompt,
        "challenge_question": challenge_question,
        "challenge_answer": challenge_answer,
        "is_final_beat": is_final_beat,
    }


# ── Routes ────────────────────────────────────────────────────────────────────


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/curriculum")
def get_curriculum():
    """Return full concept list with prerequisites."""
    concepts_out = []
    completed = session.get("completed_concepts", [])
    for cid, c in CONCEPTS.items():
        concepts_out.append(
            {
                "id": cid,
                "title": c["title"],
                "strand": c["strand"],
                "prerequisite_ids": c["prerequisite_ids"],
                "completed": cid in completed,
                "unlocked": all(p in completed for p in c["prerequisite_ids"]),
            }
        )
    return jsonify(concepts_out)


@app.route("/api/progress")
def get_progress():
    """Return student's completed concepts + badges."""
    return jsonify(
        {
            "completed_concepts": session.get("completed_concepts", []),
            "badges": session.get("badges", []),
        }
    )


@app.route("/api/session/start", methods=["POST"])
def start_session():
    """Initialize session with personalization data + selected concept."""
    data = request.get_json(force=True)
    place = data.get("place", "a magical forest").strip() or "a magical forest"
    sidekick = data.get("sidekick", "Bolt the robot").strip() or "Bolt the robot"
    item = data.get("item", "crystals").strip() or "crystals"
    mood = data.get("mood", "excited").strip() or "excited"
    concept_id = data.get("concept_id", "multiplication_equal_groups").strip()

    concept = _get_concept(concept_id)
    if not concept:
        return jsonify({"error": "Unknown concept"}), 400

    session["place"] = place
    session["sidekick"] = sidekick
    session["item"] = item
    session["mood"] = mood
    session["concept_id"] = concept_id
    session["current_beat"] = 1
    session["conversation_history"] = []
    session["student_responses"] = []
    session["challenge_answer"] = None
    session["challenge_attempts"] = 0
    session["beat5_predictions"] = []
    session.modified = True

    return jsonify({"status": "ok", "concept": concept["title"]})


@app.route("/api/beat/next", methods=["POST"])
def next_beat():
    """Generate the next story beat."""
    data = request.get_json(force=True)
    beat_number = int(data.get("beat_number", session.get("current_beat", 1)))
    student_response = data.get("student_response", "").strip()
    confused = data.get("confused", False)

    place = session.get("place", "a magical place")
    sidekick = session.get("sidekick", "Bolt the robot")
    item = session.get("item", "crystals")
    mood = session.get("mood", "excited")
    concept_id = session.get("concept_id", "multiplication_equal_groups")
    concept = _get_concept(concept_id)
    if not concept:
        return jsonify({"error": "Session not initialized"}), 400

    history = session.get("conversation_history", [])

    try:
        if beat_number == 1:
            prompt = beat1_prompt(
                place, sidekick, item, mood, concept["title"], concept["big_idea"]
            )
            raw = generate_beat(prompt, history)
            story_text, image_prompt = extract_image_prompt(raw)
            session["current_beat"] = 2
            session["conversation_history"] = history
            session.modified = True
            return jsonify(
                _build_beat_response(
                    1,
                    story_text,
                    image_prompt,
                    "button",
                    "What happens next?",
                )
            )

        elif beat_number == 2:
            prompt = beat2_prompt(sidekick, item, concept["title"])
            raw = generate_beat(prompt, history)
            story_text, image_prompt = extract_image_prompt(raw)
            session["current_beat"] = 3
            session["conversation_history"] = history
            session.modified = True
            return jsonify(
                _build_beat_response(
                    2,
                    story_text,
                    image_prompt,
                    "text_input",
                    "How would YOU solve this? Type your idea!",
                )
            )

        elif beat_number == 3:
            if student_response:
                session["student_responses"] = session.get("student_responses", []) + [
                    {"beat": 2, "response": student_response}
                ]
            prompt = beat3_prompt(sidekick, student_response or "count them one by one")
            raw = generate_beat(prompt, history)
            story_text, image_prompt = extract_image_prompt(raw)
            session["current_beat"] = 4
            session["conversation_history"] = history
            session.modified = True
            return jsonify(
                _build_beat_response(
                    3,
                    story_text,
                    image_prompt,
                    "button",
                    "Show me the better way!",
                )
            )

        elif beat_number == 4:
            if confused:
                prompt = beat4_confused_prompt(concept["title"], sidekick, item)
            else:
                anchors = concept.get("mnemonic_anchors", {})
                prompt = beat4_prompt(sidekick, item, place, concept["title"], anchors)
            raw = generate_beat(prompt, history)
            story_text, image_prompt = extract_image_prompt(raw)
            session["current_beat"] = 5
            session["conversation_history"] = history
            session.modified = True
            interaction_type = "confused_or_got_it"
            interaction_prompt = "Did you get it?"
            return jsonify(
                _build_beat_response(
                    4,
                    story_text,
                    image_prompt,
                    interaction_type,
                    interaction_prompt,
                )
            )

        elif beat_number == 5:
            # First call: generate the two prediction setup
            if not data.get("predictions_submitted"):
                prompt = beat5_prompt(sidekick, concept["title"])
                raw = generate_beat(prompt, history)
                story_text, image_prompt = extract_image_prompt(raw)
                session["current_beat"] = 5
                session["conversation_history"] = history
                session.modified = True
                return jsonify(
                    _build_beat_response(
                        5,
                        story_text,
                        image_prompt,
                        "two_predictions",
                        "Type your two predictions!",
                    )
                )
            else:
                # Student submitted their two predictions
                prediction1 = data.get("prediction1", "").strip() or "I'm not sure"
                prediction2 = data.get("prediction2", "").strip() or "I'm not sure"
                session["beat5_predictions"] = [prediction1, prediction2]
                session["student_responses"] = session.get("student_responses", []) + [
                    {"beat": 5, "prediction1": prediction1, "prediction2": prediction2}
                ]
                prompt = beat5_continue_prompt(sidekick, prediction1, prediction2, concept["title"])
                raw = generate_beat(prompt, history)
                story_text, image_prompt = extract_image_prompt(raw)
                session["current_beat"] = 6
                session["conversation_history"] = history
                session.modified = True
                return jsonify(
                    _build_beat_response(
                        5,
                        story_text,
                        image_prompt,
                        "button",
                        "On to the final challenge!",
                    )
                )

        elif beat_number == 6:
            attempts = session.get("challenge_attempts", 0)
            stored_answer = session.get("challenge_answer")

            # First visit to beat 6 — generate the challenge
            if not stored_answer:
                prompt = beat6_prompt(sidekick, item, concept["title"])
                raw = generate_beat(prompt, history)
                story_text, question, answer, image_prompt = extract_challenge_data(raw)
                session["challenge_answer"] = answer
                session["challenge_attempts"] = 0
                session["current_beat"] = 6
                session["conversation_history"] = history
                session.modified = True
                return jsonify(
                    _build_beat_response(
                        6,
                        story_text,
                        image_prompt,
                        "number_input",
                        "Type your answer to save the day!",
                        challenge_question=question,
                        challenge_answer=None,  # Don't send answer to client
                    )
                )

            # Student submitted an answer
            student_answer = str(data.get("student_answer", "")).strip()
            correct_answer = str(stored_answer).strip()

            # Normalize: remove spaces, handle decimals
            def normalize_answer(a):
                try:
                    return str(int(float(a.replace(",", "").replace(" ", ""))))
                except Exception:
                    return a.lower().strip()

            if normalize_answer(student_answer) == normalize_answer(correct_answer):
                # Correct!
                session["challenge_attempts"] = 0
                session["challenge_answer"] = None
                session["current_beat"] = 7
                session["conversation_history"] = history
                session.modified = True
                return jsonify(
                    {
                        "correct": True,
                        "next_beat": 7,
                        "message": "That's it! You saved the day! 🎉",
                    }
                )
            else:
                attempts += 1
                session["challenge_attempts"] = attempts
                session.modified = True

                if attempts == 1:
                    # Give a hint
                    challenge_q = data.get("challenge_question", "the challenge")
                    prompt = beat6_hint_prompt(sidekick, challenge_q, student_answer)
                    raw = generate_beat(prompt, history)
                    story_text, image_prompt = extract_image_prompt(raw)
                    session["conversation_history"] = history
                    session.modified = True
                    return jsonify(
                        {
                            "correct": False,
                            "attempts": attempts,
                            "hint_text": story_text,
                            "image_prompt": image_prompt,
                            "image_base64": generate_image(image_prompt),
                        }
                    )
                else:
                    # Show solution, move on
                    challenge_q = data.get("challenge_question", "the challenge")
                    prompt = beat6_solution_prompt(sidekick, challenge_q, correct_answer)
                    raw = generate_beat(prompt, history)
                    story_text, image_prompt = extract_image_prompt(raw)
                    session["challenge_answer"] = None
                    session["challenge_attempts"] = 0
                    session["current_beat"] = 7
                    session["conversation_history"] = history
                    session.modified = True
                    return jsonify(
                        {
                            "correct": False,
                            "gave_up": True,
                            "solution_text": story_text,
                            "image_prompt": image_prompt,
                            "image_base64": generate_image(image_prompt),
                            "next_beat": 7,
                        }
                    )

        elif beat_number == 7:
            prompt = beat7_prompt(sidekick, concept["title"], item)
            raw = generate_beat(prompt, history)
            story_text, image_prompt = extract_image_prompt(raw)
            session["current_beat"] = 7
            session["conversation_history"] = history
            session.modified = True
            return jsonify(
                _build_beat_response(
                    7,
                    story_text,
                    image_prompt,
                    "text_input",
                    f"Explain {concept['title']} to {sidekick} in your own words!",
                    is_final_beat=True,
                )
            )

        else:
            return jsonify({"error": f"Unknown beat number: {beat_number}"}), 400

    except Exception as e:
        print(f"Beat {beat_number} error: {e}")
        return jsonify({"error": "Story generation failed. Please try again.", "detail": str(e)}), 500


@app.route("/api/image", methods=["POST"])
def api_image():
    """Generate an Imagen illustration for a given prompt."""
    data = request.get_json(force=True)
    prompt = data.get("prompt", "").strip()
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400
    image_b64 = generate_image(prompt)
    return jsonify({"image_base64": image_b64})


@app.route("/api/narrate", methods=["POST"])
def api_narrate():
    """Generate TTS audio for a text block."""
    data = request.get_json(force=True)
    text = data.get("text", "").strip()
    if not text:
        return jsonify({"error": "No text provided"}), 400
    audio_b64 = narrate(text)
    return jsonify({"audio_base64": audio_b64})


@app.route("/api/evaluate", methods=["POST"])
def api_evaluate():
    """Evaluate the student's final explanation and award a badge."""
    data = request.get_json(force=True)
    explanation = data.get("explanation", "").strip()

    if not explanation:
        return jsonify(
            {
                "error": "empty_response",
                "message": "Tell me what you think — even a guess is great!",
            }
        ), 400

    concept_id = session.get("concept_id", "multiplication_equal_groups")
    concept = _get_concept(concept_id)
    if not concept:
        return jsonify({"error": "No active session"}), 400

    sidekick = session.get("sidekick", "your sidekick")
    session["student_responses"] = session.get("student_responses", []) + [
        {"beat": 7, "explanation": explanation}
    ]

    try:
        result = evaluate_response(concept, explanation, sidekick)
        badge = award_badge(concept["title"], result["level"])

        # Persist badge + completed concept
        badges = session.get("badges", [])
        badges.append(badge)
        completed = session.get("completed_concepts", [])
        if concept_id not in completed:
            completed.append(concept_id)
        session["badges"] = badges
        session["completed_concepts"] = completed
        session.modified = True

        return jsonify(
            {
                "level": result["level"],
                "feedback": result["feedback"],
                "missed": result.get("missed", ""),
                "badge": badge,
            }
        )
    except Exception as e:
        print(f"Evaluation error: {e}")
        return jsonify({"error": "Evaluation failed. Please try again.", "detail": str(e)}), 500


if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(debug=debug, host="0.0.0.0", port=5000)
