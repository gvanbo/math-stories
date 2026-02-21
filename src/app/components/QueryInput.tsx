'use client';

import { useState } from 'react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  disabled?: boolean;
}

export default function QueryInput({ onSubmit, disabled }: QueryInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSubmit(query.trim());
    }
  };

  return (
    <div className="card" id="query-section">
      <h2 className="card__title">
        <span className="card__title-emoji">🔍</span>
        What do you want to learn?
      </h2>
      <form onSubmit={handleSubmit} className="query-input">
        <input
          id="query-input"
          type="text"
          className="query-input__field"
          placeholder="Type a math topic… like 'multiplication' or 'equal groups'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
          aria-label="Math topic search"
        />
        <button
          id="query-submit"
          type="submit"
          className="query-input__button"
          disabled={disabled || !query.trim()}
          aria-label="Search"
        >
          🚀
        </button>
      </form>
    </div>
  );
}
