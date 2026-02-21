"use client";

import React, { useEffect, useRef } from "react";
import type { ConnectionState } from "@/hooks/useGeminiLive";

interface StorybookViewProps {
  connectionState: ConnectionState;
  messages: Array<{ role: string; text: string }>;
  isSpeaking: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onSendMessage: (text: string) => void;
}

export function StorybookView({
  connectionState,
  messages,
  isSpeaking,
  onConnect,
  onDisconnect,
  onSendMessage,
}: StorybookViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isSpeaking]);

  const [inputText, setInputText] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  /**
   * Temporary helper to detect and render generated media placeholders.
   * In a full implementation, the backend mediaGen wrapper would supply URLs here.
   */
  const renderMessageContent = (text: string) => {
    // If the streaming text contains a known media marker (e.g., [IMAGE: ...])
    const imageMatch = text.match(/\[IMAGE:(.*?)\]/);
    if (imageMatch) {
      return (
        <div className="flex flex-col gap-3">
          <span>{text.replace(imageMatch[0], "").trim()}</span>
          <div className="w-full h-48 bg-slate-700 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-500 overflow-hidden relative group">
            <span className="text-slate-400 text-sm font-medium z-10 px-4 text-center">
              Generating Image:\n{imageMatch[1].trim()}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      );
    }
    return <span>{text}</span>;
  };

  return (
    <div className="flex flex-col h-[700px] w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-slate-900 text-white font-sans border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-5 bg-slate-950/50 backdrop-blur-sm border-b border-slate-800 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
              MathBot 2.0 (Gemini Live)
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  connectionState === "connected"
                    ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : connectionState === "connecting"
                    ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                }`}
              />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {connectionState}
              </span>
            </div>
          </div>
        </div>
        <div>
          {connectionState === "disconnected" ? (
            <button
              onClick={onConnect}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 rounded-xl font-semibold transition-all active:scale-95"
            >
              Start Microphone
            </button>
          ) : (
            <button
              onClick={onDisconnect}
              className="px-5 py-2.5 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white border border-rose-600/20 rounded-xl font-semibold transition-all active:scale-95"
            >
              End Session
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth relative"
      >
        {messages.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 italic p-8 text-center">
            <div className="w-24 h-24 mb-6 opacity-20">
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
            </div>
            <p className="text-lg">Welcome to the interactive Math Storybook!</p>
            <p className="text-sm mt-2">Press "Start Microphone" and ask <strong>"Can you teach me multiplication?"</strong></p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col w-full max-w-[85%] ${
              m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            <span className="text-xs font-medium text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">
              {m.role === "user" ? "You" : "MathBot"}
            </span>
            <div
              className={`p-4 md:p-5 rounded-3xl leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-sm"
                  : "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700/50"
              }`}
            >
              {renderMessageContent(m.text)}
            </div>
          </div>
        ))}

        {isSpeaking && (
          <div className="flex items-center gap-3 mr-auto pt-2 pl-2 text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-800 px-4 py-3 rounded-full border border-slate-700/50">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_-0.3s]"></span>
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-[bounce_1s_infinite_-0.15s]"></span>
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-[bounce_1s_infinite]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-5 bg-slate-950 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={connectionState !== "connected"}
            placeholder={
              connectionState === "connected"
                ? "Talk into your microphone, or type a message here..."
                : "Connect to start interacting..."
            }
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-5 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[15px]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || connectionState !== "connected"}
            className="px-8 py-3.5 bg-white text-slate-900 hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl font-bold transition-all disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
          >
            Send
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
