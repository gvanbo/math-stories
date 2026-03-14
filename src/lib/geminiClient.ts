import { GoogleGenAI } from '@google/genai';

// Gemini AI client — used for both text generation and Live API sessions
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment variables');

export const genAI = new GoogleGenAI({ apiKey });

// Standard text generation model (fast fallback for story beat generation)
export const TEXT_MODEL = 'gemini-2.0-flash';

// Live API model — required for real-time voice/multimodal interaction
// This is the flagship model for the Gemini Live Agent Challenge
export const LIVE_MODEL = 'gemini-2.5-flash-preview-native-audio-dialog';

/**
 * Generate text content using Gemini (non-live, single-turn).
 * Used by constructStory to generate personalized story beats.
 */
export async function generateText(prompt: string): Promise<string> {
  const response = await genAI.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
  });
  return response.text ?? '';
}
