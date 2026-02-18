"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { type AudioItem } from "@/components/MusicPopup";

interface AudioContextProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audios: AudioItem[];
  currentTrack: AudioItem | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  setAudios: React.Dispatch<React.SetStateAction<AudioItem[]>>;
  setCurrentTrack: React.Dispatch<React.SetStateAction<AudioItem | null>>;
  togglePlay: () => void;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [currentTrack, setCurrentTrack] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // start false
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);

  /* ===============================
     1️⃣ Load audio list
  =============================== */
  useEffect(() => {
    const loadAudios = async () => {
      try {
        const res = await fetch("/api/audios", { cache: "no-store" });
        const data = (await res.json()) as AudioItem[];

        setAudios(data);

        if (data.length) {
          setCurrentTrack(data[0]);
        }
      } catch (err) {
        console.error("Audio load failed:", err);
      }
    };

    loadAudios();
  }, []);

  /* ===============================
   2️⃣ Update source when track changes
=============================== */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    let trackUrl =
      (currentTrack as any)?.url ??
      (currentTrack as any)?.src ??
      (currentTrack as any)?.file_path ??
      "";
    trackUrl = `/storage/${trackUrl}`;
    let baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_BASE || "https://8jjcricket.com";
    let trackUrlWithBase = `${baseUrl}${trackUrl}`;

    if (!trackUrlWithBase) return;

    if (audio.src !== trackUrlWithBase) {
      audio.src = trackUrlWithBase;
      audio.load();

      // ✅ Auto-play after loading
      audio.play().catch((err) => {
        console.warn("Autoplay blocked by browser:", err);
      });
    }
  }, [currentTrack]);

  /* ===============================
     3️⃣ Sync React state from Audio Element
  =============================== */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      const idx = audios.findIndex((a) => a.id === currentTrack?.id);
      if (idx >= 0 && idx < audios.length - 1) {
        setCurrentTrack(audios[idx + 1]);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audios, currentTrack]);

  /* ===============================
     4️⃣ Toggle Play (Single Source of Truth)
  =============================== */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch((err) => {
        console.warn("Play blocked:", err);
      });
    } else {
      audio.pause();
    }
  }, []);

  /* ===============================
     5️⃣ Volume & Mute Sync
  =============================== */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = isMuted;
    audio.volume = Math.max(0, Math.min(1, volume));
  }, [isMuted, volume]);

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        audios,
        currentTrack,
        isPlaying,
        isMuted,
        volume,
        setAudios,
        setCurrentTrack,
        togglePlay,
        setIsMuted,
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
