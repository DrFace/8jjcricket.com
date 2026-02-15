// components/TopNav.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import NewsTicker from "@/components/NewsTicker";
import { Megaphone, VolumeOff, Music2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ApiBase } from "@/lib/utils";
import { GetGlobalAudio } from "@/lib/audio";

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "relative px-1 py-1 transition-colors",
        active ? "text-amber-300" : "text-sky-100/90 hover:text-amber-300",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
      <span
        className={[
          "pointer-events-none absolute left-0 right-0 -bottom-1 h-[2px] rounded-full transition-opacity",
          active ? "opacity-100 bg-amber-300" : "opacity-0 bg-amber-300",
        ].join(" ")}
      />
    </Link>
  );
}

export default function TopNav() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const MUSIC_KEY = "musicEnabled";

  const [mounted, setMounted] = useState(false);
  const [audioData, setAudioData] = useState<any>(null);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

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

  useEffect(() => {
    setMounted(true);

    const loadAudio: () => Promise<void> = async () => {
      try {
        const apiBase = ApiBase();
        const res = await fetch(`/api/audios`);
        const data = await res.json();

        if (data && data.length > 0) {
          setAudioData(data[0]);

          const audio = GetGlobalAudio(data[0]);

          if (audio) {
            audioRef.current = audio;
            audio.loop = true;
            audio.preload = "auto";

            const saved = window.localStorage.getItem(MUSIC_KEY);
            const isEnabled = saved === null ? true : saved === "true";

            setMusicEnabled(isEnabled);
            audio.muted = !isEnabled;
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadAudio();
  }, []);

  useEffect(() => {
    setMounted(true);

    const audio = GetGlobalAudio();
    if (!audio) return;
    audioRef.current = audio;

    audio.loop = true;
    audio.preload = "auto";
    audio.muted = true;

    const saved = window.localStorage.getItem(MUSIC_KEY);
    if (saved !== null) setMusicEnabled(saved === "true");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(MUSIC_KEY, String(musicEnabled));
  }, [musicEnabled, mounted]);

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
          audio.play().catch(() => {});
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!musicEnabled) {
      audio.pause();
      return;
    }

    if (hasInteracted) {
      audio.muted = false;
      audio.play().catch(() => {});
    } else {
      audio.muted = true;
      audio.play().catch(() => {});
    }
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

    audio.muted = !hasInteracted;

    try {
      await audio.play();
      if (hasInteracted) audio.muted = false;
    } catch {
      audio.muted = true;
      audio.play().catch(() => {});
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <div className="w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="flex w-full items-center gap-4 px-4 py-2 text-sm text-sky-100">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <NewsTicker />
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl shadow-lg">
        <div className="flex w-full items-center justify-between px-2 lg:px-4 py-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg lg:text-xl font-bold text-white shrink-0"
          >
            <Image
              src="/8jjlogo.png"
              alt="8jjcricket logo"
              width={44}
              height={44}
              priority
            />
            <span>8jjcricket</span>
          </Link>

          <nav className="hidden gap-3 lg:gap-5 xl:gap-8 text-[13px] lg:text-[14px] xl:text-[15px] font-semibold md:flex whitespace-nowrap">
            <NavItem href="/" label="Home" active={isActive("/")} />
            <NavItem
              href="/livescore"
              label="Live Score"
              active={isActive("/livescore")}
            />
            <NavItem
              href="/archive"
              label="Archive"
              active={isActive("/archive")}
            />
            <NavItem
              href="/series"
              label="Series"
              active={isActive("/series")}
            />
            <NavItem
              href="/rankings/t20i"
              label="Team Rankings"
              active={isActive("/rankings/t20i")}
            />
            <NavItem
              href="/players"
              label="Players"
              active={isActive("/players")}
            />
            <NavItem
              href="/minigames"
              label="Mini Games"
              active={isActive("/minigames")}
            />
            <NavItem href="/news" label="News" active={isActive("/news")} />
            <NavItem
              href="/gallery"
              label="Gallery"
              active={isActive("/gallery")}
            />
          </nav>

          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 items-center justify-center rounded-full border border-white/15 bg-white/5 px-3 text-sm font-semibold text-white hover:bg-white/10">
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

            {audioData && (
              <button
                type="button"
                onClick={toggleMusic}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-white hover:bg-white/10 active:scale-95"
                aria-label="Toggle music"
                aria-pressed={musicEnabled}
              >
                {!mounted ? (
                  <span className="inline-block h-[18px] w-[18px]" />
                ) : musicEnabled ? (
                  <Music2 size={18} />
                ) : (
                  <VolumeOff size={18} />
                )}
              </button>
            )}

            <Link
              href="/minigames"
              className="rounded-full bg-gradient-to-r from-[#FACC15] via-[#F97316] to-[#EA580C] px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-amber-500/40 ring-1 ring-white/20 hover:brightness-110 active:scale-95"
            >
              Play Now
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
