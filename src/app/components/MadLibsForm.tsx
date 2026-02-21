'use client';

import { useState } from 'react';
import type { UserInputs } from '@/types';

interface MadLibsFormProps {
  onSubmit: (inputs: UserInputs) => void;
  disabled?: boolean;
}

const PLACEHOLDERS = {
  verb1: 'e.g., zoomed, jumped, danced',
  verb2: 'e.g., launched, explored, swam',
  noun1: 'e.g., rocket, treasure, crystal',
  noun2: 'e.g., asteroid, map, rainbow',
  place: 'e.g., a space station, a pirate ship',
  mood: 'e.g., excited, brave, curious',
  sidekick: 'e.g., a robot hamster, a baby dragon',
};

export default function MadLibsForm({ onSubmit, disabled }: MadLibsFormProps) {
  const [verb1, setVerb1] = useState('');
  const [verb2, setVerb2] = useState('');
  const [noun1, setNoun1] = useState('');
  const [noun2, setNoun2] = useState('');
  const [place, setPlace] = useState('');
  const [mood, setMood] = useState('');
  const [sidekick, setSidekick] = useState('');

  const isComplete = verb1 && noun1 && place && mood && sidekick;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete || disabled) return;

    onSubmit({
      verbs: [verb1, verb2].filter(Boolean),
      nouns: [noun1, noun2].filter(Boolean),
      place,
      mood,
      sidekick,
    });
  };

  return (
    <div className="card" id="madlibs-section">
      <h2 className="card__title">
        <span className="card__title-emoji">🎭</span>
        Make It YOUR Story!
      </h2>
      <form onSubmit={handleSubmit} className="madlibs-form">
        <div className="madlibs-form__row">
          <div className="madlibs-form__group">
            <label className="madlibs-form__label" htmlFor="madlibs-verb1">
              ⚡ Action Word
            </label>
            <input
              id="madlibs-verb1"
              className="madlibs-form__input"
              placeholder={PLACEHOLDERS.verb1}
              value={verb1}
              onChange={(e) => setVerb1(e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="madlibs-form__group">
            <label className="madlibs-form__label" htmlFor="madlibs-verb2">
              ⚡ Another Action Word
            </label>
            <input
              id="madlibs-verb2"
              className="madlibs-form__input"
              placeholder={PLACEHOLDERS.verb2}
              value={verb2}
              onChange={(e) => setVerb2(e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="madlibs-form__row">
          <div className="madlibs-form__group">
            <label className="madlibs-form__label" htmlFor="madlibs-noun1">
              🎯 Thing
            </label>
            <input
              id="madlibs-noun1"
              className="madlibs-form__input"
              placeholder={PLACEHOLDERS.noun1}
              value={noun1}
              onChange={(e) => setNoun1(e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="madlibs-form__group">
            <label className="madlibs-form__label" htmlFor="madlibs-noun2">
              🎯 Another Thing
            </label>
            <input
              id="madlibs-noun2"
              className="madlibs-form__input"
              placeholder={PLACEHOLDERS.noun2}
              value={noun2}
              onChange={(e) => setNoun2(e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="madlibs-form__group">
          <label className="madlibs-form__label" htmlFor="madlibs-place">
            🗺️ Place
          </label>
          <input
            id="madlibs-place"
            className="madlibs-form__input"
            placeholder={PLACEHOLDERS.place}
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="madlibs-form__row">
          <div className="madlibs-form__group">
            <label className="madlibs-form__label" htmlFor="madlibs-mood">
              😄 Mood
            </label>
            <input
              id="madlibs-mood"
              className="madlibs-form__input"
              placeholder={PLACEHOLDERS.mood}
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="madlibs-form__group">
            <label className="madlibs-form__label" htmlFor="madlibs-sidekick">
              🐾 Sidekick
            </label>
            <input
              id="madlibs-sidekick"
              className="madlibs-form__input"
              placeholder={PLACEHOLDERS.sidekick}
              value={sidekick}
              onChange={(e) => setSidekick(e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>

        <button
          id="madlibs-submit"
          type="submit"
          className="btn btn--secondary btn--full-width"
          disabled={disabled || !isComplete}
        >
          ✨ Create My Story!
        </button>
      </form>
    </div>
  );
}
