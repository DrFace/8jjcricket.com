"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { label: "Home" },
  { label: "Teams & Players" },
  { label: "Events" },
  { label: "Community" },
  { label: "Partners" },
];

interface ScrollIndicatorProps {
  activeIndex: number;
  total?: number;
  onSectionClick?: (index: number) => void;
}

const SPRING_CONFIG = { stiffness: 200, damping: 25 } as const;
const PULSE_TRANSITION = {
  duration: 2,
  repeat: Infinity,
  ease: "easeInOut",
} as const;

export default function ScrollIndicator({
  activeIndex,
  total = SECTIONS.length,
  onSectionClick,
}: ScrollIndicatorProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-center pointer-events-none select-none hidden lg:flex"
      aria-hidden="true"
    >
      {/* Glassmorphic Container Tray - Stuck to Left side */}
      <div className="relative w-12 py-10 rounded-r-[2rem] border-y border-r border-white/10 bg-black/20 backdrop-blur-md flex flex-col items-center gap-6 pointer-events-auto shadow-2xl overflow-visible">
        
        {/* Liquid Progress Track background */}
        <div className="absolute top-10 bottom-10 w-[1px] bg-white/5 left-1/2 -translate-x-1/2" />

        {/* Liquid Highlight Marker */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-[3px] rounded-full bg-gradient-to-b from-blue-400 to-white shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          animate={{
            top: 40 + activeIndex * 48, // Padding (40) + Index * (ItemHeight(24) + Gap(24))
            height: 24,
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            top: SPRING_CONFIG,
            height: SPRING_CONFIG,
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {SECTIONS.slice(0, total).map((section, idx) => {
          const isActive = idx === activeIndex;
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={section.label}
              className="relative flex items-center justify-center w-6 h-6 cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onSectionClick?.(idx)}
            >
              {/* Dual Pulse Rings for Active State */}
              <AnimatePresence mode="wait">
                {isActive && (
                  <>
                    {/* Inner Pulse */}
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={PULSE_TRANSITION}
                      className="absolute inset-0 rounded-full bg-white/30"
                    />
                    {/* Outer pulse */}
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 3.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ ...PULSE_TRANSITION, delay: 0.5 }}
                      className="absolute inset-0 rounded-full border border-white/20"
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Central Dot */}
              <motion.span
                animate={{
                  scale: isActive ? 1.2 : isHovered ? 1.1 : 1,
                  backgroundColor: isActive ? "#ffffff" : isHovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
                  boxShadow: isActive 
                    ? "0 0 15px 4px rgba(255,255,255,0.5), inset 0 0 5px rgba(0,0,0,0.2)" 
                    : "0 0 0px 0px rgba(0,0,0,0)",
                }}
                transition={SPRING_CONFIG}
                className="w-2.5 h-2.5 rounded-full z-10 block"
              />

              {/* Floating Label on Hover (to the right) */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: 10, scale: 0.9 }}
                    animate={{ opacity: 1, x: 20, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.9 }}
                    className="absolute left-full ml-4 px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 backdrop-blur-xl whitespace-nowrap"
                  >
                    <span className="text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase">
                      {section.label}
                    </span>
                    {/* Little arrow pointing to dot */}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#1a1a1a] border-l border-b border-white/10 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
