"use client";

import { useState } from "react";
import HeroVideoModal from "../HeroVideoModal";

interface MobileInteractiveHeroVideoProps {
  videoUrl: string;
}

export default function MobileInteractiveHeroVideo({
  videoUrl,
}: MobileInteractiveHeroVideoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Video Container with Click Handler */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-india-gold/20 bg-slate-900/60 backdrop-blur-md shadow-lg">
        <div 
          className="h-[180px] w-full sm:h-[220px] relative cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => {
            setIsModalOpen(true);
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
        </div>
      </div>

      {/* Hero Video Modal */}
      <HeroVideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={videoUrl}
      />
    </>
  );
}
