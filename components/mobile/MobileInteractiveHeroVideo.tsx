"use client";

import { useState, useRef, useEffect } from "react";
import HeroVideoModal from "../HeroVideoModal";

interface MobileInteractiveHeroVideoProps {
  videoUrl: string;
}

export default function MobileInteractiveHeroVideo({
  videoUrl,
}: MobileInteractiveHeroVideoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // React's `muted` JSX prop is sometimes ignored by browsers.
  // Setting it imperatively on the element guarantees silence.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

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
            onClick={() => setIsModalOpen(true)}
          >
            <div className="button-pulsate__wrapper">
              <div className="button-pulsate">
                <div className="button-pulsate__ring-container">
                  <div className="button-pulsate__ring"></div>
                  <div className="button-pulsate__ring button-pulsate__ring--second"></div>
                </div>
                <div className="button-pulsate__svg-wrapper">
                  <svg viewBox="0 0 70 70">
                    <polygon points="25,20 50,35 25,50"></polygon>
                  </svg>
                </div>
                <div className="button-pulsate__expanding-circle"></div>
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
