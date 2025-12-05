"use client";

import { type TradingPersona } from "@/types/trading";

export function PersonaCard({ persona }: { persona: TradingPersona }) {
  return (
    <div className="w-full max-w-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-3xl p-8 border border-indigo-500/20 backdrop-blur-sm">
      <div className="text-center space-y-6">
        <div className="text-8xl">{persona.emoji}</div>

        <div>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {persona.type}
          </h2>
          <p className="text-lg text-zinc-300">{persona.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {persona.traits.map((trait, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-sm text-indigo-300"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
