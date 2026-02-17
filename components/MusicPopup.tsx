"use client";

import { useEffect } from "react";
import { X, Music2, VolumeOff, Play, Pause } from "lucide-react";
import MusicSelector from "./MusicSelector";

export type AudioItem = {
  id: number;
  title: string;
  file_path: string;
};

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
      <div className="relative w-[92vw] max-w-md rounded-2xl bg-transparent backdrop-blur-sm p-[1px] shadow-2xl">
        {/* Inner */}
        <div className="rounded-2xl bg-[#0f172a] p-5 text-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="text-xl font-bold bg-gradient-to-r from-[#FF9F43] to-[#FFD000] bg-clip-text text-transparent">
              🎵 Music Settings
            </div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-6">
            {/* Mute Button */}
            <button
              onClick={onToggleMute}
              className="flex h-14 w-14 items-center justify-center rounded-full 
              bg-gradient-to-br from-[#FF9F43] to-[#FFD000] 
              text-black shadow-lg 
              hover:scale-110 transition"
            >
              {isMuted ? <VolumeOff size={22} /> : <Music2 size={22} />}
            </button>
            {/* Play Button */}
            {!isMuted ? (
              <button
                onClick={onToggleMusic}
                className="flex h-14 w-14 items-center justify-center rounded-full 
              bg-gradient-to-br from-[#FF9F43] to-[#FFD000] 
              text-black shadow-lg 
              hover:scale-110 transition"
              >
                {musicEnabled ? <Pause size={22} /> : <Play size={22} />}
              </button>
            ) : null}

            {/* Volume */}
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

          {/* Quick dropdown selector */}
          <div className="mt-6">
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
