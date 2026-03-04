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
  const [isPaused, setIsPaused] = React.useState(true);
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
    setIsPaused(true);
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
          {/* Player card */}
          <div className="relative rounded-3xl overflow-hidden aspect-video w-full bg-black">
            {currentVideo ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  key={currentVideo.id}
                  src={normalizeVideoUrl(currentVideo.video_path)}
                  preload="none"
                  poster={
                    normalizeVideoUrl(currentVideo.thumbnail_url || "") ||
                    ThumbnailImg.src
                  }
                  controls
                  className="w-full h-full object-cover"
                  onPlay={() => setIsPaused(false)}
                  onPause={() => setIsPaused(true)}
                />
                {/* Animated play button overlay — visible only when paused */}
                {isPaused && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/25 cursor-pointer"
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.play();
                        userHasInteracted.current = true;
                      }
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-16 h-16 rounded-full border border-white/40 animate-[ping_1.8s_ease-out_infinite]" />
                      <span className="absolute w-16 h-16 rounded-full border border-white/25 animate-[ping_1.8s_ease-out_0.5s_infinite]" />
                      <span className="absolute w-16 h-16 rounded-full border border-white/15 animate-[ping_1.8s_ease-out_1s_infinite]" />
                      <div className="relative w-16 h-16 rounded-full border-2 border-white/70 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
                        <Play
                          size={28}
                          className="text-white ml-1"
                          fill="white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* Thumbnail */}
                <img
                  src={ThumbnailImg.src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Centered play button with wave animation */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="relative flex items-center justify-center">
                    {/* Wave rings */}
                    <span className="absolute w-16 h-16 rounded-full border border-white/40 animate-[ping_1.8s_ease-out_infinite]" />
                    <span className="absolute w-16 h-16 rounded-full border border-white/25 animate-[ping_1.8s_ease-out_0.5s_infinite]" />
                    <span className="absolute w-16 h-16 rounded-full border border-white/15 animate-[ping_1.8s_ease-out_1s_infinite]" />
                    {/* Play button */}
                    <div className="relative w-16 h-16 rounded-full border-2 border-white/70 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
                      <Play
                        size={28}
                        className="text-white ml-1"
                        fill="white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category badge */}
            {currentVideo && (
              <div className="absolute top-3 left-3 z-20">
                <span className="px-3 py-1 bg-india-gold text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                  {String(currentVideo.category) || "Official Video"}
                </span>
              </div>
            )}

            {/* Live dot */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest">
                Live
              </span>
            </div>
          </div>

          {/* Video meta */}
          {currentVideo && (
            <div className="relative px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-india-gold/60 to-transparent" />
              <div className="absolute bottom-0 right-0 w-32 h-full bg-gradient-to-l from-india-gold/5 to-transparent pointer-events-none rounded-2xl" />

              <h2 className="text-lg font-black text-india-gold uppercase tracking-tight leading-snug line-clamp-1">
                {currentVideo.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-india-gold/70" />
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  {currentVideo.category}
                </span>
              </div>
              {currentVideo.description && (
                <p className="text-white/45 text-xs leading-relaxed line-clamp-2 mt-1.5">
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
