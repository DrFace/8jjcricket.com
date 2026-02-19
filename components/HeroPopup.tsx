"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface HeroPopupProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  playerName?: string;
  teamColors?: {
    primary: string;
    secondary: string;
  };
}

export default function HeroPopup({
  isOpen,
  onClose,
  videoUrl,
  playerName = "8JJ Cricket",
  teamColors = {
    primary: "from-blue-600 to-indigo-700",
    secondary: "from-orange-500 to-red-600",
  },
}: HeroPopupProps) {
  useEffect(() => {
    console.log('HeroPopup - isOpen:', isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) {
    console.log('HeroPopup - not rendering (isOpen is false)');
    return null;
  }

  console.log('HeroPopup - rendering popup with videoUrl:', videoUrl);

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="relative w-full max-w-5xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white text-2xl font-bold transition-all hover:bg-red-600 hover:scale-110 active:scale-95"
        >
          ✕
        </button>

        {/* Main Content */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-4 border-india-gold/30 bg-black">
          {/* Video Player */}
          <video
            src={videoUrl}
            autoPlay
            loop
            muted={false}
            playsInline
            controls
            className="absolute inset-0 h-full w-full object-contain sm:object-cover"
          />
          

          
          {/* Animated Background Pattern (behind video) */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
