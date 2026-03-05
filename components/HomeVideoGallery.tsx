"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Play, PlayCircle, ChevronUp, ChevronDown } from "lucide-react";
import { VideoSectionItem } from "@/types/video";
import { useAudio } from "@/context/AudioContext";
import ThumbnailImg from "../public/images/thumbnail.webp";
import AmbientVideoPlayer, {
  AmbientVideoPlayerHandle,
} from "./AmbientVideoPlayer";

export default function HomeVideoGallery() {
  const { isPlaying, togglePlay } = useAudio();
  const [activeMainCat, setActiveMainCat] = useState("All");
  const [videos, setVideos] = useState<VideoSectionItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoSectionItem | null>(
    null,
  );
  const playlistRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const playerRef = React.useRef<AmbientVideoPlayerHandle>(null);
  const wasPlayingBefore = React.useRef<boolean>(false);
  const isPlayingRef = React.useRef<boolean>(isPlaying);
  const userHasInteracted = React.useRef(false);
  const [isPaused, setIsPaused] = React.useState(true);

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

  // Load data
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full h-full text-white overflow-hidden p-6 lg:p-10">
      <div
        className="max-w-[1650px] mx-auto h-full grid grid-cols-[minmax(0,2fr),minmax(0,8fr),minmax(0,2fr)]
        lg:grid-cols-[2fr,8fr,2fr]      /* optional breakpoints */
        sm:grid-cols-1 
        gap-8"
      >
        {/* ── LEFT SIDEBAR: Categories ── */}
        <div className="space-y-3 p-2 overflow-y-auto scrollbar-hide min-w-0">
          {/* ALL button */}
          <button
            onClick={() => setActiveMainCat("All")}
            className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${
              activeMainCat === "All"
                ? "bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 text-black scale-105 hover:shadow-[0_8px_20px_rgba(255,255,255,0.1)]"
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/15 hover:border-white/30 hover:scale-102 hover:shadow-[0_8px_20px_rgba(255,255,255,0.1)] backdrop-blur-sm"
            }`}
          >
            <PlayCircle size={20} />
            <span className="font-black text-base tracking-tight uppercase">
              All
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveMainCat(cat)}
              className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 border relative overflow-hidden ${
                activeMainCat === cat
                  ? "bg-gradient-to-r from-yellow-400 to-transparent border-yellow-200 text-black shadow-[0_8px_24px_rgba(250,204,21,0.35)] scale-105"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/15 hover:border-white/30 hover:scale-102 hover:shadow-[0_8px_20px_rgba(255,255,255,0.1)] backdrop-blur-sm"
              }`}
            >
              {/* Animated background glow on hover */}
              {activeMainCat !== cat && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              )}

              {/* Active state shine effect */}
              {activeMainCat === cat && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent pointer-events-none" />
              )}

              {/* Icon with animation */}
              <PlayCircle
                size={20}
                className={`shrink-0 transition-all duration-300 ${
                  activeMainCat === cat
                    ? "rotate-0"
                    : "group-hover:scale-110 group-hover:rotate-12"
                }`}
              />

              {/* Text */}
              <span className="font-black text-base tracking-tight uppercase truncate">
                {cat}
              </span>
            </button>
          ))}
        </div>

        {/* ── CENTER: Video Player ── */}
        <div className="flex flex-col gap-4 min-h-0 min-w-0 overflow-hidden">
          {/* Player card */}
          <div className="relative rounded-3xl overflow-hidden aspect-video w-full">
            {currentVideo ? (
              <div className="relative w-full h-full">
                <AmbientVideoPlayer
                  ref={playerRef}
                  src={normalizeVideoUrl(currentVideo.video_path)}
                  poster={
                    normalizeVideoUrl(currentVideo.thumbnail_url || "") ||
                    ThumbnailImg.src
                  }
                  onPlay={() => {
                    setIsPaused(false);
                    handlePlay();
                  }}
                  onPause={() => {
                    setIsPaused(true);
                    handlePause();
                  }}
                />
                {/* Animated play button overlay — visible only when paused */}
                {isPaused && (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                    onClick={() => {
                      playerRef.current?.play();
                      userHasInteracted.current = true;
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-16 h-16 rounded-full border border-amber/40 animate-[ping_1.8s_ease-out_infinite]" />
                      <span className="absolute w-16 h-16 rounded-full border border-amber/25 animate-[ping_1.8s_ease-out_0.5s_infinite]" />
                      <span className="absolute w-16 h-16 rounded-full border border-amber/15 animate-[ping_1.8s_ease-out_1s_infinite]" />
                      <div className="relative w-16 h-16 rounded-full border-2 border-amber/70 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
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
                    <span className="absolute w-16 h-16 rounded-full border border-amber-300/40 animate-[ping_1.8s_ease-out_infinite]" />
                    <span className="absolute w-16 h-16 rounded-full border border-amber-300/25 animate-[ping_1.8s_ease-out_0.5s_infinite]" />
                    <span className="absolute w-16 h-16 rounded-full border border-amber-300/15 animate-[ping_1.8s_ease-out_1s_infinite]" />
                    {/* Play button */}
                    <div className="relative w-16 h-16 rounded-full border-2 border-yellow-300/70 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
                      <Play
                        size={28}
                        className="text-white ml-1"
                        fill="amber"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category badge */}
            {currentVideo && (
              <div className="absolute top-3 left-3 z-20">
                <span className="px-3 py-1 bg-amber-300 text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                  {String(currentVideo.category) || "Official Video"}
                </span>
              </div>
            )}
          </div>

          {/* Video meta */}
          {currentVideo && (
            <div className="relative px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-yellow-300/60 to-transparent" />
              <div className="absolute bottom-0 right-0 w-32 h-full bg-gradient-to-l from-yellow-300/5 to-transparent pointer-events-none rounded-2xl" />

              <h2 className="text-xl font-black text-yellow-300 tracking-tight leading-snug line-clamp-1">
                {currentVideo.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-300/70" />
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  {currentVideo.category}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Playlist ── */}
        <div className="flex flex-col py-4 min-h-0 min-w-0 gap-3 bg-white/5 rounded-3xl border border-white/10 w-full">
          {/* Scroll Up */}
          <button
            onClick={() => scrollPlaylist("up")}
            className="w-full flex items-center justify-center py-1 text-white/30 hover:text-yellow-300 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center transform-gpu hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.45),0_6px_12px_rgba(250,204,21,0.08)] border border-yellow-300/20 relative overflow-hidden">
              {/* subtle top highlight */}
              <span className="absolute top-1 left-2 w-6 h-1 rounded-full bg-white/40 opacity-30 blur-sm rotate-12" />
              {/* soft inner vignette */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-t from-black/12 to-transparent opacity-10 pointer-events-none" />
              {/* small rim shine (bottom-right) */}
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-white/20 opacity-40 blur-sm" />
              <ChevronUp
                size={25}
                className="text-yellow-300 group-hover:scale-125 transition-transform duration-300"
              />
            </div>
          </button>

          {/* Scrollable list */}
          <div
            ref={playlistRef}
            className="flex-1 overflow-y-auto overflow-x-visible space-y-3 px-2 pt-2 min-h-0 scrollbar-thin scrollbar-thumb-white/20 hover:scrollbar-thumb-white/50"
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
                  className={`group w-full flex items-stretch gap-3 p-3 rounded-2xl transition-all duration-300 border relative overflow-hidden text-left ${
                    currentVideo?.id === video.id
                      ? "bg-gradient-to-r from-white/40 to-white/10 border-yellow-300/60 shadow-[0_8px_24px_rgba(250,204,21,0.25)]"
                      : "bg-white/20 border-white/5 hover:bg-gradient-to-r hover:from-white/12 hover:to-white/5 hover:border-white/25 hover:scale-102 hover:shadow-[0_6px_20px_rgba(255,255,255,0.1)]"
                  }`}
                >
                  {/* Active left bar with glow */}
                  {currentVideo?.id === video.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-yellow-300 to-yellow-400 shadow-[0_0_15px_rgba(255,184,0,0.9)]" />
                  )}

                  {/* Thumbnail — enhanced with animations */}
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-black/60 border border-white/10 shrink-0 group-hover:border-yellow-300/40 transition-all duration-300">
                    {video.thumbnail_url ? (
                      <>
                        <img
                          src={normalizeVideoUrl(video.thumbnail_url)}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors duration-300">
                          <Play
                            size={16}
                            className="text-white group-hover:scale-125 group-hover:text-yellow-300 transition-all duration-300"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={ThumbnailImg.src}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors duration-300">
                          <Play
                            size={25}
                            className="text-white group-hover:scale-125 group-hover:text-yellow-300 transition-all duration-300"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <div className="text-amber-400 text-[9px] font-black uppercase tracking-[0.15em] mb-1 group-hover:text-yellow-300 transition-colors duration-300">
                      {String(video.category) || "Cricket"}
                    </div>
                    <h4
                      className={`font-black text-sm leading-snug line-clamp-2 transition-all duration-300 ${
                        currentVideo?.id === video.id
                          ? "text-yellow-300"
                          : "text-white group-hover:text-yellow-200"
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
            className="w-full flex items-center justify-center py-1 text-white/30 hover:text-yellow-300 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center transform-gpu hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.45),0_6px_12px_rgba(250,204,21,0.08)] border border-yellow-300/20 relative overflow-hidden">
              {/* subtle top highlight */}
              <span className="absolute top-1 left-2 w-6 h-1 rounded-full bg-white/40 opacity-30 blur-sm rotate-12" />
              {/* soft inner vignette */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-t from-black/12 to-transparent opacity-10 pointer-events-none" />
              {/* small rim shine (bottom-right) */}
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-white/20 opacity-40 blur-sm" />
              <ChevronDown
                size={25}
                className="text-yellow-300 group-hover:scale-125 transition-transform duration-300"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
