"use client";

import { useState } from "react";

interface GameArenaProps {
  isGameActive: boolean;
  onPlay: () => void;
}

export default function GameArena({ isGameActive, onPlay }: GameArenaProps) {
  const [hoveredCharacter, setHoveredCharacter] = useState<string | null>(null);

  return (
    <div className="bg-black backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col items-center justify-center gap-8 min-h-96">
      {!isGameActive ? (
        <>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Ready?</h2>
            <p className="text-game-accent/80 text-sm">
              Tap or press Play to begin your quest.
            </p>
          </div>

          {/* Character Selection */}
          <div className="flex gap-6 items-end">
            {/* Character 1 */}
            <div
              onMouseEnter={() => setHoveredCharacter("char1")}
              onMouseLeave={() => setHoveredCharacter(null)}
              className="flex flex-col items-center gap-3 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg transition-all duration-300 ${
                  hoveredCharacter === "char1"
                    ? "scale-110 shadow-blue-500/50"
                    : ""
                }`}
              >
                ⚔️
              </div>
              <span className="text-white text-xs font-semibold">Warrior</span>
            </div>

            {/* Play Button */}
            <button
              onClick={onPlay}
              className="text-white-800 bg-gradient-to-r from-[#FFD100] to-[#FF6B00] shadow-[0_0_15px_rgba(255,165,0,0.5)] border-t border-white/30 py-3 px-6 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-200"
            >
              PLAY
            </button>

            {/* Character 2 */}
            <div
              onMouseEnter={() => setHoveredCharacter("char2")}
              onMouseLeave={() => setHoveredCharacter(null)}
              className="flex flex-col items-center gap-3 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg transition-all duration-300 ${
                  hoveredCharacter === "char2"
                    ? "scale-110 shadow-purple-500/50"
                    : ""
                }`}
              >
                ✨
              </div>
              <span className="text-white text-xs font-semibold">Mage</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🎮</div>
          <p className="text-white font-semibold">Game in Progress...</p>
        </div>
      )}
    </div>
  );
}
