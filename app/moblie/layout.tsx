// app/moblie/layout.tsx
"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MobileSidebar from "@/components/MobileSidebar";
import BottomNav from "@/components/BottomNav";
import { VolumeOff, Music2 } from "lucide-react";

export default function MoblieLayout({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // User preference: whether music should be playing
  const [musicEnabled, setMusicEnabled] = useState(true);

  // Tracks whether we have successfully started playback at least once
  // (useful for iOS/mobile autoplay restrictions)
  const [hasStarted, setHasStarted] = useState(false);

  // 1) Attempt to start audio as early as possible (muted autoplay is allowed)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Start muted to satisfy autoplay policies
    audio.muted = true;

    // If user preference is enabled, try to start immediately (muted)
    if (musicEnabled) {
      audio
        .play()
        .then(() => setHasStarted(true))
        .catch(() => {
          // Autoplay with sound is blocked; muted play usually works,
          // but if it still fails, we'll start on first interaction.
        });
    } else {
      audio.pause();
    }
  }, []); // run once on mount

  // 2) If autoplay fails, start on first user interaction (tap/click) and unmute if enabled
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const startOnFirstInteraction = () => {
      // If user wants music, try to play and unmute
      if (musicEnabled) {
        audio.muted = false;
        audio
          .play()
          .then(() => setHasStarted(true))
          .catch(() => {
            // If still blocked, user can use the button; usually this won't happen.
          });
      }
    };

    window.addEventListener("touchstart", startOnFirstInteraction, {
      once: true,
    });
    window.addEventListener("click", startOnFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("touchstart", startOnFirstInteraction);
      window.removeEventListener("click", startOnFirstInteraction);
    };
  }, [musicEnabled]);

  // 3) Keep audio in sync with musicEnabled changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!musicEnabled) {
      audio.pause();
      return;
    }

    // If enabled, attempt to play.
    // If we already started once, we can keep it unmuted.
    // If not started yet, start muted (safer) and then unmute after interaction.
    if (hasStarted) {
      audio.muted = false;
      audio.play().catch(() => {});
    } else {
      audio.muted = true;
      audio.play().catch(() => {});
    }
  }, [musicEnabled, hasStarted]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setMusicEnabled((prev) => !prev);

    // Apply immediately for better responsiveness
    if (!musicEnabled) {
      // Turning ON
      audio.muted = false; // user clicked, so unmute is allowed
      try {
        await audio.play();
        setHasStarted(true);
      } catch {
        // If blocked (rare after click), fallback to muted play
        audio.muted = true;
        audio.play().catch(() => {});
      }
    } else {
      // Turning OFF
      audio.pause();
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
              href="/moblie"
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
            {musicEnabled ? <Music2 size={16} /> : <VolumeOff size={16} />}
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
