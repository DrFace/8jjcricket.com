"use client";

import React from "react";
import { PlayCircle } from "lucide-react";

type Props = {
  categories: string[];
  active: string;
  onSelect: (cat: string) => void;
};

function VideoCategories({ categories, active, onSelect }: Props) {
  return (
    <>
      <button
        onClick={() => onSelect("All")}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 border ${
          active === "All"
            ? "bg-india-gold border-india-gold text-black shadow-[0_4px_15px_rgba(255,184,0,0.2)]"
            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
        }`}
      >
        <PlayCircle size={18} />
        <span className="font-black text-base tracking-tight uppercase">
          All
        </span>
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 border relative overflow-hidden ${
            active === cat
              ? "bg-india-gold border-india-gold text-black shadow-[0_4px_15px_rgba(255,184,0,0.2)]"
              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
          }`}
        >
          {active === cat && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
          )}
          <PlayCircle size={18} className="shrink-0" />
          <span className="font-black text-base tracking-tight uppercase truncate">
            {cat}
          </span>
        </button>
      ))}
    </>
  );
}

export default React.memo(VideoCategories);
