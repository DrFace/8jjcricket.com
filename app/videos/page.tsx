"use client";

import { useState, useMemo } from "react";
import { useVideoSections } from "@/hooks/useVideoSections";
import VideoCard, { VideoCardSkeleton } from "@/components/VideoCard";
import { RefreshCw, Video, Filter } from "lucide-react";

export default function VideosPage() {
  const { videos, loading, error, refetch } = useVideoSections();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extract unique categories from videos
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(videos.map((v) => v.category)),
    ).sort();
    return ["all", ...uniqueCategories];
  }, [videos]);

  // Filter videos by category
  const filteredVideos = useMemo(() => {
    if (selectedCategory === "all") {
      return videos;
    }
    return videos.filter((v) => v.category === selectedCategory);
  }, [videos, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Video className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Videos
            </h1>
          </div>
          <p className="text-slate-400 text-sm sm:text-base">
            Watch the latest cricket highlights, top moments, and exclusive
            content
          </p>
        </div>

        {/* Category Filter */}
        {!loading && videos.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Filter by category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-amber-500 text-slate-900"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  }`}
                >
                  {category === "all" ? "All Videos" : category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <VideoCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <Video className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Failed to load videos
            </h2>
            <p className="text-slate-400 text-center mb-6 max-w-md">{error}</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredVideos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <Video className="w-8 h-8 text-slate-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {selectedCategory === "all"
                ? "No videos available"
                : `No videos in "${selectedCategory}"`}
            </h2>
            <p className="text-slate-400 text-center max-w-md">
              {selectedCategory === "all"
                ? "Check back later for new video content."
                : "Try selecting a different category."}
            </p>
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Show All Videos
              </button>
            )}
          </div>
        )}

        {/* Videos Grid */}
        {!loading && !error && filteredVideos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}

        {/* Video count */}
        {!loading && !error && filteredVideos.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Showing {filteredVideos.length} of {videos.length} videos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
