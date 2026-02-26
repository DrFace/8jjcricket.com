"use client";

import { useState, useRef, useEffect } from "react";
import HeroVideoModal from "./HeroVideoModal";
import { useAudio } from "@/context/AudioContext";
import { Trophy } from "lucide-react";
interface InteractiveHeroVideoProps {
  videoUrl: string;
  latestEvent?: any;
}

export default function InteractiveHeroVideo({
  videoUrl,
  latestEvent,
}: InteractiveHeroVideoProps) {
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

    if (latestEvent?.slug) {
      window.open(`/news/${latestEvent.slug}`, "_blank");
      return;
    }

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

        {/* Latest Event Badge Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div
            className="relative cursor-pointer group pointer-events-auto"
            onClick={handleClick}
          >
            {/* Pulsating background ring */}
            <div className="absolute inset-0 animate-ping rounded-full bg-india-gold/20" />
            
            {/* Glassmorphic Badge */}
            <div className="relative flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-6 py-4 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-india-gold group-hover:border-india-gold">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-india-gold shadow-lg group-hover:bg-white transition-colors duration-500">
                <Trophy className="h-6 w-6 text-black" />
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
