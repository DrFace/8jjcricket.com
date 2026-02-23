"use client";

import { useEffect } from "react";
import {
  X,
  Music2,
  VolumeOff,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  Repeat,
} from "lucide-react";
import { AudioItem } from "@/types/audio";
import MusicSelector from "../MusicSelector";
import "../../src/styles/musicPlayer.css";

export default function MobileMusicPopup(props: {
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
    <>
      <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 overflow-y-auto">
        {/* Overlay — fully transparent, just closes on click */}
        <button className="absolute inset-0 bg-transparent" onClick={onClose} />

        {/* Gradient Border Wrapper */}
        <div
          className="relative rounded-2xl p-[1px] shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #ff9e4375, #ffd00054)",
          }}
        >
          {/* Inner — transparent background */}
          <div
            className="rounded-2xl p-5 text-white"
            style={{
              background: "rgba(15, 23, 42, 0.45)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-3">
              <div className="text-xl font-bold bg-gradient-to-r from-[#FF9F43] to-[#FFD000] bg-clip-text text-transparent">
                🎵 Music Player
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Controls */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                {/* Previous */}
                <button
                  onClick={onPrev}
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:scale-105 transition ${isMuted ? "opacity-50 cursor-not-allowed" : ""}`}
                  title="Previous"
                  disabled={isMuted}
                >
                  <SkipBack size={18} />
                </button>

                {/* Play / Pause with animation */}
                <button
                  onClick={onToggleMusic}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full 
                    text-black shadow-lg hover:scale-110 transition-all duration-200
                    ${isMuted ? "bg-white/10" : "bg-gradient-to-br from-[#FF9F43] to-[#FFD000]"}`}
                  disabled={isMuted}
                  title={musicEnabled ? "Pause" : "Play"}
                >
                  {musicEnabled && !isMuted ? (
                    /* Playing bars animation */
                    <div className="flex items-end gap-[3px] h-5">
                      <span
                        className="bar1 w-[3px] rounded-full bg-black"
                        style={{ height: "6px" }}
                      />
                      <span
                        className="bar2 w-[3px] rounded-full bg-black"
                        style={{ height: "14px" }}
                      />
                      <span
                        className="bar3 w-[3px] rounded-full bg-black"
                        style={{ height: "10px" }}
                      />
                      <span
                        className="bar4 w-[3px] rounded-full bg-black"
                        style={{ height: "4px" }}
                      />
                    </div>
                  ) : (
                    <Play size={22} />
                  )}
                </button>

                {/* Next */}
                <button
                  onClick={onNext}
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:scale-105 transition ${isMuted ? "opacity-50 cursor-not-allowed" : ""}`}
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
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105 ${
                    shuffle ? "bg-[#FFD000]/20" : "bg-white/10"
                  }`}
                >
                  <Shuffle
                    size={18}
                    className={shuffle ? "text-[#FFD000]" : "text-white/70"}
                  />
                </button>

                {/* Mute / Unmute */}
                <button
                  onClick={onToggleMute}
                  title={isMuted ? "Unmute" : "Mute"}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9F43] to-[#FFD000] text-black shadow-lg hover:scale-110 transition"
                >
                  {isMuted ? <VolumeOff size={22} /> : <Music2 size={22} />}
                </button>

                {/* Repeat */}
                <button
                  onClick={onCycleRepeat}
                  aria-pressed={repeatMode !== "off"}
                  title={`Repeat: ${repeatMode}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                    {
                      off: "bg-white/10",
                      all: "bg-[#FFD000]/20",
                      one: "bg-[#FFD000]/40",
                    }[repeatMode]
                  }`}
                >
                  <div className="relative">
                    <Repeat
                      size={18}
                      className={
                        repeatMode === "off"
                          ? "text-white/70"
                          : "text-[#FFD000]"
                      }
                    />
                    {repeatMode === "one" && (
                      <span className="absolute -right-2 -top-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FF9F43] text-black text-[10px] font-semibold">
                        1
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Volume */}
            <div className="mt-4 flex items-center gap-8">
              <div className="w-auto flex-1">
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

            {/* Music Selector */}
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
    </>
  );
}
