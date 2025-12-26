// app/mobile/layout.tsx
"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MobileSidebar from "@/components/MobileSidebar";
import BottomNav from "@/components/BottomNav";
import { VolumeOff, Music2 } from "lucide-react";

export default function MoblieLayout({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const MUSIC_KEY = "musicEnabled";

  // Keep SSR + first client render stable (avoid localStorage in initializer).
  const [mounted, setMounted] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);

  // Track if the user has interacted (mobile autoplay/unmute rules).
  const [hasInteracted, setHasInteracted] = useState(false);

  // 1) Mount: mark mounted, load saved preference AFTER mount
  useEffect(() => {
    setMounted(true);

    const saved = window.localStorage.getItem(MUSIC_KEY);
    if (saved !== null) setMusicEnabled(saved === "true");
  }, []);

  // 2) Persist preference (only after mounted)
  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(MUSIC_KEY, String(musicEnabled));
  }, [musicEnabled, mounted]);

  // 3) On first interaction, if enabled, attempt to unmute and play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onFirstInteraction = async () => {
      setHasInteracted(true);

      if (musicEnabled) {
        audio.muted = false;
        try {
          await audio.play();
        } catch {
          audio.muted = true;
          audio.play().catch(() => { });
        }
      }
    };

    window.addEventListener("touchstart", onFirstInteraction, { once: true });
    window.addEventListener("click", onFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
    };
  }, [musicEnabled]);

  // 4) Keep audio in sync with preference + interaction state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!musicEnabled) {
      audio.pause();
      return;
    }

    // Enabled:
    // If user interacted, unmute; otherwise keep muted.
    audio.muted = !hasInteracted;
    audio.play().catch(() => { });
  }, [musicEnabled, hasInteracted]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextEnabled = !musicEnabled;
    setMusicEnabled(nextEnabled);

    if (!nextEnabled) {
      audio.pause();
      return;
    }

    // Turning ON: if user clicked, unmute is typically allowed
    // but on some devices it is safer to respect hasInteracted.
    audio.muted = !hasInteracted ? true : false;

    try {
      await audio.play();
      if (hasInteracted) audio.muted = false;
    } catch {
      audio.muted = true;
      audio.play().catch(() => { });
    }
  };

  return (
    <div className="min-h-screen w-screen max-w-none overflow-x-hidden bg-black text-white">
      {/* Hidden audio player */}
      <audio
        ref={audioRef}
        src="/music/lastchristmas.mp3"
        loop
        preload="auto"
        playsInline
        muted
      />

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
            {/* Avoid hydration mismatch: don't swap lucide SVGs until mounted */}
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
