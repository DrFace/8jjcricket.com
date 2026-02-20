"use client";

import { useState, useRef, useEffect } from "react";
import HeroVideoModal from "./HeroVideoModal";

interface InteractiveHeroVideoProps {
  videoUrl: string;
}

export default function InteractiveHeroVideo({
  videoUrl,
}: InteractiveHeroVideoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // React's `muted` JSX prop is sometimes ignored by browsers.
  // Setting it imperatively on the element guarantees silence.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);


  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Video Container with Click Handler */}
      <div className="relative h-full w-full">
        {/* Background Video - muted both via prop and ref to ensure silence */}
        <video
          ref={videoRef}
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
