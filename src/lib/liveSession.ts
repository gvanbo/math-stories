import { GoogleGenAI, Modality } from '@google/genai';
import { LIVE_MODEL } from './geminiClient';

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenAI({ apiKey });

export interface LiveSessionCallbacks {
  onText: (text: string) => void;
  onAudio: (audioBase64: string) => void;
  onError: (error: Error) => void;
  onClose: () => void;
}

/**
 * Starts a Gemini Live API session for real-time student interaction.
 *
 * The host persona (Math Stories guide) is injected as the system instruction
 * so the agent stays in character throughout the session.
 *
 * Usage:
 *   const session = await startLiveSession(systemPrompt, callbacks);
 *   await session.sendText('What is multiplication?');
 *   session.close();
 */
export async function startLiveSession(
  systemInstruction: string,
  callbacks: LiveSessionCallbacks,
) {
  const session = await genAI.live.connect({
    model: LIVE_MODEL,
    config: {
      responseModalities: [Modality.AUDIO, Modality.TEXT],
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
    },
    callbacks: {
      onmessage: (msg) => {
        // Handle streaming text
        const text = msg.serverContent?.modelTurn?.parts
          ?.map((p: { text?: string }) => p.text ?? '')
          .join('');
        if (text) callbacks.onText(text);

        // Handle streaming audio
        const audioParts = msg.serverContent?.modelTurn?.parts?.filter(
          (p: { inlineData?: { mimeType: string; data: string } }) =>
            p.inlineData?.mimeType?.startsWith('audio/'),
        );
        for (const part of audioParts ?? []) {
          if (part.inlineData?.data) callbacks.onAudio(part.inlineData.data);
        }
      },
      onerror: (e: Error) => callbacks.onError(e),
      onclose: () => callbacks.onClose(),
    },
  });

  return {
    /** Send a text message to the live session */
    sendText: async (text: string) => {
      await session.sendClientContent({
        turns: [{ role: 'user', parts: [{ text }] }],
      });
    },
    /** Send raw audio (PCM base64) to the live session */
    sendAudio: async (audioBase64: string) => {
      await session.sendRealtimeInput({
        audio: { data: audioBase64, mimeType: 'audio/pcm;rate=16000' },
      });
    },
    /** Close the live session cleanly */
    close: () => session.close(),
  };
}
