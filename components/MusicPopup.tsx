"use client";

import { useEffect } from "react";
import { X, Music2, VolumeOff } from "lucide-react";

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
    <div className="fixed inset-0 z-[200]">
      <button
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-black/90 p-4 text-white shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Music Settings</div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            onClick={onToggleMusic}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
          >
            {musicEnabled ? <Music2 size={18} /> : <VolumeOff size={18} />}
            {musicEnabled ? "Music ON" : "Music OFF"}
          </button>

          <div className="flex flex-1 items-center gap-3">
            <span className="text-xs text-white/70">Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onChangeVolume(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 text-xs font-semibold text-white/70">
            Choose song
          </div>

          <div className="max-h-64 overflow-auto rounded-xl border border-white/10">
            {audios.length === 0 ? (
              <div className="p-3 text-sm text-white/70">
                No songs available
              </div>
            ) : (
              <ul className="divide-y divide-white/10">
                {audios.map((a) => {
                  const active = a.id === selectedId;
                  return (
                    <li key={a.id}>
                      <button
                        onClick={() => onSelect(a.id)}
                        className={`w-full px-3 py-3 text-left text-sm hover:bg-white/5 ${
                          active ? "bg-white/10" : ""
                        }`}
                      >
                        <div className="font-semibold">{a.title}</div>
                       
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
