'use client';

import { useState } from 'react';

interface FeedbackFormProps {
  onSubmit: (rating: number, enjoyedMost: string, foundHardest: string) => void;
  disabled?: boolean;
}

export default function FeedbackForm({ onSubmit, disabled }: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [enjoyedMost, setEnjoyedMost] = useState('');
  const [foundHardest, setFoundHardest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && !disabled) {
      onSubmit(rating, enjoyedMost, foundHardest);
    }
  };

  return (
    <div className="card" id="feedback-section">
      <h2 className="card__title">
        <span className="card__title-emoji">💬</span>
        How Was It?
      </h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="feedback-form__stars" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              id={`star-${star}`}
              className={`feedback-form__star ${
                star <= (hoverRating || rating) ? 'feedback-form__star--active' : ''
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              disabled={disabled}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
            >
              ⭐
            </button>
          ))}
        </div>

        <div className="madlibs-form__group">
          <label className="madlibs-form__label" htmlFor="feedback-enjoyed">
            🎉 What did you enjoy most?
          </label>
          <textarea
            id="feedback-enjoyed"
            className="feedback-form__textarea"
            placeholder="I really liked when…"
            value={enjoyedMost}
            onChange={(e) => setEnjoyedMost(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="madlibs-form__group">
          <label className="madlibs-form__label" htmlFor="feedback-hardest">
            🤔 What was the hardest part?
          </label>
          <textarea
            id="feedback-hardest"
            className="feedback-form__textarea"
            placeholder="I found it tricky when…"
            value={foundHardest}
            onChange={(e) => setFoundHardest(e.target.value)}
            disabled={disabled}
          />
        </div>

        <button
          id="feedback-submit"
          type="submit"
          className="btn btn--accent btn--full-width"
          disabled={disabled || rating === 0}
        >
          📬 Send Feedback
        </button>
      </form>
    </div>
  );
}
