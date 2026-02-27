"use client";

import { use } from "react";
import Link from "next/link";
import { useVideoSection } from "@/hooks/useVideoSections";
import { useVideoSections } from "@/hooks/useVideoSections";
import VideoPlayer, { VideoPlayerSkeleton } from "@/components/VideoPlayer";
import VideoCard from "@/components/VideoCard";
import { ArrowLeft, Calendar, Tag, RefreshCw, Video } from "lucide-react";
import { GetVideoUrl } from "@/lib/media";

// Category color mapping (same as VideoCard)
const categoryColors: Record<string, string> = {
  Highlights: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Top Moments": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Interviews: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  Analysis: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Behind: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  default: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

function getCategoryColor(category: string): string {
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface VideoPageProps {
  params: Promise<{ slug: string }>;
}

export default function VideoPage({ params }: VideoPageProps) {
  const { slug } = use(params);
  const { video, loading, error } = useVideoSection(slug);
  const { videos: allVideos } = useVideoSections();

  // Get related videos (same category, excluding current)
  const relatedVideos = allVideos
    .filter((v) => v.slug !== slug && v.category === video?.category)
    .slice(0, 4);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          {/* Back button skeleton */}
          <div className="mb-6">
            <div className="w-32 h-10 bg-slate-800 rounded-lg animate-pulse" />
          </div>

          {/* Video player skeleton */}
          <VideoPlayerSkeleton />

          {/* Title skeleton */}
          <div className="mt-6 space-y-4">
            <div className="h-8 bg-slate-800 rounded animate-pulse w-3/4" />
            <div className="flex gap-4">
              <div className="h-6 w-24 bg-slate-800 rounded-full animate-pulse" />
              <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state (404 or other errors)
  if (error || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Videos
          </Link>

          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
              <Video className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              Video Not Found
            </h1>
            <p className="text-slate-400 text-center mb-8 max-w-md">
              {error ||
                "The video you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex gap-4">
              <Link
                href="/videos"
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Browse Videos
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const videoUrl = GetVideoUrl(video.video_path);
  const categoryColorClass = getCategoryColor(video.category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/videos"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Videos
        </Link>

        {/* Video Player */}
        <div className="max-w-5xl mx-auto">
          <VideoPlayer
            src={videoUrl}
            title={video.title}
            className="shadow-2xl border-2 border-white/10"
          />

          {/* Video Info */}
          <div className="mt-6 space-y-4">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              {video.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Category badge */}
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${categoryColorClass}`}
                >
                  {video.category}
                </span>
              </div>

              {/* Published date */}
              {video.created_at && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Published {formatDate(video.created_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Videos Section */}
        {relatedVideos.length > 0 && (
          <div className="mt-16 max-w-5xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              Related Videos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedVideos.map((relatedVideo) => (
                <VideoCard key={relatedVideo.id} video={relatedVideo} />
              ))}
            </div>
          </div>
        )}

        {/* More Videos Section (if no related videos) */}
        {relatedVideos.length === 0 && allVideos.length > 1 && (
          <div className="mt-16 max-w-5xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              More Videos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {allVideos
                .filter((v) => v.slug !== slug)
                .slice(0, 4)
                .map((otherVideo) => (
                  <VideoCard key={otherVideo.id} video={otherVideo} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
