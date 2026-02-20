"use client";

import { AudioItem } from "@/types/audio";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

type RepeatMode = "off" | "all" | "one";
interface AudioContextProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audios: AudioItem[];
  currentTrack: AudioItem | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
  setAudios: React.Dispatch<React.SetStateAction<AudioItem[]>>;
  setCurrentTrack: React.Dispatch<React.SetStateAction<AudioItem | null>>;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

const AUDIO_PERSIST_KEY = "globalAudioState";

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldAutoPlayRef = useRef(false);

  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [currentTrack, setCurrentTrack] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // start false
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);

  // Playback options
  const [shuffle, setShuffle] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem("audio:shuffle") === "true";
    } catch {
      return false;
    }
  });
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(() => {
    try {
      const v = window.localStorage.getItem("audio:repeatMode");
      return v === "all" || v === "one" ? (v as RepeatMode) : "off";
    } catch {
      return "off";
    }
  });

  // Play history to support Previous while shuffling
  const playHistoryRef = useRef<number[]>([]);

  /* ===============================
     1️⃣ Load audio list
  =============================== */
  useEffect(() => {
    const loadAudios = async () => {
      try {
        const res = await fetch("/api/audios", { cache: "no-store" });
        const data = (await res.json()) as AudioItem[];

        setAudios(data);

        if (!data.length) return;

        try {
          const saved = localStorage.getItem(AUDIO_PERSIST_KEY);

          if (saved) {
            const parsed = JSON.parse(saved);
            const foundTrack = data.find((a) => a.id === parsed.trackId);

            if (foundTrack) {
              setCurrentTrack(foundTrack);

              shouldAutoPlayRef.current = parsed.isPlaying ?? false;

              setTimeout(() => {
                const audio = audioRef.current;
                if (!audio) return;

                audio.currentTime = parsed.currentTime || 0;
                audio.muted = parsed.isMuted ?? false;
                audio.volume = parsed.volume ?? 0.7;
                setIsMuted(parsed.isMuted ?? false);
                setVolume(parsed.volume ?? 0.7);
              }, 300);

              return;
            }
            localStorage.removeItem(AUDIO_PERSIST_KEY);
            // ✅ No valid saved state → first visit
            setCurrentTrack(data[0]);
            shouldAutoPlayRef.current = true;
            // setIsMuted(false);
            setVolume(0.7);
          }

          // ✅ No saved state → first visit
          setCurrentTrack(data[0]);
          shouldAutoPlayRef.current = true;
        } catch {
          // If JSON fails, fallback safely
          setCurrentTrack(data[0]);
          shouldAutoPlayRef.current = true;
        }
      } catch (err) {
        console.error("Audio load failed:", err);
      }
    };

    loadAudios();
  }, []);

  // Track whether user has interacted
  const hasInteractedRef = useRef(false);

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

      // Only autoplay if user has already interacted
      if (hasInteractedRef.current && shouldAutoPlayRef.current) {
        audio.play().catch((err) => console.warn("Play failed:", err));
      }
    }
  }, [currentTrack]);

  /* ===============================
   🆕 One-time interaction listener to unlock audio
=============================== */
  useEffect(() => {
    const unlockAudio = () => {
      if (hasInteractedRef.current) return;
      hasInteractedRef.current = true;

      const audio = audioRef.current;

      if (audio && audio.paused && currentTrack && shouldAutoPlayRef.current) {
        audio
          .play()
          .catch((err) => console.warn("Play after interaction failed:", err));
      }

      // Clean up all listeners after first interaction
      INTERACTION_EVENTS.forEach((event) =>
        document.removeEventListener(event, unlockAudio),
      );
    };

    const INTERACTION_EVENTS = [
      "click",
      "keydown",
      "touchstart",
      "pointerdown",
    ];
    INTERACTION_EVENTS.forEach((event) =>
      document.addEventListener(event, unlockAudio, { once: true }),
    );

    return () => {
      INTERACTION_EVENTS.forEach((event) =>
        document.removeEventListener(event, unlockAudio),
      );
    };
  }, [currentTrack]); // re-registers if track changes before first interaction

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

  // Helpers for next/previous + shuffle/repeat
  const getIndexById = useCallback(
    (id?: number | null) => audios.findIndex((a) => a.id === id),
    [audios],
  );

  const nextTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audios.length) return;

    // repeat-one => restart current
    if (repeatMode === "one" && currentTrack) {
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    // add to history for previous
    if (currentTrack) {
      const last = playHistoryRef.current[playHistoryRef.current.length - 1];
      if (last !== currentTrack.id) {
        playHistoryRef.current.push(currentTrack.id);
        if (playHistoryRef.current.length > 100) playHistoryRef.current.shift();
      }
    }

    if (shuffle) {
      // pick a random index (try to avoid immediate repeat)
      if (audios.length === 1) {
        setCurrentTrack(audios[0]);
        return;
      }
      let nextIdx = Math.floor(Math.random() * audios.length);
      let attempts = 0;
      while (audios[nextIdx].id === currentTrack?.id && attempts < 5) {
        nextIdx = Math.floor(Math.random() * audios.length);
        attempts++;
      }
      setCurrentTrack(audios[nextIdx]);
      return;
    }

    const idx = getIndexById(currentTrack?.id);
    if (idx >= 0 && idx < audios.length - 1) {
      setCurrentTrack(audios[idx + 1]);
    } else {
      if (repeatMode === "all") {
        setCurrentTrack(audios[0]);
      } else {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        setIsPlaying(false);
      }
    }
  }, [audios, currentTrack, shuffle, repeatMode, getIndexById]);

  const previousTrack = useCallback(() => {
    if (!audios.length) return;

    // Prefer history (works well when shuffled)
    const hist = playHistoryRef.current;
    while (hist.length) {
      const prevId = hist.pop();
      const prev = audios.find((a) => a.id === prevId);
      if (prev) {
        setCurrentTrack(prev);
        return;
      }
    }

    const idx = getIndexById(currentTrack?.id);
    if (idx > 0) {
      setCurrentTrack(audios[idx - 1]);
    } else if (repeatMode === "all") {
      setCurrentTrack(audios[audios.length - 1]);
    } else {
      const audio = audioRef.current;
      if (audio) audio.currentTime = 0;
    }
  }, [audios, currentTrack, repeatMode, getIndexById]);

  const toggleShuffle = useCallback(() => {
    setShuffle((s) => {
      const next = !s;
      try {
        window.localStorage.setItem("audio:shuffle", String(next));
      } catch {}
      return next;
    });
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((r) => {
      const next = r === "off" ? "all" : r === "all" ? "one" : "off";
      try {
        window.localStorage.setItem("audio:repeatMode", next);
      } catch {}
      return next;
    });
  }, []);

  /* ===============================
     3️⃣ Sync React state from Audio Element
  =============================== */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      // delegate to nextTrack (handles repeat/shuffle)
      nextTrack();
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audios, currentTrack, nextTrack]);

  /* ===============================
     5️⃣ Volume & Mute Sync
  =============================== */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = isMuted;
    audio.volume = Math.max(0, Math.min(1, volume));
  }, [isMuted, volume]);

  /* ===============================
   Persist Audio State
=============================== */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const saveState = () => {
      const state = {
        trackId: currentTrack.id,
        currentTime: audio.currentTime,
        isPlaying: !audio.paused,
        isMuted,
        volume,
      };

      try {
        localStorage.setItem(AUDIO_PERSIST_KEY, JSON.stringify(state));
      } catch {}
    };

    // Save every 1 second
    const interval = setInterval(saveState, 1000);

    // Also save when page is about to unload
    window.addEventListener("beforeunload", saveState);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", saveState);
    };
  }, [currentTrack, isMuted, volume]);

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        audios,
        currentTrack,
        isPlaying,
        isMuted,
        volume,
        shuffle,
        repeatMode,
        setAudios,
        setCurrentTrack,
        togglePlay,
        nextTrack,
        previousTrack,
        toggleShuffle,
        cycleRepeatMode,
        setIsMuted,
        setVolume,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        preload="auto"
        playsInline
        style={{ display: "none" }}
      />
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
};
