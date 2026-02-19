"use client";

import { useState } from "react";
import HeroPopup from "../HeroPopup";

interface MobileHeroVideoSectionProps {
  videoUrl: string;
  playerName?: string;
}

export default function MobileHeroVideoSection({
  videoUrl,
  playerName = "Cricket Highlights",
}: MobileHeroVideoSectionProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      {/* Video Container with Click Handler */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-india-gold/20 bg-slate-900/60 backdrop-blur-md shadow-lg">
        <div 
          className="h-[180px] w-full sm:h-[220px] relative cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => {
            console.log('Opening mobile popup');
            setIsPopupOpen(true);
          }}
        >
          {/* Background Video - VISIBLE */}
          <video
            className="h-full w-full object-cover"
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster=""
          />

          {/* Light Overlay - So video is visible */}
          <div className="pointer-events-none absolute inset-0 bg-black/10" />

          {/* Play Button Overlay - SMALLER */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              {/* Pulsing Ring - Smaller */}
              <div className="absolute inset-0 animate-ping">
                <div className="h-16 w-16 rounded-full border-2 border-orange-400/60" />
              </div>

              {/* Play Button - TRANSPARENT BACKGROUND */}
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-transparent">
                {/* Orange Play Triangle Icon */}
                <svg
                  className="h-8 w-8 text-orange-500 drop-shadow-2xl ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Floating Sparkles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-up"
              style={{
                left: `${20 + Math.random() * 60}%`,
                bottom: `${Math.random() * 30}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 1}s`,
              }}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-yellow-300/80" />
            </div>
          ))}
        </div>
      </div>

      {/* Hero Popup Modal */}
      <HeroPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        videoUrl={videoUrl}
        playerName={playerName}
      />

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-60px) scale(0.3);
            opacity: 0;
          }
        }

        .animate-float-up {
          animation: float-up 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
