import { NextRequest, NextResponse } from 'next/server';
import { findOutcomesForQuery } from '@/layers/curriculum/tools/findOutcomesForQuery';
import { getConceptForOutcome } from '@/layers/concept/tools/getConceptForOutcome';
import { constructStory } from '@/layers/story/tools/constructStory';
import { recordFeedback } from '@/layers/personalization/tools/feedback';
import type { UserInputs, Feedback } from '@/types';

/**
 * POST /api/story
 *
 * Actions:
 *  - "search": Find outcomes for a query
 *  - "generate": Generate a story for a concept + user inputs (calls Gemini AI)
 *  - "feedback": Record feedback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    switch (body.action) {
      case 'search': {
        const outcomes = findOutcomesForQuery(body.query || '');
        return NextResponse.json({ outcomes });
      }

      case 'generate': {
        const { outcomeCode, userInputs } = body as {
          action: string;
          outcomeCode: string;
          userInputs: UserInputs;
        };

        // Get concept for the selected outcome
        const concept = getConceptForOutcome(outcomeCode);
        if (!concept) {
          return NextResponse.json(
            { error: 'No concept found for this outcome' },
            { status: 404 },
          );
        }

        // Construct the story — await required as Gemini AI generation is async
        const story = await constructStory(
          concept.id,
          outcomeCode,
          {
            id: 'web-user',
            preferences: {},
            readingLevel: 'grade4',
            humorLevel: 'high',
            modalityPrefs: ['visual'],
          },
          userInputs,
        );

        if (!story) {
          return NextResponse.json(
            { error: 'Could not generate story' },
            { status: 500 },
          );
        }

        return NextResponse.json({ story });
      }

      case 'feedback': {
        const { sessionId, feedback } = body as {
          action: string;
          sessionId: string;
          feedback: Feedback;
        };
        const result = recordFeedback(sessionId, feedback);
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 },
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
