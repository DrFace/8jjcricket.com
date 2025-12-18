// components/TopNav.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import NewsTicker from "@/components/NewsTicker";
import { Megaphone, VolumeOff, Music2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

let globalAudio: HTMLAudioElement | null = null;

function getGlobalAudio() {
    if (typeof window === "undefined") return null;

    if (!globalAudio) {
        globalAudio = new Audio("/music/lastchristmas.mp3");
        globalAudio.loop = true;
        globalAudio.preload = "auto";
        globalAudio.muted = true;
    }
    return globalAudio;
}

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

            {/* underline indicator */}
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
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const audio = getGlobalAudio();
        if (!audio) return;
        audioRef.current = audio;

        audio.muted = true;

        if (musicEnabled) {
            audio
                .play()
                .then(() => setHasStarted(true))
                .catch(() => { });
        } else {
            audio.pause();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

        if (!musicEnabled) {
            audio.muted = false;
            try {
                await audio.play();
                setHasStarted(true);
            } catch {
                audio.muted = true;
                audio.play().catch(() => { });
            }
        } else {
            audio.pause();
        }
    };

    // helper: exact match
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
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
                        <Image src="/8jjlogo.png" alt="8jjcricket logo" width={44} height={44} priority />
                        <span>8jjcricket</span>
                    </Link>

                    <nav className="hidden gap-6 text-[15px] font-semibold md:flex">
                        <NavItem href="/" label="Home" active={isActive("/")} />
                        <NavItem href="/livescore" label="Live Score" active={isActive("/livescore")} />
                        <NavItem href="/archive" label="Archive" active={isActive("/archive")} />
                        <NavItem href="/series" label="Series" active={isActive("/series")} />
                        <NavItem href="/players" label="Players" active={isActive("/players")} />
                        <NavItem href="/minigames" label="Minigames" active={isActive("/minigames")} />
                        <NavItem href="/news" label="News" active={isActive("/news")} />
                    </nav>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={toggleMusic}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-white hover:bg-white/10 active:scale-95"
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
