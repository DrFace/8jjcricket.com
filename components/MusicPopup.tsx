"use client";

import { useEffect } from "react";
import {
  X,
  Music2,
  VolumeOff,
  Play,
  Pause,
  Shuffle,
  SkipBack,
  SkipForward,
  Repeat,
} from "lucide-react";
import MusicSelector from "./MusicSelector";
import { AudioItem } from "@/types/audio";

export default function MusicPopup(props: {
  open: boolean;
  onClose: () => void;

  audios: AudioItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  onNext: () => void;
  onPrev: () => void;
  shuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: "off" | "all" | "one";
  onCycleRepeat: () => void;
  volume: number;
  onChangeVolume: (v: number) => void;
}) {
  const {
    open,
    onClose,
    audios,
    selectedId,
    onSelect,
    musicEnabled,
    onToggleMusic,
    onToggleMute,
    onNext,
    onPrev,
    shuffle,
    onToggleShuffle,
    repeatMode,
    onCycleRepeat,
    isMuted,
    volume,
    onChangeVolume,
  } = props;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-5 overflow-y-auto">
      {/* Overlay */}
      <button
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Gradient Border Wrapper */}
      <div className="relative rounded-2xl bg-transparent backdrop-blur-sm p-[1px] shadow-2xl">
        {/* Inner */}
        <div className="rounded-2xl bg-[#0f172a] p-5 text-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-3">
            <div className="text-xl font-bold bg-gradient-to-r from-[#FF9F43] to-[#FFD000] bg-clip-text text-transparent ">
              🎵 Music Player
            </div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Controls */}
          <div className="mt-4">
            <div className="flex items-center justify-between ">
              {/* Previous */}
              <button
                onClick={onPrev}
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:scale-105 transition ${isMuted ? "opacity-50 cursor-not-allowed" : ""}`}
                title="Previous"
                disabled={isMuted}
              >
                <SkipBack size={18} />
              </button>

              <button
                onClick={onToggleMusic}
                className={`flex h-10 w-10 items-center justify-center rounded-full 
                  text-black shadow-lg 
                  hover:scale-110 transition ${isMuted ? "bg-white/5" : "bg-gradient-to-br from-[#FF9F43] to-[#FFD000]"}`}
                disabled={isMuted}
                title={musicEnabled ? "Pause" : "Play"}
              >
                {musicEnabled ? <Pause size={22} /> : <Play size={22} />}
              </button>

              {/* Next */}
              <button
                onClick={onNext}
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:scale-105 transition ${isMuted ? "opacity-50 cursor-not-allowed" : ""}`}
                title="Next"
                disabled={isMuted}
              >
                <SkipForward size={18} />
              </button>
            </div>
            <div className="flex items-center mt-3 justify-between">
              {/* Shuffle */}
              <button
                onClick={onToggleShuffle}
                aria-pressed={shuffle}
                title={shuffle ? "Shuffle ON" : "Shuffle OFF"}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  {
                    true: "bg-[#FFD000]/20",
                    false: "bg-white/5",
                  }[String(shuffle as any)]
                } hover:scale-105`}
              >
                <Shuffle
                  size={18}
                  className={shuffle ? "text-[#FFD000]" : "text-white/70"}
                />
              </button>
              {/* Mute / Unmute (restored) */}
              <button
                onClick={onToggleMute}
                title={isMuted ? "Unmute" : "Mute"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9F43] to-[#FFD000] text-black shadow-lg hover:scale-110 transition"
              >
                {isMuted ? <VolumeOff size={22} /> : <Music2 size={22} />}
              </button>
              {/* Repeat (off / all / one) */}
              <button
                onClick={onCycleRepeat}
                aria-pressed={repeatMode !== "off"}
                title={`Repeat: ${repeatMode}`}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  {
                    off: "bg-white/5",
                    all: "bg-[#FFD000]/20",
                    one: "bg-[#FFD000]/40",
                  }[repeatMode]
                }`}
              >
                <div className="relative">
                  <Repeat
                    size={18}
                    className={
                      repeatMode === "off" ? "text-white/70" : "text-[#FFD000]"
                    }
                  />
                  {repeatMode === "one" ? (
                    <span className="absolute -right-2 -top-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FF9F43] text-black text-[10px] font-semibold">
                      1
                    </span>
                  ) : null}
                </div>
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-8">
            {/* Volume */}
            <div className="w-auto flex-1 ">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => onChangeVolume(Number(e.target.value))}
                className="w-full accent-[#FF9F43]"
              />
            </div>
          </div>
          {/* Quick dropdown selector */}
          <div>
            <MusicSelector
              audios={audios}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
