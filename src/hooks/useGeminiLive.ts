"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type ConnectionState = "disconnected" | "connecting" | "connected";

// Correct Live API model for the Gemini Live Agent Challenge
const LIVE_MODEL = "models/gemini-2.5-flash-preview-native-audio-dialog";

/**
 * useGeminiLive
 * Hook to manage bidirectional WebSocket connection with Gemini Live API.
 * Supports both Google AI Studio (GEMINI_API_KEY) and Vertex AI.
 */
export function useGeminiLive() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [messages, setMessages] = useState<Array<{ role: string; text: string }>>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playbackWorkletRef = useRef<AudioWorkletNode | null>(null);

  const cleanupAudio = useCallback(() => {
    if (playbackWorkletRef.current) playbackWorkletRef.current.disconnect();
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(console.error);
    }
    playbackWorkletRef.current = null;
    audioContextRef.current = null;
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    cleanupAudio();
    setConnectionState("disconnected");
    setIsSpeaking(false);
  }, [cleanupAudio]);

  const connect = useCallback(async (initialContext?: string) => {
    if (connectionState !== "disconnected") return;
    setConnectionState("connecting");

    try {
      // 1. Fetch auth token from backend
      const res = await fetch("/api/auth/gemini");
      const authData = await res.json();
      if (!res.ok) throw new Error(authData.error || "Failed to get auth token");

      // 2. Build WebSocket URL — prefer Google AI Studio key, fallback to Vertex AI
      let wsUrl: string;
      if (authData.geminiApiKey) {
        wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${authData.geminiApiKey}`;
      } else {
        wsUrl = `wss://${authData.region}-aiplatform.googleapis.com/ws/google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent?project=${authData.projectId}&location=${authData.region}&access_token=${authData.accessToken}`;
      }

      // 3. Setup audio output at 24kHz
      const ac = new window.AudioContext({ sampleRate: 24000 });
      audioContextRef.current = ac;
      await ac.audioWorklet.addModule("/worklets/playback.worklet.js");
      const playback = new AudioWorkletNode(ac, "playback-worklet");
      playbackWorkletRef.current = playback;
      playback.connect(ac.destination);

      // 4. Connect WebSocket
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      await new Promise<void>((resolve, reject) => {
        ws.onopen = () => {
          const setupMsg: Record<string, unknown> = {
            setup: {
              model: LIVE_MODEL,
              generationConfig: {
                responseModalities: ["AUDIO", "TEXT"],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: "Aoede" },
                  },
                },
              },
            },
          };

          if (initialContext) {
            (setupMsg.setup as Record<string, unknown>).systemInstruction = {
              parts: [{
                text: `You are MathBot, a live interactive educational agent for Grade 4 students. 
The student has selected the following math goal: ${initialContext}. 
Guide them through a fun, memorable story using humor and relatable examples. 
Build foundational math truths step by step. Keep language simple and encouraging.
When describing a visual scene, wrap the image description in [IMAGE: your description here].`,
              }],
            };
          }

          ws.send(JSON.stringify(setupMsg));
          resolve();
        };
        ws.onerror = (e) => reject(e);
      });

      setConnectionState("connected");

      // 5. Handle incoming messages
      ws.onmessage = (event) => {
        if (event.data instanceof Blob) return;
        let data: Record<string, unknown>;
        try { data = JSON.parse(event.data as string); } catch { return; }
        if (!data) return;

        if (data.serverContent && (data.serverContent as Record<string, unknown>).modelTurn) {
          const parts = ((data.serverContent as Record<string, unknown>).modelTurn as Record<string, unknown>).parts as Array<Record<string, unknown>>;
          for (const part of parts ?? []) {
            if (part.inlineData && (part.inlineData as Record<string, unknown>).mimeType &&
                String((part.inlineData as Record<string, unknown>).mimeType).startsWith("audio/pcm")) {
              const base64Audio = (part.inlineData as Record<string, unknown>).data as string;
              const binaryString = atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              if (playbackWorkletRef.current) {
                playbackWorkletRef.current.port.postMessage(bytes.buffer, [bytes.buffer]);
                setIsSpeaking(true);
              }
            }
            if (part.text) {
              setMessages((prev) => [...prev, { role: "model", text: part.text as string }]);
            }
          }
        }

        if (data.serverContent && (data.serverContent as Record<string, unknown>).turnComplete) {
          setIsSpeaking(false);
        }
      };

      ws.onclose = () => { disconnect(); };

    } catch (err) {
      console.error("Gemini Live Connection Failed", err);
      disconnect();
    }
  }, [connectionState, disconnect]);

  useEffect(() => { return () => { disconnect(); }; }, [disconnect]);

  const sendTextMessage = useCallback((text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        clientContent: {
          turns: [{ role: "user", parts: [{ text }] }],
          turnComplete: true,
        },
      }));
      setMessages((prev) => [...prev, { role: "user", text }]);
    }
  }, []);

  return { connectionState, messages, isSpeaking, connect, disconnect, sendTextMessage };
}
