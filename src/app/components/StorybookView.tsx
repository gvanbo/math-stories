"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
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
  const [inputText, setInputText] = useState("");

  // Extract the latest image prompt to show in the right pane
  const latestImagePrompt = useMemo(() => {
    let latest = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      const match = messages[i].text.match(/\[IMAGE:(.*?)\]/);
      if (match) {
        latest = match[1].trim();
        break;
      }
    }
    return latest;
  }, [messages]);

  // Clean messages from image tags for the chat view
  const displayMessages = useMemo(() => {
    return messages.map(m => ({
      ...m,
      text: m.text.replace(/\[IMAGE:(.*?)\]/g, "").trim()
    })).filter(m => m.text.length > 0);
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayMessages, isSpeaking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[75vh] min-h-[600px] w-full max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] bg-slate-900 border border-slate-700/50 animate-fade-in-up">
      
      {/* LEFT PANE: Chat & Narration */}
      <div className="flex flex-col w-full md:w-5/12 bg-slate-950/80 border-r border-slate-800 relative z-10 flex-shrink-0 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-slate-900/50 backdrop-blur-md border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 transform -rotate-3">
              <span className="text-2xl">🪄</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
                MathBot
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
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {connectionState}
                </span>
              </div>
            </div>
          </div>
          <div>
            {connectionState === "disconnected" ? (
              <button
                onClick={onConnect}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 rounded-xl font-bold transition-all active:scale-95"
              >
                Connect
              </button>
            ) : (
              <button
                onClick={onDisconnect}
                className="px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 rounded-xl font-bold transition-all active:scale-95 text-sm"
              >
                End
              </button>
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {displayMessages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center animate-pulse">
              <p className="text-lg font-medium text-slate-400">Waiting to start the adventure...</p>
              <p className="text-sm mt-3 opacity-80">Make sure your microphone is ready!</p>
            </div>
          )}
          
          {displayMessages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col w-full max-w-[90%] animate-fade-in-up ${
                m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              <span className="text-xs font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-wider opacity-80">
                {m.role === "user" ? "You" : "MathBot"}
              </span>
              <div
                className={`p-4 md:p-5 text-[15px] leading-relaxed shadow-md ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-3xl rounded-tr-sm"
                    : "bg-slate-800 text-slate-200 rounded-3xl rounded-tl-sm border border-slate-700/50"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isSpeaking && (
            <div className="flex items-center gap-3 mr-auto pt-2 pl-2 text-slate-400 animate-fade-in-up">
              <div className="flex items-center gap-1.5 bg-slate-800 px-4 py-3 rounded-full border border-slate-700/50 shadow-sm">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_-0.3s]"></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-[bounce_1s_infinite_-0.15s]"></span>
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-[bounce_1s_infinite]"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800/80 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={connectionState !== "connected"}
              placeholder={connectionState === "connected" ? "Message MathBot..." : "Connect first..."}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-5 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50 text-[15px]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || connectionState !== "connected"}
              className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl font-bold transition-all disabled:cursor-not-allowed shadow-lg active:scale-95"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT PANE: Visual Storybook (Disney styling) */}
      <div className="hidden md:flex flex-col w-full md:w-7/12 relative bg-slate-900 overflow-hidden items-center justify-center p-8">
        {/* Deep background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-black pointer-events-none" />
        
        {/* Starfield overlay (subtle) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />

        <div className="relative w-full max-w-lg aspect-square rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden group bg-slate-800 flex flex-col items-center justify-center transition-all duration-700 ease-out">
          {latestImagePrompt ? (
            <div className="flex flex-col items-center justify-center p-8 text-center h-full w-full bg-slate-800/80 backdrop-blur-sm z-10 animate-fade-in">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6 drop-shadow-lg" />
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">Painting your scene...</h3>
              <p className="text-slate-300 font-medium italic">"{latestImagePrompt}"</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center opacity-40">
              <span className="text-8xl mb-6">📖</span>
              <h3 className="text-2xl font-bold text-slate-400">The Story Awaits</h3>
            </div>
          )}

          {/* Shimmer sweep effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
        </div>
        
        <p className="mt-8 text-slate-500 font-medium tracking-wide z-10 text-center max-w-md">
          Media Generation Powered by <span className="text-indigo-400">Imagen 3</span> & <span className="text-pink-400">Veo</span>
        </p>

      </div>
    </div>
  );
}
