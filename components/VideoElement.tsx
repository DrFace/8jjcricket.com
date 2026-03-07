"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudio } from "@/context/AudioContext";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  src: string;
  poster?: string;
  title?: string;
  loading: boolean;
  error: boolean;
  mounted: boolean;
  className?: string;
  onPlay: () => void;
  onPause: () => void;
  onError: () => void;
  onRetry: () => void;
};

export default function VideoElement({
  videoRef,
  src,
  poster,
  title,
  loading,
  error,
  className,
  onPlay,
  onPause,
  onError,
  mounted,
  onRetry,
}: Props) {
  const { isPlaying, togglePlay } = useAudio();
  const isPlayingRef = React.useRef(isPlaying);
  const wasPlayingBefore = React.useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const handlePlay = () => {
    // background music currently playing?
    if (isPlaying) {
      wasPlayingBefore.current = true;
      togglePlay(); // pause background
    }
  };

  const handlePause = () => {
    if (wasPlayingBefore.current) {
      togglePlay();
      wasPlayingBefore.current = false;
    }
  };

  // when the currentVideo element plays/pauses we need to sync audio
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.addEventListener("play", handlePlay);
    vid.addEventListener("pause", handlePause);

    return () => {
      vid.removeEventListener("play", handlePlay);
      vid.removeEventListener("pause", handlePause);
    };
  }, [isPlaying, togglePlay]);

  if (error) {
    return (
      <div
        className={cn(
          "relative aspect-video bg-slate-900 rounded-xl border-2 border-white/20 flex flex-col items-center justify-center",
          className,
        )}
      >
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-white text-lg font-medium mb-2">
          Failed to load video
        </p>
        <p className="text-slate-400 text-sm mb-4">
          The video could not be played
        </p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-video rounded-xl overflow-hidden",
        className,
      )}
    >
      {loading && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={mounted ? src : undefined}
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        poster={poster}
        preload="none"
      />
    </div>
  );
}
