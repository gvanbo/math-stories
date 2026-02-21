import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QueryInput from '../QueryInput';
import MadLibsForm from '../MadLibsForm';
import StoryDisplay from '../StoryDisplay';
import FeedbackForm from '../FeedbackForm';
import type { GeneratedStory } from '@/types';

// ---- QueryInput ----

describe('QueryInput', () => {
  it('renders the search input', () => {
    render(<QueryInput onSubmit={() => {}} />);
    expect(screen.getByLabelText('Math topic search')).toBeDefined();
  });

  it('calls onSubmit with the query text', () => {
    const onSubmit = vi.fn();
    render(<QueryInput onSubmit={onSubmit} />);
    const input = screen.getByLabelText('Math topic search') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'multiplication' } });
    fireEvent.submit(input.closest('form')!);
    expect(onSubmit).toHaveBeenCalledWith('multiplication');
  });

  it('disables input when disabled prop is true', () => {
    render(<QueryInput onSubmit={() => {}} disabled />);
    expect(screen.getByLabelText('Math topic search')).toHaveProperty('disabled', true);
  });

  it('does not submit empty query', () => {
    const onSubmit = vi.fn();
    render(<QueryInput onSubmit={onSubmit} />);
    const input = screen.getByLabelText('Math topic search') as HTMLInputElement;
    fireEvent.submit(input.closest('form')!);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

// ---- MadLibsForm ----

describe('MadLibsForm', () => {
  it('renders all required inputs', () => {
    render(<MadLibsForm onSubmit={() => {}} />);
    expect(document.getElementById('madlibs-verb1')).toBeDefined();
    expect(document.getElementById('madlibs-place')).toBeDefined();
    expect(document.getElementById('madlibs-mood')).toBeDefined();
    expect(document.getElementById('madlibs-sidekick')).toBeDefined();
  });

  it('button is disabled when required fields are empty', () => {
    render(<MadLibsForm onSubmit={() => {}} />);
    const btn = screen.getByText(/Create My Story/);
    expect(btn).toHaveProperty('disabled', true);
  });

  it('calls onSubmit with UserInputs when form is complete', () => {
    const onSubmit = vi.fn();
    render(<MadLibsForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText(/zoomed/), { target: { value: 'jumped' } });
    fireEvent.change(screen.getByPlaceholderText(/rocket, treasure/), { target: { value: 'gem' } });
    fireEvent.change(screen.getByPlaceholderText(/space station/), { target: { value: 'a castle' } });
    fireEvent.change(screen.getByPlaceholderText(/excited/), { target: { value: 'happy' } });
    fireEvent.change(screen.getByPlaceholderText(/robot hamster/), { target: { value: 'a cat' } });

    const form = screen.getByText(/Create My Story/).closest('form')!;
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        verbs: ['jumped'],
        nouns: ['gem'],
        place: 'a castle',
        mood: 'happy',
        sidekick: 'a cat',
      }),
    );
  });
});

// ---- StoryDisplay ----

describe('StoryDisplay', () => {
  const mockStory: GeneratedStory = {
    id: 'test-story',
    conceptId: 'mult-equal-groups',
    outcomeCode: '4.N.3',
    context: {
      conceptId: 'mult-equal-groups',
      skeleton: {
        conceptId: 'mult-equal-groups',
        beats: [],
        requiredModels: [],
        forbiddenPatterns: [],
      },
      characters: [],
      userInputs: { verbs: [], nouns: [], place: '', mood: '', sidekick: '' },
      personalizedBeats: [],
      narrativePrompt: '',
    },
    beatNarratives: [
      { beatType: 'setup', narrative: 'Once upon a time...', modelsUsed: [], characterVoices: [] },
      { beatType: 'reasoning', narrative: 'The big idea!', modelsUsed: ['model-array'], characterVoices: [] },
    ],
    selfCheck: {
      mathExplanation: 'This teaches multiplication.',
      modelsMatch: true,
      strategiesMatch: true,
      passes: true,
      mismatches: [],
    },
    timestamp: '2024-01-01T00:00:00Z',
  };

  it('renders all beat narratives', () => {
    render(<StoryDisplay story={mockStory} />);
    expect(screen.getByText('Once upon a time...')).toBeDefined();
    expect(screen.getByText('The big idea!')).toBeDefined();
  });

  it('displays beat badges', () => {
    render(<StoryDisplay story={mockStory} />);
    expect(screen.getByText(/The Beginning/)).toBeDefined();
    expect(screen.getByText(/The Big Idea/)).toBeDefined();
  });

  it('shows model tags when models are used', () => {
    render(<StoryDisplay story={mockStory} />);
    expect(screen.getByText(/model-array/)).toBeDefined();
  });

  it('shows self-check pass', () => {
    render(<StoryDisplay story={mockStory} />);
    expect(screen.getByText('Math check passed!')).toBeDefined();
  });
});

// ---- FeedbackForm ----

describe('FeedbackForm', () => {
  it('renders star rating buttons', () => {
    render(<FeedbackForm onSubmit={() => {}} />);
    expect(screen.getByLabelText('1 star')).toBeDefined();
    expect(screen.getByLabelText('5 stars')).toBeDefined();
  });

  it('submit is disabled with no rating', () => {
    render(<FeedbackForm onSubmit={() => {}} />);
    expect(screen.getByText(/Send Feedback/)).toHaveProperty('disabled', true);
  });

  it('calls onSubmit with rating after star selection', () => {
    const onSubmit = vi.fn();
    render(<FeedbackForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByLabelText('4 stars'));

    const form = screen.getByText(/Send Feedback/).closest('form')!;
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith(4, '', '');
  });
});
