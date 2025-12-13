"use client";

import { useEffect, useState } from "react";
import Image from "next/image";


export default function WelcomePopup() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Show on every visit / refresh
        setOpen(true);
    }, []);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-slate-950/90 shadow-2xl">

                {/* ❌ Close Button */}
                <button
                    onClick={() => setOpen(false)}
                    aria-label="Close popup"
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-500/80"
                >
                    ✕
                </button>

                {/* Banner Image */}
                <div className="relative aspect-[16/9] w-full">
                    <Image
                        src="/banner002.png"
                        alt="Welcome banner"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="p-4 text-center">
                    <h3 className="text-lg font-extrabold text-white">
                        Welcome to 8jj
                    </h3>

                    <button
                        onClick={() => setOpen(false)}
                        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black shadow-lg hover:brightness-110 active:scale-95"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
