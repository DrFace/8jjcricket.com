"use client";

import { useState, useRef, useEffect } from "react";
import HeroVideoModal from "../HeroVideoModal";
import { useAudio } from "@/context/AudioContext";
import { Trophy } from "lucide-react";

interface MobileInteractiveHeroVideoProps {
  videoUrl: string;
  latestEvent?: any;
}

export default function MobileInteractiveHeroVideo({
  videoUrl,
  latestEvent,
}: MobileInteractiveHeroVideoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isPlaying, togglePlay } = useAudio();
  const prvIsPlaying = useRef(isPlaying);

  // React's `muted` JSX prop is sometimes ignored by browsers.
  // Setting it imperatively on the element guarantees silence.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  useEffect(() => {
    prvIsPlaying.current = isPlaying;
  }, [isPlaying]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
    videoRef.current?.pause(); // Pause the background video immediately on click
    if (prvIsPlaying.current) {
      togglePlay();
    } else {
      prvIsPlaying.current = true;
    }
  };

  const handleCloseModal = () => {
    if (!prvIsPlaying.current) {
      togglePlay();
    }
    videoRef.current?.play(); // Resume the background video when modal closes
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Video Container with Click Handler */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-india-gold/20 bg-slate-900/60 backdrop-blur-md shadow-lg">
        <div className="h-[180px] w-full sm:h-[220px] relative">
          {/* Background Video - muted both via prop and ref to ensure silence */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
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

          {/* Clickable Latest Event Badge Area */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
            onClick={handleClick}
          >
            <div className="relative group">
              {/* Pulsating background ring */}
              <div className="absolute inset-0 animate-ping rounded-full bg-india-gold/20" />
              
              {/* Compact Glassmorphic Badge */}
              <div className="relative flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 backdrop-blur-md active:scale-95 transition-all">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-india-gold shadow-lg">
                  <Trophy className="h-4 w-4 text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Video Modal */}
      <HeroVideoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        videoUrl={videoUrl}
        latestEvent={latestEvent}
      />
    </>
  );
}
