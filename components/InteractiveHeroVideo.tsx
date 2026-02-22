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
          <div className="glightbox_video">
            <svg width="131" height="131" viewBox="0 0 131 131" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="inner-circle" d="M65 21C40.1488 21 20 41.1488 20 66C20 90.8512 40.1488 111 65 111C89.8512 111 110 90.8512 110 66C110 41.1488 89.8512 21 65 21Z" fill="white"></path>
              <circle className="outer_circle" cx="65.5" cy="65.5" r="64" stroke="white"></circle>
              <path className="play" fillRule="evenodd" clipRule="evenodd" d="M60 76V57L77 66.7774L60 76Z" fill="#BF2428"></path>
            </svg>
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
