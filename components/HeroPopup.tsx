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
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="relative w-full max-w-5xl mx-4 overflow-hidden animate-scaleIn"
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

          {/* Animated Sparkles/Stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div className="h-1 w-1 rounded-full bg-yellow-300" />
            </div>
          ))}

          {/* Fireworks Effect */}
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-radial from-yellow-400/30 to-transparent rounded-full blur-xl animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-radial from-orange-400/30 to-transparent rounded-full blur-xl animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
