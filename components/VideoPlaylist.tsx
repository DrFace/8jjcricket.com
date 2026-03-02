"use client";

import React, { useCallback, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { VideoSectionItem } from "@/types/video";

type Props = {
  videos: VideoSectionItem[];
  currentVideoId: string | number | null;
  onSelect: (v: VideoSectionItem) => void;
};

const normalizeVideoUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `https://8jjcricket.com/storage/${path.replace(/\\/g, "/")}`;
};

function VideoPlaylist({ videos, currentVideoId, onSelect }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const scroll = useCallback((dir: "up" | "down") => {
    if (!ref.current) return;
    ref.current.scrollBy({
      top: dir === "up" ? -200 : 200,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <button
        onClick={() => scroll("up")}
        className="w-full flex items-center justify-center py-1 text-white/30 hover:text-india-gold transition-colors "
      >
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronUp size={25} className="text-india-gold" />
        </div>
      </button>

      <div
        ref={ref}
        className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0 scrollbar-thin scrollbar-thumb-white/20 hover:scrollbar-thumb-white/50"
        style={{ maxHeight: "60vh" }}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-white/20 gap-3">
            <div className="text-white/20">No videos found</div>
          </div>
        ) : (
          videos.map((video) => (
            <button
              key={video.id}
              onClick={() => onSelect(video)}
              className={`w-full flex items-stretch gap-3 p-3 rounded-2xl transition-all duration-300 border relative overflow-hidden text-left ${
                currentVideoId === video.id
                  ? "bg-white/10 border-india-gold/40 shadow-lg"
                  : "bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/15"
              }`}
            >
              {currentVideoId === video.id && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-india-gold shadow-[0_0_10px_rgba(255,184,0,0.8)]" />
              )}

              <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-black/60 border border-white/10 shrink-0">
                {video.thumbnail_url ? (
                  <img
                    src={normalizeVideoUrl(video.thumbnail_url)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-white/20">No image</div>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center min-w-0 flex-1">
                <div className="text-amber-400 text-[9px] font-black uppercase tracking-[0.15em] mb-1">
                  {String(video.category) || "Cricket"}
                </div>
                <h4
                  className={`font-black text-sm leading-snug line-clamp-2 transition-colors ${currentVideoId === video.id ? "text-india-gold" : "text-white"}`}
                >
                  {video.title}
                </h4>
              </div>
            </button>
          ))
        )}
      </div>

      <button
        onClick={() => scroll("down")}
        className="w-full flex items-center justify-center py-1 text-white/30 hover:text-india-gold transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronDown size={25} className="text-india-gold" />
        </div>
      </button>
    </>
  );
}

export default React.memo(VideoPlaylist);
