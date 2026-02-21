'use client';

import type { GeneratedStory, BeatType } from '@/types';

interface StoryDisplayProps {
  story: GeneratedStory;
}

const BEAT_LABELS: Record<BeatType, { emoji: string; label: string }> = {
  setup: { emoji: '🌅', label: 'The Beginning' },
  groupsIntro: { emoji: '🔢', label: 'The Discovery' },
  representation: { emoji: '🎨', label: 'Drawing It Out' },
  reasoning: { emoji: '💡', label: 'The Big Idea' },
  generalize: { emoji: '🌟', label: 'It Works Everywhere!' },
  reflection: { emoji: '🏆', label: 'What We Learned' },
};

export default function StoryDisplay({ story }: StoryDisplayProps) {
  return (
    <div className="card" id="story-section">
      <h2 className="card__title">
        <span className="card__title-emoji">📖</span>
        Your Math Story
      </h2>
      <div className="story-display">
        {story.beatNarratives.map((beat, index) => {
          const beatInfo = BEAT_LABELS[beat.beatType] || { emoji: '📝', label: beat.beatType };
          return (
            <div
              key={`beat-${index}`}
              className="story-display__beat"
              id={`beat-${beat.beatType}`}
            >
              <span className={`story-display__beat-badge story-display__beat-badge--${beat.beatType}`}>
                {beatInfo.emoji} {beatInfo.label}
              </span>
              <p className="story-display__beat-text">{beat.narrative}</p>
              {beat.modelsUsed.length > 0 && (
                <div className="story-display__models">
                  {beat.modelsUsed.map((model) => (
                    <span key={model} className="story-display__model-tag">
                      📐 {model}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {story.selfCheck.passes && (
        <div className="success" id="self-check-pass">
          <span className="success__emoji">✅</span>
          <p className="success__text">Math check passed!</p>
        </div>
      )}
    </div>
  );
}
