"use client";

import React, { useState, useMemo } from "react";

export type VideoSection = {
  id: number;
  title: string;
  slug: string;
  video_path: string;
  category: string;
};

type Props = {
  videos: VideoSection[];
};

const categoryLabel = (cat: string) => {
  // Customize category display if needed
  return cat;
};

export default function HomeVideoShowcase({ videos }: Props) {
  const categories = useMemo(() => {
    const cats = Array.from(new Set(videos.map((v) => v.category)));
    return cats.length > 0 ? cats : ["All"];
  }, [videos]);

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filteredVideos = useMemo(() => {
    if (!activeCategory || activeCategory === "All") return videos;
    return videos.filter((v) => v.category === activeCategory);
  }, [videos, activeCategory]);

  const featured = filteredVideos[0];
  const sidebar = filteredVideos.slice(1, 6);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6">
      {/* Category Tabs */}
      <div className="w-full flex gap-2 mb-4 lg:mb-0">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full font-semibold transition-all border border-transparent bg-white/10 text-white/80 hover:bg-blue-500/80 hover:text-white ${
              activeCategory === cat ? "bg-blue-500/90 text-white" : ""
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {categoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Featured Video */}
        <div className="flex-1 bg-white/10 rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center min-h-[340px] max-w-2xl mx-auto lg:mx-0">
          {featured ? (
            <div className="w-full">
              <div className="aspect-video rounded-xl overflow-hidden bg-black mb-3">
                <video
                  src={featured.video_path}
                  controls
                  poster={undefined}
                  className="w-full h-full object-cover"
                  preload="metadata"
                />
              </div>
              <div className="text-lg font-bold text-white mb-1 truncate">
                {featured.title}
              </div>
              <div className="text-xs text-blue-300 font-semibold uppercase tracking-wide">
                {categoryLabel(featured.category)}
              </div>
            </div>
          ) : (
            <div className="text-white/60 text-center">
              No videos available.
            </div>
          )}
        </div>

        {/* Sidebar List */}
        <div className="w-full lg:w-80 flex flex-col gap-3">
          {sidebar.length === 0 && (
            <div className="text-white/60 text-center py-8">
              No more videos in this category.
            </div>
          )}
          {sidebar.map((video) => (
            <a
              key={video.id}
              href={`/videos/${video.slug}`}
              className="flex items-center gap-3 bg-white/5 hover:bg-blue-500/30 transition rounded-xl p-2 group"
            >
              <div className="w-20 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0">
                <video
                  src={video.video_path}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                  playsInline
                  // poster={undefined}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate group-hover:text-blue-100">
                  {video.title}
                </div>
                <div className="text-xs text-blue-300 font-semibold uppercase tracking-wide">
                  {categoryLabel(video.category)}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
