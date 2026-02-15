// app/mobile/layout.tsx
"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MobileSidebar from "@/components/MobileSidebar";
import BottomNav from "@/components/BottomNav";
import { VolumeOff, Music2, X } from "lucide-react";
import { ApiBase, URLNormalize } from "@/lib/utils";
import Script from "next/script";

type AudioItem = {
  id: number;
  title: string;
  file_path: string;
};

export default function MoblieLayout({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioData, setAudioData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const MUSIC_KEY = "musicEnabled";

  // NEW: multiple songs + volume + popup
  const MUSIC_VOLUME_KEY = "musicVolume";
  const MUSIC_SELECTED_ID_KEY = "musicSelectedAudioId";
  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [volume, setVolume] = useState<number>(0.7);
  const [musicPopupOpen, setMusicPopupOpen] = useState(false);

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

        const res = await fetch(`/api/audios`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`Failed to load audio: ${res.status}`);

        const data = (await res.json()) as AudioItem[];
        const list = Array.isArray(data) ? data : [];
        setAudios(list);

        // Load saved preference
        const saved = window.localStorage.getItem(MUSIC_KEY);
        const isEnabled = saved === null ? true : saved === "true";
        setMusicEnabled(isEnabled);

        // Load saved volume
        const savedVol = window.localStorage.getItem(MUSIC_VOLUME_KEY);
        const vol = savedVol ? Number(savedVol) : 0.7;
        const safeVol =
          Number.isFinite(vol) ? Math.max(0, Math.min(1, vol)) : 0.7;
        setVolume(safeVol);

        if (list.length > 0) {
          // Load saved selected song
          const savedId = window.localStorage.getItem(MUSIC_SELECTED_ID_KEY);
          const parsedId = savedId ? Number(savedId) : NaN;
          const initialId =
            Number.isFinite(parsedId) && list.some((x) => x.id === parsedId)
              ? parsedId
              : list[0].id;

          setSelectedId(initialId);

          const selected = list.find((x) => x.id === initialId) || list[0];
          setAudioData(selected);

          if (audioRef.current) {
            const audio = audioRef.current;
            audio.src = URLNormalize(selected.file_path, "audios");

            // IMPORTANT: disable loop so "ended" fires and we can go next
            audio.loop = false;

            audio.volume = safeVol;

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

            // Apply enabled state
            audio.muted = !isEnabled;
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

  // NEW: persist volume
  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(MUSIC_VOLUME_KEY, String(volume));
    const audio = audioRef.current;
    if (audio) audio.volume = Math.max(0, Math.min(1, volume));
  }, [volume, mounted]);

  // NEW: persist selected song id
  useEffect(() => {
    if (!mounted) return;
    if (selectedId == null) return;
    window.localStorage.setItem(MUSIC_SELECTED_ID_KEY, String(selectedId));
  }, [selectedId, mounted]);

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

  // NEW: select song
  const applySelectedSong = async (id: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    setSelectedId(id);

    const selected = audios.find((x) => x.id === id);
    if (!selected) return;

    setAudioData(selected);

    audio.src = URLNormalize(selected.file_path, "audios");

    // IMPORTANT: disable loop so "ended" fires and we can go next
    audio.loop = false;

    audio.volume = Math.max(0, Math.min(1, volume));

    setAudioReady(false);
    audio.load();
    audio.addEventListener(
      "canplaythrough",
      () => {
        setAudioReady(true);
      },
      { once: true },
    );

    // keep same enabled behavior
    if (!musicEnabled) {
      audio.pause();
      audio.muted = true;
      return;
    }

    // attempt play respecting autoplay rules
    if (!hasInteracted) {
      audio.muted = true;
      audio.play().catch(() => {});
      return;
    }

    audio.muted = false;
    try {
      await audio.play();
    } catch {
      audio.muted = true;
      audio.play().catch(() => {});
    }
  };

  // NEW: autoplay next song when current ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (!audios || audios.length === 0) return;

      const currentIndex =
        selectedId == null ? 0 : audios.findIndex((x) => x.id === selectedId);

      const safeIndex = currentIndex >= 0 ? currentIndex : 0;
      const nextIndex = (safeIndex + 1) % audios.length;
      const next = audios[nextIndex];
      if (!next) return;

      // move to next track
      applySelectedSong(next.id).catch(() => {});
    };

    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("ended", onEnded);
    };
  }, [audios, selectedId, musicEnabled, hasInteracted, volume]);

  // NEW: popup close on ESC
  useEffect(() => {
    if (!musicPopupOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMusicPopupOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [musicPopupOpen]);

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

          {/* RIGHT: Music toggle button (opens popup) */}
          <button
            type="button"
            onClick={() => {
              // counts as interaction
              if (!hasInteracted) setHasInteracted(true);
              setMusicPopupOpen(true);
            }}
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

      {/* NEW: Music Popup */}
      {musicPopupOpen ? (
        <div className="fixed inset-0 z-[200]">
          <button
            className="absolute inset-0 bg-black/70"
            aria-label="Close music popup"
            onClick={() => setMusicPopupOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-black/90 p-4 text-white shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Music Settings</div>
              <button
                onClick={() => setMusicPopupOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 active:scale-95"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                onClick={toggleMusic}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10 active:scale-95"
                aria-pressed={musicEnabled}
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
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full"
                  aria-label="Volume"
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
                            onClick={() => applySelectedSong(a.id)}
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
      ) : null}

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
      {/* Google Translate */}
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'hi,bn,ur,pa,ta,te,en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              }, 'google_translate_element');
            }
          `}
      </Script>
    </div>
  );
}
