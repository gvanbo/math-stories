"use client";

import React from "react";

export type MathCategory = "multiplication" | "division" | "fractions";

interface CategoryMenuProps {
  onSelect: (category: MathCategory) => void;
}

export function CategoryMenu({ onSelect }: CategoryMenuProps) {
  const categories: { id: MathCategory; title: string; description: string; icon: string; color: string }[] = [
    {
      id: "multiplication",
      title: "Multiplication",
      description: "Fast-paced doubling, squaring, and scaling adventures.",
      icon: "✕",
      color: "from-blue-600 to-indigo-800",
    },
    {
      id: "division",
      title: "Division",
      description: "Sharing, partitioning, and breaking things down fairly.",
      icon: "÷",
      color: "from-emerald-500 to-teal-700",
    },
    {
      id: "fractions",
      title: "Fractions",
      description: "Exploring parts of wholes and mastering proportions.",
      icon: "½",
      color: "from-purple-600 to-fuchsia-800",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full animate-fade-in-up">
      <h2 className="text-3xl font-bold text-slate-100 mb-8 tracking-wide drop-shadow-md">
        Where will your math story begin?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`relative flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-white/10 overflow-hidden group`}
          >
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="text-6xl font-black mb-6 opacity-90 drop-shadow-lg">
              {cat.icon}
            </div>
            <h3 className="text-2xl font-bold mb-3 drop-shadow-md">
              {cat.title}
            </h3>
            <p className="text-sm font-medium opacity-80 text-center leading-relaxed">
              {cat.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
