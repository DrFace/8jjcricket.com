"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Play, PlayCircle, ChevronUp, ChevronDown } from "lucide-react";
import { VideoSectionItem } from "@/types/video";
import { useAudio } from "@/context/AudioContext";
import ThumbnailImg from "../public/images/thumbnail.webp";

export default function HomeVideoGallery() {
  const { isPlaying, togglePlay } = useAudio();
  const [activeMainCat, setActiveMainCat] = useState("All");
  const [videos, setVideos] = useState<VideoSectionItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoSectionItem | null>(
    null,
  );
  const playlistRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const wasPlayingBefore = React.useRef<boolean>(false);
  const isPlayingRef = React.useRef<boolean>(isPlaying);
  const userHasInteracted = React.useRef(false);
  const galleryRef = React.useRef(null);

  // Listen for global stop event to pause video before reload/language change
  useEffect(() => {
    const stopHandler = () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
    window.addEventListener("stop-all-videos", stopHandler);
    return () => window.removeEventListener("stop-all-videos", stopHandler);
  }, []);

  // keep ref up to date with context state, avoids stale closure in handlers
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const scrollPlaylist = (direction: "up" | "down") => {
    if (playlistRef.current) {
      playlistRef.current.scrollBy({
        top: direction === "up" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

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

  const selectVideoHandler = (videoSelected: VideoSectionItem) => {
    userHasInteracted.current = true;
    setCurrentVideo(videoSelected);
    handlePlay();
  };

  // adjust number of visible playlist items based on window height
  useEffect(() => {
    const updateCount = () => {
      const h = window.innerHeight;
      if (h < 556) setVisibleCount(5);
      else if (h < 740) setVisibleCount(5);
      else if (h < 916) setVisibleCount(6);
      else setVisibleCount(8);
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => {
      window.removeEventListener("resize", updateCount);
    };
  }, []);

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
  }, [isPlaying, togglePlay, currentVideo]);

  // Load video sections from backend API
  async function fetchData() {
    try {
      const res = await fetch("/api/video-sections");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setVideos(data);
      if (data.length > 0) setCurrentVideo(data[0]);
    } catch (err) {
      console.error("Error fetching video sections:", err);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchData();
          observer.disconnect(); // fetch only once
        }
      },
      { threshold: 0.1 }, // trigger when 10% visible
    );

    if (galleryRef.current) observer.observe(galleryRef.current);

    return () => observer.disconnect();
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

  console.log("FILTER VIDEOS", filteredVideos);

  // Auto-select first video when filtered list changes
  useEffect(() => {
    if (filteredVideos.length > 0) setCurrentVideo(filteredVideos[0]);
  }, [activeMainCat]);

  // when currentVideo changes we attempt to auto-play the element
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (!userHasInteracted.current) return; // ✅ block autoplay on mount/language reload
    vid.play().catch(() => {});
  }, [currentVideo]);

  const normalizeVideoUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://8jjcricket.com/storage/${path.replace(/\\/g, "/")}`;
  };

  return (
    <div
      ref={galleryRef}
      className="w-full h-full text-white overflow-hidden p-6 lg:p-10"
    >
      <div
        className="max-w-[1650px] mx-auto h-full grid grid-cols-[minmax(0,2fr),minmax(0,8fr),minmax(0,2fr)]
        lg:grid-cols-[2fr,8fr,2fr]      /* optional breakpoints */
        sm:grid-cols-1 
        gap-8"
      >
        {/* ── LEFT SIDEBAR: Categories ── */}
        <div className="space-y-3 pt-4 overflow-y-auto scrollbar-hide min-w-0">
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
            <span className="font-black text-base tracking-tight uppercase">
              All
            </span>
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
              <span className="font-black text-base tracking-tight uppercase truncate">
                {cat}
              </span>
            </button>
          ))}
        </div>

        {/* ── CENTER: Video Player ── */}
        <div className="flex flex-col gap-4 pt-4 min-h-0 min-w-0 overflow-hidden">
          {/* Player */}
          <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl aspect-video w-full">
            {currentVideo ? (
              <video
                ref={videoRef}
                key={currentVideo.id}
                src={normalizeVideoUrl(currentVideo.video_path)}
                preload="none"
                poster={currentVideo.thumbnail_url || ThumbnailImg.src}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <img
                  src={ThumbnailImg.src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play size={25} className="text-white" />
                </div>
              </>
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
              <h2 className="text-2xl font-black text-india-gold uppercase tracking-tight">
                {currentVideo.title}
              </h2>
              <div className="flex items-center gap-6 text-white/50 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  {currentVideo.category}
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
        <div className="flex flex-col pt-4 min-h-0 min-w-0 gap-3">
          {/* Scroll Up */}
          <button
            onClick={() => scrollPlaylist("up")}
            className="w-full flex items-center justify-center py-1 text-white/30 hover:text-india-gold transition-colors "
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <ChevronUp size={25} className="text-india-gold" />
            </div>
          </button>

          {/* Scrollable list — KEY FIX: fixed height + overflow-y-auto */}
          <div
            ref={playlistRef}
            className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0 scrollbar-thin scrollbar-thumb-white/20 hover:scrollbar-thumb-white/50"
            style={{
              maxHeight: `${visibleCount * 82}px`,
            }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {filteredVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-white/20 gap-3">
                <PlayCircle size={48} strokeWidth={1} />
                <span className="font-black uppercase tracking-widest text-xs">
                  No videos found
                </span>
              </div>
            ) : (
              filteredVideos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => selectVideoHandler(video)}
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
                      <>
                        <img
                          src={normalizeVideoUrl(video.thumbnail_url)}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play size={16} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={ThumbnailImg.src}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play size={25} className="text-white" />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <div className="text-amber-400 text-[9px] font-black uppercase tracking-[0.15em] mb-1">
                      {String(video.category) || "Cricket"}
                    </div>
                    <h4
                      className={`font-black text-sm leading-snug line-clamp-2 transition-colors ${
                        currentVideo?.id === video.id
                          ? "text-india-gold"
                          : "text-white"
                      }`}
                    >
                      {video.title}
                    </h4>
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
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <ChevronDown size={25} className="text-india-gold" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
