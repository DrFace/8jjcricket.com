"use client";

import Link from "next/link";
import { VideoCardProps } from "@/types/videoSection";
import { getVideoUrl } from "@/lib/api/videoSections";
import { Play } from "lucide-react";

// Category color mapping
const categoryColors: Record<string, string> = {
  Highlights: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Top Moments": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Interviews: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  Analysis: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Behind: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  default: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

function getCategoryColor(category: string): string {
  // Check for partial matches first
  for (const key of Object.keys(categoryColors)) {
    if (
      category.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(category.toLowerCase())
    ) {
      return categoryColors[key];
    }
  }
  return categoryColors.default;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const videoUrl = getVideoUrl(video.video_path);
  const categoryColorClass = getCategoryColor(video.category);

  return (
    <div className="relative group">
      {/* Base card with dark glassmorphism */}
      <div className="absolute inset-0 rounded-xl border-2 border-white/20 bg-slate-900/80 backdrop-blur-sm shadow-xl group-hover:border-amber-400/60 group-hover:shadow-2xl transition-all duration-300" />

      {/* Subtle amber glow on hover */}
      <div
        className="
          pointer-events-none
          absolute -inset-px rounded-[18px]
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-orange-500/20
          blur-md
        "
      />

      <Link
        href={`/videos/${video.slug}`}
        onClick={onClick}
        className="relative z-10 block rounded-xl overflow-hidden transition"
      >
        {/* Video thumbnail container */}
        <div className="relative aspect-video bg-slate-800 overflow-hidden">
          {/* Video element as thumbnail */}
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
            onMouseOver={(e) => {
              const target = e.target as HTMLVideoElement;
              target.currentTime = 0;
              target.play().catch(() => {});
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLVideoElement;
              target.pause();
              target.currentTime = 0;
            }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <Play className="w-6 h-6 text-white ml-1" fill="white" />
            </div>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${categoryColorClass}`}
            >
              {video.category}
            </span>
          </div>
        </div>

        {/* Card content */}
        <div className="p-4">
          <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2 group-hover:text-amber-200 transition-colors duration-300">
            {video.title}
          </h3>
        </div>
      </Link>
    </div>
  );
}

// Skeleton loader for VideoCard
export function VideoCardSkeleton() {
  return (
    <div className="relative rounded-xl border-2 border-white/10 bg-slate-900/80 overflow-hidden">
      {/* Thumbnail skeleton */}
      <div className="aspect-video bg-slate-800 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-slate-700 animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-slate-700 rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}
