"use client";

import React from "react";

type BackButtonProps = {
  className?: string;
};

export default function MobileBackButton({ className = "" }: BackButtonProps) {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      aria-label="Go back"
      className={`flex items-center justify-center w-10 h-10
        bg-black/40 hover:bg-amber-950/60
        border border-amber-400/30 rounded-full
        transition-all duration-300 hover:scale-110
        group shadow-lg backdrop-blur-sm flex-shrink-0 mr-4
        ${className}`}
    >
      <svg
        className="w-5 h-5 text-amber-300 group-hover:-translate-x-0.5 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}
