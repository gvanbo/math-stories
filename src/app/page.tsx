'use client';

import { useState } from 'react';
import { useGeminiLive } from '@/hooks/useGeminiLive';
import { StorybookView } from './components/StorybookView';
import { CategoryMenu, type MathCategory } from './components/CategoryMenu';
import { EquationMenu } from './components/EquationMenu';

type AppState = "category" | "equation" | "storybook";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("category");
  const [selectedCategory, setSelectedCategory] = useState<MathCategory | null>(null);
  const [selectedEquation, setSelectedEquation] = useState<string | null>(null);

  const {
    connectionState,
    messages,
    isSpeaking,
    connect,
    disconnect,
    sendTextMessage
  } = useGeminiLive();

  const handleCategorySelect = (category: MathCategory) => {
    setSelectedCategory(category);
    setAppState("equation");
  };

  const handleEquationSelect = (equation: string) => {
    setSelectedEquation(equation);
    setAppState("storybook");
    connect(equation);
  };

  const resetFlow = () => {
    disconnect();
    setAppState("category");
    setSelectedCategory(null);
    setSelectedEquation(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
      <header className="mb-12 text-center animate-fade-in-down mt-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 mb-4 tracking-tight drop-shadow-sm">
          Math Stories: Live
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium">
          Step into a live, interactive storybook where you control the adventure.
        </p>
      </header>

      <div className="w-full max-w-5xl flex flex-col items-center flex-grow">
        {appState === "category" && (
          <CategoryMenu onSelect={handleCategorySelect} />
        )}
        
        {appState === "equation" && selectedCategory && (
          <EquationMenu 
            category={selectedCategory} 
            onSelect={handleEquationSelect} 
            onBack={() => setAppState("category")} 
          />
        )}

        {appState === "storybook" && (
          <StorybookView 
            connectionState={connectionState}
            messages={messages}
            isSpeaking={isSpeaking}
            onConnect={() => connect(selectedEquation || "")}
            onDisconnect={resetFlow}
            onSendMessage={sendTextMessage}
          />
        )}
      </div>
    </div>
  );
}
