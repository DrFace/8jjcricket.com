// app/mobile/layout.tsx
"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MobileSidebar from "@/components/MobileSidebar";
import BottomNav from "@/components/BottomNav";
import { VolumeOff, Music2 } from "lucide-react";
import { ApiBase, URLNormalize } from "@/lib/utils";
import { GetGlobalAudio } from "@/lib/audio";

export default function MoblieLayout({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioData, setAudioData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const MUSIC_KEY = "musicEnabled";

  // 1) Mount and load audio data
  useEffect(() => {
    setMounted(true);

    const loadAudio = async () => {
      try {
        const apiBase = ApiBase().replace(/\/+$/, "");
        const res = await fetch(`${apiBase}/audios`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`Failed to load audio: ${res.status}`);

        const data = await res.json();

        if (data && data.length > 0) {
          setAudioData(data[0]);

          if (audioRef.current) {
            const audio = audioRef.current;
            audio.src = URLNormalize(data[0].file_path, "audios");
            audio.loop = true;

            // Load the audio
            audio.load();

            // Wait for audio to be ready
            audio.addEventListener(
              "canplaythrough",
              () => {
                setAudioReady(true);
              },
              { once: true }
            );

            // Load saved preference
            const saved = window.localStorage.getItem(MUSIC_KEY);
            const isEnabled = saved === null ? true : saved === "true";
            setMusicEnabled(isEnabled);
          }
        }
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    loadAudio();
  }, []);

  // 2) Persist preference
  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(MUSIC_KEY, String(musicEnabled));
  }, [musicEnabled, mounted]);

  // 3) Set up interaction listener
  useEffect(() => {
    const onFirstInteraction = () => {
      setHasInteracted(true);
    };

    // Listen for any user interaction
    const events = ["touchstart", "click", "keydown"];
    events.forEach((event) => {
      window.addEventListener(event, onFirstInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, onFirstInteraction);
      });
    };
  }, []);

  // 4) Handle audio playback when conditions change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioReady) return;

    const attemptPlay = async () => {
      if (!musicEnabled) {
        audio.pause();
        audio.muted = true;
        return;
      }

      // Music is enabled
      if (hasInteracted) {
        // User has interacted - safe to unmute and play
        audio.muted = false;
        try {
          await audio.play();
        } catch (err) {
          console.log("Playback failed:", err);
          // Fallback: try muted
          audio.muted = true;
          audio.play().catch(() => {});
        }
      } else {
        // No interaction yet - try to play muted
        audio.muted = true;
        audio.play().catch(() => {
          // Autoplay blocked - will play after interaction
        });
      }
    };

    attemptPlay();
  }, [musicEnabled, hasInteracted, audioReady]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio || !audioReady) return;

    const nextEnabled = !musicEnabled;
    setMusicEnabled(nextEnabled);

    // This click counts as an interaction
    if (!hasInteracted) {
      setHasInteracted(true);
    }

    if (!nextEnabled) {
      audio.pause();
      audio.muted = true;
    } else {
      // Turning on - unmute and play
      audio.muted = false;
      try {
        await audio.play();
      } catch (err) {
        console.log("Toggle play failed:", err);
        // Try muted as fallback
        audio.muted = true;
        audio.play().catch(() => {});
      }
    }
  };

  return (
    <div className="min-h-screen w-screen max-w-none overflow-x-hidden bg-black text-white">
      {/* Hidden audio player */}
      <audio ref={audioRef} loop preload="auto" playsInline />

      {/* TOP NAV BAR (GLOBAL) */}
      <header className="sticky top-0 z-[70] w-full border-b border-white/10 bg-black">
        <div className="flex items-center justify-between px-3 py-2">
          {/* LEFT: Hamburger + Logo + Brand */}
          <div className="flex items-center gap-3">
            <MobileSidebar />

            <Link
              href="/mobile"
              className="flex items-center gap-2 relative active:scale-95"
              aria-label="Go to Home"
            >
              {/* Logo */}
              <div className="relative">
                <img
                  src="/8jjlogo.png"
                  alt="8JJCRICKET"
                  className="relative z-10 h-9 w-9 object-contain"
                />

                {/* Glow underneath */}
                <span
                  aria-hidden
                  className="
                    pointer-events-none
                    absolute inset-x-0 -bottom-1
                    mx-auto
                    h-2 w-10
                    rounded-full
                    bg-cyan-400/60
                    blur-lg
                    opacity-70
                  "
                />
              </div>

              {/* Brand text */}
              <span className="text-sm font-semibold tracking-tight text-white">
                8JJCRICKET
              </span>
            </Link>
          </div>

          {/* RIGHT: Music toggle button */}
          <button
            type="button"
            onClick={toggleMusic}
            className="
              inline-flex items-center justify-center
              h-8 w-8
              rounded-full
              border border-white/15
              bg-white/5
              text-sm font-semibold text-white
              hover:bg-white/10
              active:scale-95
            "
            aria-label="Toggle music"
            aria-pressed={musicEnabled}
          >
            {!mounted ? (
              <span className="inline-block h-[16px] w-[16px]" />
            ) : musicEnabled ? (
              <Music2 size={16} />
            ) : (
              <VolumeOff size={16} />
            )}
          </button>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main
        className="
          h-[calc(100vh-56px)]
          w-full max-w-none
          overflow-y-auto overflow-x-hidden
          px-3 pt-3 pb-24
          [scrollbar-width:none] [-ms-overflow-style:none]
        "
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </main>
      {/* BOTTOM NAV (GLOBAL) */}
      <BottomNav />
    </div>
  );
}
