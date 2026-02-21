'use client';

import { useState } from 'react';
import QueryInput from './components/QueryInput';
import MadLibsForm from './components/MadLibsForm';
import StoryDisplay from './components/StoryDisplay';
import FeedbackForm from './components/FeedbackForm';
import type { Outcome, GeneratedStory, UserInputs } from '@/types';

type AppStep = 'query' | 'outcomes' | 'madlibs' | 'loading' | 'story' | 'feedback' | 'done';

const STEP_ORDER: AppStep[] = ['query', 'outcomes', 'madlibs', 'loading', 'story', 'feedback', 'done'];

function getStepIndex(step: AppStep): number {
  return STEP_ORDER.indexOf(step);
}

export default function Home() {
  const [step, setStep] = useState<AppStep>('query');
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome | null>(null);
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setError(null);
    try {
      const res = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'search', query }),
      });
      const data = await res.json();
      if (data.outcomes && data.outcomes.length > 0) {
        setOutcomes(data.outcomes);
        setStep('outcomes');
      } else {
        setError('No topics found. Try searching for "multiplication" or "equal groups".');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleSelectOutcome = (outcome: Outcome) => {
    setSelectedOutcome(outcome);
    setStep('madlibs');
  };

  const handleMadLibsSubmit = async (inputs: UserInputs) => {
    if (!selectedOutcome) return;
    setStep('loading');
    setError(null);
    try {
      const res = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          outcomeCode: selectedOutcome.code,
          userInputs: inputs,
        }),
      });
      const data = await res.json();
      if (data.story) {
        setStory(data.story);
        setStep('story');
      } else {
        setError(data.error || 'Could not generate story.');
        setStep('madlibs');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setStep('madlibs');
    }
  };

  const handleFeedback = async (rating: number, enjoyedMost: string, foundHardest: string) => {
    try {
      await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'feedback',
          sessionId: story?.id || 'unknown',
          feedback: {
            sessionId: story?.id || 'unknown',
            rating,
            enjoyedMost,
            foundHardest,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch {
      // Silent fail for feedback — non-critical
    }
    setStep('done');
  };

  const handleReset = () => {
    setStep('query');
    setOutcomes([]);
    setSelectedOutcome(null);
    setStory(null);
    setError(null);
  };

  const currentStepIndex = getStepIndex(step);

  return (
    <div className="app-container">
      <header className="app-header">
        <span className="app-header__emoji">🧮</span>
        <h1 className="app-header__title">Math Stories</h1>
        <p className="app-header__subtitle">
          Grade 4 math adventures — powered by YOU!
        </p>
      </header>

      {/* Step Indicator */}
      <div className="steps" id="step-indicator">
        {['query', 'outcomes', 'madlibs', 'story', 'feedback'].map((s, i) => (
          <div
            key={s}
            className={`steps__dot ${
              i === Math.min(currentStepIndex, 4) ? 'steps__dot--active' : ''
            } ${i < currentStepIndex ? 'steps__dot--done' : ''}`}
          />
        ))}
      </div>

      {error && (
        <div className="card" style={{ borderColor: 'var(--color-warning)' }}>
          <p style={{ color: 'var(--color-warning)' }}>⚠️ {error}</p>
        </div>
      )}

      {/* Step: Query */}
      {(step === 'query' || step === 'outcomes') && (
        <QueryInput
          onSubmit={handleSearch}
          disabled={step === 'outcomes'}
        />
      )}

      {/* Step: Outcomes */}
      {step === 'outcomes' && outcomes.length > 0 && (
        <div className="card" id="outcomes-section">
          <h2 className="card__title">
            <span className="card__title-emoji">📚</span>
            Choose a Topic
          </h2>
          <div className="outcomes">
            {outcomes.map((outcome) => (
              <button
                key={outcome.code}
                id={`outcome-${outcome.code}`}
                className={`outcomes__item ${
                  selectedOutcome?.code === outcome.code ? 'outcomes__item--selected' : ''
                }`}
                onClick={() => handleSelectOutcome(outcome)}
              >
                <span className="outcomes__code">{outcome.code}</span>
                <p className="outcomes__desc">{outcome.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Mad-Libs */}
      {step === 'madlibs' && (
        <MadLibsForm onSubmit={handleMadLibsSubmit} />
      )}

      {/* Step: Loading */}
      {step === 'loading' && (
        <div className="card">
          <div className="loading">
            <div className="loading__spinner" />
            <p className="loading__text">Creating your math story…</p>
          </div>
        </div>
      )}

      {/* Step: Story */}
      {step === 'story' && story && (
        <>
          <StoryDisplay story={story} />
          <button
            id="continue-to-feedback"
            className="btn btn--primary btn--full-width"
            onClick={() => setStep('feedback')}
            style={{ marginBottom: 'var(--space-lg)' }}
          >
            📝 Tell Us What You Think!
          </button>
        </>
      )}

      {/* Step: Feedback */}
      {step === 'feedback' && (
        <FeedbackForm onSubmit={handleFeedback} />
      )}

      {/* Step: Done */}
      {step === 'done' && (
        <div className="card">
          <div className="success">
            <span className="success__emoji">🎉</span>
            <p className="success__text">
              Thanks for your feedback! You're a math superstar!
            </p>
          </div>
          <button
            id="new-story"
            className="btn btn--primary btn--full-width"
            onClick={handleReset}
            style={{ marginTop: 'var(--space-lg)' }}
          >
            🚀 Create Another Story!
          </button>
        </div>
      )}
    </div>
  );
}
