"use client";

import { useState, useRef, useEffect } from "react";
import HeroVideoModal from "../HeroVideoModal";
import { useAudio } from "@/context/AudioContext";

interface MobileInteractiveHeroVideoProps {
  videoUrl: string;
}

export default function MobileInteractiveHeroVideo({
  videoUrl,
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

          {/* Clickable Play Button Area */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
            onClick={handleClick}
          >
            <div className="relative">
              {/* Static Ring - No animation */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="h-16 w-16 rounded-full border-2 border-orange-400/60" />
              </div>

              {/* Play Button - TRANSPARENT BACKGROUND */}
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-transparent pointer-events-none">
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
        onClose={handleCloseModal}
        videoUrl={videoUrl}
      />
    </>
  );
}
