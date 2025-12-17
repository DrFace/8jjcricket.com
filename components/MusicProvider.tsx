"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type MusicContextValue = {
    musicEnabled: boolean;
    toggleMusic: () => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({
    children,
    src = "/music/lastchristmas.mp3",
}: {
    children: React.ReactNode;
    src?: string;
}) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [hasStarted, setHasStarted] = useState(false);

    // Create audio once (provider stays mounted across route changes if placed in layout)
    useEffect(() => {
        const audio = new Audio(src);
        audio.loop = true;
        audio.preload = "auto";
        // iOS/Safari friendliness
        // @ts-ignore
        audio.playsInline = true;

        audio.muted = true; // allow autoplay attempt
        audioRef.current = audio;

        // Attempt muted autoplay
        if (musicEnabled) {
            audio.play().then(() => setHasStarted(true)).catch(() => { });
        }

        return () => {
            audio.pause();
            audioRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    // Start on first user interaction if needed
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const startOnFirstInteraction = () => {
            if (musicEnabled) {
                audio.muted = false;
                audio.play().then(() => setHasStarted(true)).catch(() => { });
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
        <MusicContext.Provider value={{ musicEnabled, toggleMusic }}>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    const ctx = useContext(MusicContext);
    if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
    return ctx;
}
