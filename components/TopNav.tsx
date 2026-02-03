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

  const [lang, setLang] = useState("en");

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

  useEffect(() => {
    if (!mounted) return;
    if (lang === "en") return;
    const url = `https://translate.google.com/translate?sl=auto&tl=${encodeURIComponent(
      lang,
    )}&u=${encodeURIComponent(window.location.href)}`;
    window.location.href = url;
  }, [lang, mounted]);

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
        <div className="flex w-full items-center justify-between px-4 py-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-white"
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

          <nav className="hidden gap-6 text-[15px] font-semibold md:flex">
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
              {/* <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="h-9 bg-transparent text-white outline-none [&>option]:text-black"
                aria-label="Google Translate language"
              >
                <option value="hi">Hindi</option>
                <option value="bn">Bengali</option>
                <option value="ur">Urdu</option>
                <option value="pa">Punjabi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="en">English</option>
              </select> */}
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
