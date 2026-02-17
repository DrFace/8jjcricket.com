"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { type AudioItem } from "@/components/MusicPopup";
import { GetGlobalAudio, SetGlobalAudioVolume } from "@/lib/audio";

interface AudioContextProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audios: AudioItem[];
  setAudios: (list: AudioItem[]) => void;
  currentTrack: AudioItem | null;
  setCurrentTrack: (track: AudioItem) => void;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  volume: number;
  setVolume: (val: number) => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [currentTrack, setCurrentTrack] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);

  // Load audios from API
  useEffect(() => {
    const loadAudios = async () => {
      try {
        const res = await fetch("/api/audios", { cache: "no-store" });
        const data = (await res.json()) as AudioItem[];
        setAudios(data);

        // Restore previous settings
        const savedTrackId = localStorage.getItem("musicSelectedAudioId");
        const savedMuted = localStorage.getItem("musicEnabled");
        const savedVolume = localStorage.getItem("musicVolume");

        if (savedTrackId && data.length) {
          const track = data.find((t) => t.id === Number(savedTrackId));
          if (track) setCurrentTrack(track);
        } else if (data.length) {
          setCurrentTrack(data[0]);
        }

        if (savedMuted !== null) setIsMuted(savedMuted !== "true");
        if (savedVolume !== null) setVolume(Number(savedVolume));
      } catch (e) {
        console.error("Failed to load audios", e);
      }
    };

    loadAudios();
  }, []);

  // Update audio element when currentTrack, isPlaying, isMuted, or volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // determine track URL (support common possible property names on AudioItem)
    const ct = currentTrack as any;
    const filePath = ct?.file_path ?? ct?.filePath;
    let trackUrl =
      ct?.url ?? ct?.src ?? ct?.stream ?? ct?.file ?? ct?.path ?? "";

    // map API's "file_path": "audios/xxx.mp3" -> "/storage/audios/xxx.mp3"
    if (!trackUrl && filePath) {
      trackUrl =
        filePath.startsWith("http") || filePath.startsWith("/")
          ? filePath
          : `/storage/${filePath}`;
    }

    // normalize to absolute URL so audio.src comparisons and network requests work
    const backendBase =
      process.env.NEXT_PUBLIC_BACKEND_BASE?.replace(/\/$/, "") ??
      (typeof window !== "undefined" ? window.location.origin : "");

    const finalUrl = (() => {
      if (!trackUrl) return "";
      // already absolute
      if (/^https?:\/\//i.test(trackUrl)) return trackUrl;
      // protocol-relative
      if (/^\/\//.test(trackUrl))
        return typeof window !== "undefined"
          ? window.location.protocol + trackUrl
          : `https:${trackUrl}`;
      // relative -> resolve against backend base (prefer env var)
      if (backendBase) return new URL(trackUrl, backendBase).href;
      // last-resort: return as-is (server-side / unknown)
      return trackUrl;
    })();

    if (!currentTrack || !finalUrl) {
      audio.pause();
      return;
    }

    if (audio.src !== finalUrl) {
      audio.src = finalUrl;
      audio.load();
    }

    audio.loop = false;
    audio.preload = "auto";
    audio.muted = isMuted;
    audio.volume = Math.max(0, Math.min(1, volume));

    if (isPlaying) {
      audio.play().catch((err) => {
        // autoplay blocked — reflect in state so UI can prompt user
        console.debug("audio.play() prevented by browser:", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }

    const handleEnded = () => {
      const idx = audios.findIndex((a) => a.id === currentTrack?.id);
      if (idx >= 0 && idx < audios.length - 1) {
        setCurrentTrack(audios[idx + 1]);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [
    currentTrack,
    isPlaying,
    isMuted,
    volume,
    audios,
    setCurrentTrack,
    setIsPlaying,
  ]);

  // Persist state
  useEffect(
    () =>
      localStorage.setItem(
        "musicSelectedAudioId",
        String(currentTrack?.id ?? ""),
      ),
    [currentTrack],
  );
  useEffect(
    () => localStorage.setItem("musicEnabled", (!isMuted).toString()),
    [isMuted],
  );
  useEffect(
    () => localStorage.setItem("musicVolume", String(volume)),
    [volume],
  );

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        audios,
        setAudios,
        currentTrack,
        setCurrentTrack,
        isPlaying,
        setIsPlaying,
        isMuted,
        setIsMuted,
        volume,
        setVolume,
      }}
    >
      {children}
      <audio ref={audioRef} style={{ display: "none" }} />
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
};
