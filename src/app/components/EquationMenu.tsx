"use client";

import React from "react";
import type { MathCategory } from "./CategoryMenu";

interface EquationMenuProps {
  category: MathCategory;
  onSelect: (equation: string) => void;
  onBack: () => void;
}

const EQUATIONS: Record<MathCategory, { id: string; display: string; theme: string }[]> = {
  multiplication: [
    { id: "3x4", display: "3 × 4 = ?", theme: "from-blue-500 to-indigo-600" },
    { id: "5x6", display: "5 × 6 = ?", theme: "from-blue-600 to-indigo-700" },
    { id: "7x8", display: "7 × 8 = ?", theme: "from-indigo-600 to-blue-800" },
  ],
  division: [
    { id: "12div3", display: "12 ÷ 3 = ?", theme: "from-emerald-400 to-teal-500" },
    { id: "20div4", display: "20 ÷ 4 = ?", theme: "from-emerald-500 to-teal-600" },
    { id: "30div5", display: "30 ÷ 5 = ?", theme: "from-teal-500 to-emerald-700" },
  ],
  fractions: [
    { id: "half-10", display: "½ of 10 = ?", theme: "from-purple-500 to-fuchsia-600" },
    { id: "quarter-12", display: "¼ of 12 = ?", theme: "from-purple-600 to-fuchsia-700" },
    { id: "third-9", display: "⅓ of 9 = ?", theme: "from-fuchsia-600 to-purple-800" },
  ],
};

const CATEGORY_TITLES: Record<MathCategory, string> = {
  multiplication: "Multiplication Missions",
  division: "Division Discoveries",
  fractions: "Fraction Frontiers",
};

export function EquationMenu({ category, onSelect, onBack }: EquationMenuProps) {
  const equations = EQUATIONS[category] || [];

  return (
    <div className="flex flex-col items-center w-full animate-fade-in-up">
      <button 
        onClick={onBack}
        className="self-start mb-6 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-700"
      >
        ← Back to Categories
      </button>

      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mb-10 tracking-wide drop-shadow-md text-center">
        {CATEGORY_TITLES[category]}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 ml:grid-cols-3 gap-6 w-full max-w-4xl">
        {equations.map((eq) => (
          <button
            key={eq.id}
            onClick={() => onSelect(eq.display)}
            className={`relative flex items-center justify-center p-8 rounded-2xl bg-gradient-to-br ${eq.theme} text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-white/20 group overflow-hidden`}
          >
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <span className="text-5xl font-black tracking-widest drop-shadow-lg font-mono">
              {eq.display}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
