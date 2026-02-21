"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type ConnectionState = "disconnected" | "connecting" | "connected";

/**
 * useGeminiLive
 * Hook to manage bidirectional WebSocket connection with Gemini Live API
 */
export function useGeminiLive() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [messages, setMessages] = useState<Array<{ role: string; text: string }>>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Connection references
  const wsRef = useRef<WebSocket | null>(null);
  
  // Audio contexts
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recorderWorkletRef = useRef<AudioWorkletNode | null>(null);
  const playbackWorkletRef = useRef<AudioWorkletNode | null>(null);

  const cleanupAudio = useCallback(() => {
    if (recorderWorkletRef.current) recorderWorkletRef.current.disconnect();
    if (playbackWorkletRef.current) playbackWorkletRef.current.disconnect();
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(console.error);
    }
    recorderWorkletRef.current = null;
    playbackWorkletRef.current = null;
    mediaStreamRef.current = null;
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

  const connect = useCallback(async () => {
    if (connectionState !== "disconnected") return;
    
    setConnectionState("connecting");

    try {
      // 1. Fetch token from our backend API
      const res = await fetch("/api/auth/gemini");
      const authData = await res.json();

      if (!res.ok) throw new Error(authData.error || "Failed to get auth token");

      let wsUrl = "";
      if (authData.useVertex) {
        wsUrl = `wss://${authData.region}-aiplatform.googleapis.com/ws/google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent?project=${authData.projectId}&location=${authData.region}`;
      } else {
        wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${authData.geminiApiKey}`;
      }

      // 2. Setup Audio - Input at 16kHz, Output at 24kHz
      const ac = new window.AudioContext({ sampleRate: 24000 });
      audioContextRef.current = ac;

      await ac.audioWorklet.addModule("/worklets/recorder.worklet.js");
      await ac.audioWorklet.addModule("/worklets/playback.worklet.js");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const source = ac.createMediaStreamSource(stream);
      
      const recorder = new AudioWorkletNode(ac, "recorder-worklet");
      recorderWorkletRef.current = recorder;

      const playback = new AudioWorkletNode(ac, "playback-worklet");
      playbackWorkletRef.current = playback;
      playback.connect(ac.destination);

      source.connect(recorder);

      // 3. Connect WebSocket
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const connectPromise = new Promise<void>((resolve, reject) => {
        ws.onopen = () => {
          // Send initial setup message connecting to gemini-2.0-flash-exp (or whichever model)
          const setupMsg = {
            setup: {
              model: "models/gemini-2.0-flash-exp",
              generationConfig: {
                responseModalities: ["AUDIO", "TEXT"],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: {
                      voiceName: "Aoede", // Available: Puck, Charon, Kore, Fenrir, Aoede
                    },
                  },
                },
              },
            },
          };
          ws.send(JSON.stringify(setupMsg));
          resolve();
        };
        ws.onerror = (e) => reject(e);
      });

      await connectPromise;
      setConnectionState("connected");

      // Set up message handlers
      ws.onmessage = (event) => {
        if (event.data instanceof Blob) {
           // We might get binary blobs if the backend decides to send it, but usually text JSON.
           return;
        }
        
        let data;
        try {
          data = JSON.parse(event.data);
        } catch (e) {
          return;
        }

        if (!data) return;

        // Extract Server Content
        if (data.serverContent?.modelTurn) {
          const parts = data.serverContent.modelTurn.parts;
          for (const part of parts) {
            // Audio Part
            if (part.inlineData && part.inlineData.mimeType.startsWith("audio/pcm")) {
              const base64Audio = part.inlineData.data;
              const binaryString = atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              // Send the Int16 chunk to our playback worklet
              if (playbackWorkletRef.current) {
                playbackWorkletRef.current.port.postMessage(bytes.buffer, [bytes.buffer]);
                setIsSpeaking(true);
              }
            }
            // Text Part
            if (part.text) {
              setMessages((prev) => [...prev, { role: "model", text: part.text }]);
            }
          }
        }
        
        // Turn complete or interruption
        if (data.serverContent?.turnComplete) {
          setIsSpeaking(false);
        }
      };

      ws.onclose = () => {
        disconnect();
      };

      // 4. Send Microphone audio to WS
      recorder.port.onmessage = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const pcm16Data = new Int16Array(e.data); // This is Float32 converted to Int16
          // Convert Int16Array to base64
          const uint8 = new Uint8Array(pcm16Data.buffer);
          let binary = "";
          for (let i = 0; i < uint8.length; i++) {
            binary += String.fromCharCode(uint8[i]);
          }
          const base64 = btoa(binary);

          const clientContent = {
            realtimeInput: {
              mediaChunks: [
                {
                  mimeType: "audio/pcm;rate=16000",
                  data: base64,
                },
              ],
            },
          };
          ws.send(JSON.stringify(clientContent));
        }
      };

    } catch (err) {
      console.error("Gemini Live Connection Failed", err);
      disconnect();
    }
  }, [connectionState, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const sendTextMessage = useCallback((text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const msg = {
        clientContent: {
          turns: [
            {
              role: "user",
              parts: [{ text }],
            },
          ],
          turnComplete: true,
        },
      };
      wsRef.current.send(JSON.stringify(msg));
      setMessages((prev) => [...prev, { role: "user", text }]);
    }
  }, []);

  return {
    connectionState,
    messages,
    isSpeaking,
    connect,
    disconnect,
    sendTextMessage
  };
}
