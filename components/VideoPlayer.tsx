"use client";

import { useRef, useState } from "react";
import { VideoPlayerProps } from "@/types/videoSection";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VideoPlayer({
  src,
  title,
  poster,
  autoPlay = false,
  className,
}: VideoPlayerProps) {
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
