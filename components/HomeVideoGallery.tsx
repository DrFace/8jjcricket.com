"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Play,
  PlayCircle,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Calendar,
  Clock,
} from "lucide-react";
import { VideoSectionItem } from "@/types/video";

export default function HomeVideoGallery() {
  const [activeMainCat, setActiveMainCat] = useState("All");
  const [videos, setVideos] = useState<VideoSectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<VideoSectionItem | null>(null);
  const playlistRef = React.useRef<HTMLDivElement>(null);

  const scrollPlaylist = (direction: "up" | "down") => {
    if (playlistRef.current) {
      playlistRef.current.scrollBy({
        top: direction === "up" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/video-sections");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setVideos(data);
        if (data.length > 0) setCurrentVideo(data[0]);
      } catch (err) {
        console.error("Error fetching video sections:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    videos.forEach((v) => {
      if (v.category !== undefined && v.category !== null && v.category !== "")
        cats.add(String(v.category));
    });
    return Array.from(cats);
  }, [videos]);

  const filteredVideos = useMemo(() => {
    if (activeMainCat === "All") return videos;
    return videos.filter((v) => String(v.category) === activeMainCat);
  }, [videos, activeMainCat]);

  // Auto-select first video when filtered list changes
  useEffect(() => {
    if (filteredVideos.length > 0) setCurrentVideo(filteredVideos[0]);
  }, [activeMainCat]);

  const normalizeVideoUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://8jjcricket.com/storage/${path.replace(/\\/g, "/")}`;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-india-gold" />
          <span className="text-india-gold/60 font-medium animate-pulse">Loading Gallery...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full text-white overflow-hidden p-6 lg:p-10">
      <div className="max-w-[1550px] mx-auto h-full grid grid-cols-[280px,1fr,380px] gap-8">

        {/* ── LEFT SIDEBAR: Categories ── */}
        <div className="space-y-3 pt-4 overflow-y-auto scrollbar-hide">
          {/* ALL button */}
          <button
            onClick={() => setActiveMainCat("All")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 border ${
              activeMainCat === "All"
                ? "bg-india-gold border-india-gold text-black shadow-[0_4px_15px_rgba(255,184,0,0.2)]"
                : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            <PlayCircle size={18} />
            <span className="font-black text-base tracking-tight uppercase">All</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveMainCat(cat)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 border relative overflow-hidden ${
                activeMainCat === cat
                  ? "bg-india-gold border-india-gold text-black shadow-[0_4px_15px_rgba(255,184,0,0.2)]"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              {activeMainCat === cat && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
              )}
              <PlayCircle size={18} className="shrink-0" />
              <span className="font-black text-base tracking-tight uppercase truncate">{cat}</span>
            </button>
          ))}
        </div>

        {/* ── CENTER: Video Player ── */}
        <div className="flex flex-col gap-4 pt-4 min-h-0 overflow-hidden">
          {/* Player */}
          <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl aspect-video w-full">
            {currentVideo ? (
              <video
                key={currentVideo.id}
                src={normalizeVideoUrl(currentVideo.video_path)}
                controls
                className="w-full h-full object-contain"
                poster={currentVideo.thumbnail_url}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">
                <Play size={100} strokeWidth={1} />
              </div>
            )}

            {currentVideo && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-india-gold/30 text-india-gold text-[10px] font-black uppercase tracking-[0.2em]">
                {String(currentVideo.category) || "Official Video"}
              </div>
            )}
          </div>

          {/* Video meta */}
          {currentVideo && (
            <div className="space-y-1 px-1">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {currentVideo.title}
              </h2>
              <div className="flex items-center gap-6 text-white/50 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Calendar size={14} className="text-india-gold" />
                  {currentVideo.published_at || "January 18, 2026"}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={14} className="text-india-gold" />
                  00:00
                </span>
              </div>
              {currentVideo.description && (
                <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                  {currentVideo.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT: Playlist ── */}
        <div className="flex flex-col pt-4 min-h-0 gap-3">

          {/* Scroll Up */}
          <button
            onClick={() => scrollPlaylist("up")}
            className="w-full flex items-center justify-center py-1 text-white/30 hover:text-india-gold transition-colors"
          >
            <ChevronUp size={20} />
          </button>

          {/* Scrollable list — KEY FIX: fixed height + overflow-y-auto */}
          <div
            ref={playlistRef}
            className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide min-h-0"
            style={{ maxHeight: "calc(100% - 120px)" }}
          >
            {filteredVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-white/20 gap-3">
                <PlayCircle size={48} strokeWidth={1} />
                <span className="font-black uppercase tracking-widest text-xs">No videos found</span>
              </div>
            ) : (
              filteredVideos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setCurrentVideo(video)}
                  className={`w-full flex items-stretch gap-3 p-3 rounded-2xl transition-all duration-300 border relative overflow-hidden text-left ${
                    currentVideo?.id === video.id
                      ? "bg-white/10 border-india-gold/40 shadow-lg"
                      : "bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/15"
                  }`}
                >
                  {/* Active left bar */}
                  {currentVideo?.id === video.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-india-gold shadow-[0_0_10px_rgba(255,184,0,0.8)]" />
                  )}

                  {/* Thumbnail — compact fixed size */}
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-black/60 border border-white/10 shrink-0">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play size={16} className="text-white/20" />
                      </div>
                    )}
                    {/* Duration badge */}
                    <span className="absolute bottom-1 right-1 bg-black/90 text-[9px] px-1.5 py-0.5 rounded font-mono text-white border border-white/10">
                      00:00
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <div className="text-india-gold text-[9px] font-black uppercase tracking-[0.15em] mb-1">
                      {String(video.category) || "Cricket"}
                    </div>
                    <h4
                      className={`font-black text-sm leading-snug line-clamp-2 transition-colors ${
                        currentVideo?.id === video.id ? "text-india-gold" : "text-white"
                      }`}
                    >
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[9px] text-white/30 uppercase font-bold tracking-widest">
                      <Calendar size={10} />
                      {video.published_at || "18/01/2026"}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Scroll Down */}
          <button
            onClick={() => scrollPlaylist("down")}
            className="w-full flex items-center justify-center py-1 text-white/30 hover:text-india-gold transition-colors"
          >
            <ChevronDown size={20} />
          </button>

          {/* View More */}
          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 hover:border-india-gold/30 transition-all flex items-center justify-center gap-2 group shrink-0">
            View More Videos
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-india-gold" />
          </button>
        </div>

      </div>
    </div>
  );
}