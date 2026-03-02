"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { VideoPlayerProps } from "@/types/videoSection";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  poster?: string;
  category?: string;
  toggleMeta?: () => void;
};

function VideoPlayerComponent({ src, poster }: Props) {
  const { isPlaying, togglePlay } = useAudio();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wasPlayingBefore = useRef<boolean>(false);
  const pausedByObserver = useRef<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Pause background audio when video plays, resume when paused (if we paused it)
  const onPlay = useCallback(() => {
    if (isPlaying) {
      wasPlayingBefore.current = true;
      togglePlay();
    }
  }, [isPlaying, togglePlay]);

  const onPause = useCallback(() => {
    if (wasPlayingBefore.current) {
      togglePlay();
      wasPlayingBefore.current = false;
    }
  }, [togglePlay]);

  // Mount the video element only after user clicks
  const handleStart = useCallback(async () => {
    setMounted(true);
    // play after mounting
    requestAnimationFrame(() => {
      const v = videoRef.current;
      if (!v) return;
      v.play().catch(() => {
        /* ignore autoplay failures */
      });
    });
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

  // Attach play/pause listeners to video element
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [onPlay, onPause, mounted]);

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
              <Play size={64} className="text-white/20" />
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-black/60 flex items-center justify-center">
              <Play size={28} />
            </div>
          </div>
        </button>
      ) : (
        <video
          ref={videoRef}
          src={src}
          controls
          preload="none"
          playsInline
          className="w-full h-full object-cover"
          poster={poster}
        />
      )}
    </div>
  );
}

export const MemoizedVideoPlayerComponent = React.memo(VideoPlayerComponent);

// Video player skeleton
export function VideoPlayerSkeleton() {
  return (
    <div className="relative aspect-video bg-slate-900 rounded-xl border-2 border-white/20 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-slate-800" />
      </div>
    </div>
  );
}

type VideoPlayerExtraProps = VideoPlayerProps & {
  category?: string;
  toggleMeta?: () => void;
};

export default function VideoPlayer({
  src,
  title,
  poster,
  autoPlay = false,
  className,
}: VideoPlayerExtraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleCanPlay = () => {
    setLoading(false);
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

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
          onClick={handleRetry}
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
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        title={title}
        poster={poster}
        autoPlay={autoPlay}
        controls
        playsInline
        className="w-full h-full object-contain bg-black"
        onError={handleError}
        onCanPlay={handleCanPlay}
        onLoadedData={handleCanPlay}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
