// app/mobile/layout.tsx
"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MobileSidebar from "@/components/MobileSidebar";
import BottomNav from "@/components/BottomNav";
import { VolumeOff, Music2 } from "lucide-react";
import { ApiBase, URLNormalize } from "@/lib/utils";

export default function MoblieLayout({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioData, setAudioData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const MUSIC_KEY = "musicEnabled";

  // Check if a cookie exists on page load, otherwise default to "en"
  const [lang, setLang] = useState<string>(() => {
    if (typeof document !== "undefined") {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; googtrans=`);
      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(";")[0]; // e.g., "/en/hi"
        const code = cookieValue?.split("/").pop(); // e.g., "hi"
        return code || "en";
      }
    }
    return "en";
  });

  // 1) Mount and load audio data
  useEffect(() => {
    setMounted(true);

    const loadAudio = async () => {
      try {
        const apiBase = ApiBase().replace(/\/+$/, "");

        const res = await fetch(`api/audios`, {
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
              { once: true },
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

  // Helper function to clear ALL googtrans cookies across all domains and paths
  const clearAllGoogTransCookies = () => {
    const hostname = window.location.hostname;
    const domainVariants = [
      "", // No domain (current path only)
      `domain=${hostname}`,
      `domain=.${hostname}`,
      `domain=${hostname.replace("www.", "")}`,
      `domain=.${hostname.replace("www.", "")}`,
    ];

    const pathVariants = ["path=/", "path=/minigames", ""];

    // Clear cookies with all possible domain and path combinations
    domainVariants.forEach((domain) => {
      pathVariants.forEach((path) => {
        const attributes = [
          "expires=Thu, 01 Jan 1970 00:00:00 GMT",
          path,
          domain,
        ]
          .filter(Boolean)
          .join("; ");

        document.cookie = `googtrans=; ${attributes}`;
      });
    });
  };

  const handleLanguageChange = (selectedLang: string) => {
    console.log("Selected Value from Dropdown:", selectedLang);

    if (selectedLang === "en" || selectedLang === "eng") {
      console.log(
        "LOG: Switching to English - Clearing ALL translation cookies",
      );

      // Clear ALL possible googtrans cookies
      clearAllGoogTransCookies();

      // Wait a bit to ensure cookies are cleared
      setTimeout(() => {
        setLang("en");

        // Double-check and force reload
        setTimeout(() => {
          window.location.reload();
        }, 50);
      }, 50);
    } else {
      console.log("LOG: Switching to Language:", selectedLang);

      // First clear all existing cookies to avoid conflicts
      clearAllGoogTransCookies();

      setTimeout(() => {
        const targetValue = `/en/${selectedLang}`;
        const hostname = window.location.hostname;

        // Set new language cookie with multiple domain variants to ensure it works
        document.cookie = `googtrans=${targetValue}; path=/;`;
        document.cookie = `googtrans=${targetValue}; path=/; domain=${hostname}`;
        document.cookie = `googtrans=${targetValue}; path=/; domain=.${hostname}`;

        setLang(selectedLang);

        setTimeout(() => {
          window.location.reload();
        }, 100);
      }, 50);
    }
  };

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
      } catch {
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

          <div className="ml-5 inline-flex h-9 items-center justify-center rounded-full border border-white/15 bg-white/5 px-3 text-sm font-semibold text-white hover:bg-white/10">
            <select
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="h-9 bg-transparent text-white outline-none [&>option]:text-black"
              aria-label="Google Translate language"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
              <option value="ur">Urdu</option>
              <option value="pa">Punjabi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
            </select>
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
