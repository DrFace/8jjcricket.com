// components/TopNav.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import NewsTicker from "@/components/NewsTicker";
import { Megaphone, Zap, VolumeOff, Music2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// --------- GLOBAL AUDIO SINGLETON (persists across route changes) ----------
let globalAudio: HTMLAudioElement | null = null;

function getGlobalAudio() {
    if (typeof window === "undefined") return null;

    if (!globalAudio) {
        globalAudio = new Audio("/music/lastchristmas.mp3");
        globalAudio.loop = true;
        globalAudio.preload = "auto";
        // Start muted initially to comply with autoplay policies
        globalAudio.muted = true;
    }
    return globalAudio;
}
// -------------------------------------------------------------------------

export default function TopNav() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [hasStarted, setHasStarted] = useState(false);

    // Bind ref to the global audio once on mount
    useEffect(() => {
        const audio = getGlobalAudio();
        if (!audio) return;
        audioRef.current = audio;

        // Attempt muted autoplay on mount (won't recreate audio on navigation)
        audio.muted = true;

        if (musicEnabled) {
            audio
                .play()
                .then(() => setHasStarted(true))
                .catch(() => {
                    // Autoplay may be blocked until user interaction
                });
        } else {
            audio.pause();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once

    // Start on first interaction (tap/click) if needed
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const startOnFirstInteraction = () => {
            if (musicEnabled) {
                audio.muted = false;
                audio
                    .play()
                    .then(() => setHasStarted(true))
                    .catch(() => { });
            }
        };

        window.addEventListener("touchstart", startOnFirstInteraction, { once: true });
        window.addEventListener("click", startOnFirstInteraction, { once: true });

        return () => {
            window.removeEventListener("touchstart", startOnFirstInteraction);
            window.removeEventListener("click", startOnFirstInteraction);
        };
    }, [musicEnabled]);

    // Keep audio in sync with state
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!musicEnabled) {
            audio.pause();
            return;
        }

        if (hasStarted) {
            audio.muted = false;
            audio.play().catch(() => { });
        } else {
            audio.muted = true;
            audio.play().catch(() => { });
        }
    }, [musicEnabled, hasStarted]);

    const toggleMusic = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        setMusicEnabled((prev) => !prev);

        // Apply immediately for responsiveness
        if (!musicEnabled) {
            // Turning ON
            audio.muted = false;
            try {
                await audio.play();
                setHasStarted(true);
            } catch {
                audio.muted = true;
                audio.play().catch(() => { });
            }
        } else {
            // Turning OFF
            audio.pause();
        }
    };

    return (
        <>
            {/* NOTE: no <audio> element here to avoid recreation on route changes */}

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

            {/* sticky works inside the same scroll container */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl shadow-lg">
                <div className="flex w-full items-center justify-between px-4 py-2">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
                        <Image src="/8jjlogo.png" alt="8jjcricket logo" width={44} height={44} priority />
                        <span>8jjcricket</span>
                    </Link>

                    <nav className="hidden gap-6 text-[15px] font-semibold text-sky-100/90 md:flex">
                        <Link href="/" className="hover:text-amber-300">Home</Link>
                        <Link href="/livescore" className="hover:text-amber-300">Live Score</Link>
                        <Link href="/archive" className="hover:text-amber-300">Archive</Link>
                        <Link href="/series" className="hover:text-amber-300">Series</Link>
                        <Link href="/players" className="hover:text-amber-300">Players</Link>
                        <Link href="/minigames" className="hover:text-amber-300">Minigames</Link>
                        <Link href="/news" className="hover:text-amber-300">News</Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        {/* Music toggle button (left of Play Now) */}
                        <button
                            type="button"
                            onClick={toggleMusic}
                            className="
                inline-flex items-center justify-center
                h-9 w-9
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
                            {musicEnabled ? <Music2 size={18} /> : <VolumeOff size={18} />}
                        </button>

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
