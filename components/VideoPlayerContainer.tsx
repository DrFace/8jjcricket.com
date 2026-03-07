"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "@/context/AudioContext";
import VideoElement from "./VideoElement";

type Props = {
  src: string;
  poster?: string;
  title?: string;
  category?: string; // accepted but unused here
  toggleMeta?: () => void; // accepted for compatibility
  className?: string;
};

export default function VideoPlayerContainer({ src, poster, title }: Props) {
  const { isPlaying, togglePlay } = useAudio();

  // Correct ref type: React.RefObject<HTMLVideoElement>
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wasPlayingBefore = useRef<boolean>(false);
  const pausedByObserver = useRef<boolean>(false);

  // Add refs to always have latest values
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Use refs in handlers to avoid stale closure
  const handlePlay = () => {
    if (isPlayingRef.current) {
      wasPlayingBefore.current = true;
      togglePlay();
    }
  };

  const handlePause = () => {
    if (wasPlayingBefore.current) {
      togglePlay();
      wasPlayingBefore.current = false;
    }
  };

  const handleError = useCallback(() => {
    setError(true);
    setLoading(false);
  }, []);

  const handleCanPlay = useCallback(() => {
    setLoading(false);
  }, []);

  const handleRetry = useCallback(() => {
    setError(false);
    setLoading(true);
    if (videoRef.current) {
      try {
        videoRef.current.load();
      } catch (_) {
        /* ignore */
      }
    }
  }, []);

  const handleStart = useCallback(() => {
    setMounted(true);
    // play will be triggered by the VideoElement's onPlay event after mount
    // ensure loading state is true until canplay
    setLoading(true);
    setError(false);
  }, []);

  // IntersectionObserver: pause when out of viewport, do not auto-resume
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = videoRef.current;
          if (!v) return;
          if (!entry.isIntersecting && !v.paused) {
            // Pause and mark that pause was triggered by observer
            v.pause();
            pausedByObserver.current = true;
          }
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      {!mounted ? (
        <button
          onClick={handleStart}
          className="w-full h-full relative block text-left"
          aria-label="Play video"
        >
          {poster ? (
            <img
              src={poster}
              alt="video thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-black/40 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-black/60 flex items-center justify-center" />
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-black/60 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-8 h-8 text-white"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      ) : (
        <VideoElement
          videoRef={videoRef}
          src={src}
          poster={poster}
          title={title}
          loading={loading}
          error={error}
          onPlay={handlePlay}
          onPause={handlePause}
          onError={handleError}
          onRetry={handleRetry}
          mounted={mounted}
        />
      )}
    </div>
  );
}
