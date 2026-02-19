"use client";

import { useState } from "react";
import VideoModal from "./VideoModal";

interface InteractiveVideoHeroProps {
  videoUrl: string;
  playerName?: string;
}

export default function InteractiveVideoHero({
  videoUrl,
  playerName = "Cricket Highlights",
}: InteractiveVideoHeroProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPopupOpen(true);
  };

  return (
    <>
      {/* Video Container with Click Handler */}
      <div className="relative h-full w-full">
        {/* Background Video */}
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full bg-black object-contain sm:object-cover"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Play Button Overlay - CLICKABLE */}
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer group z-10"
          onClick={handleClick}
        >
          <div className="relative">
            {/* Pulsing Rings */}
            <div className="absolute inset-0 -m-4 animate-ping pointer-events-none">
              <div className="h-40 w-40 rounded-full border-4 border-orange-400/60" />
            </div>
            <div className="absolute inset-0 -m-4 animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }}>
              <div className="h-40 w-40 rounded-full border-4 border-orange-300/40" />
            </div>

            {/* Main Play Button - TRANSPARENT BACKGROUND */}
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-transparent transition-all duration-300 group-hover:scale-110 cursor-pointer">
              {/* Orange Play Triangle Icon */}
              <svg
                className="relative z-10 h-20 w-20 text-orange-500 drop-shadow-2xl ml-2 pointer-events-none"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-up"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 20}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div className="h-2 w-2 rounded-full bg-yellow-400/60 blur-sm" />
          </div>
        ))}
      </div>

      {/* Video Modal */}
      <VideoModal
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
            transform: translateY(-100px) scale(0.5);
            opacity: 0;
          }
        }

        .animate-float-up {
          animation: float-up 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
