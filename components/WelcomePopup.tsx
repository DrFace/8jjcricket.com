"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import IconButton from "./ui/IconButton";
import PrimaryButton from "./ui/PrimaryButton";
import { X } from "lucide-react";


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
                <IconButton
                    onClick={() => setOpen(false)}
                    ariaLabel="Close popup"
                    className="absolute right-3 top-3 z-10 hover:bg-red-500/80"
                    size="sm"
                    icon={<X size={16} />}
                />

                {/* Banner Image */}
                <div className="relative aspect-[16/9] w-full">
                    <Image
                        src="/banner004.jpeg"
                        alt="Welcome banner"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="p-4 text-center">
                    <h3 className="text-lg font-extrabold text-white">
                        Welcome to 8JJCRICKET
                    </h3>

                    <PrimaryButton
                        onClick={() => setOpen(false)}
                        className="mt-4 w-full uppercase tracking-wide text-xs h-10"
                    >
                        Continue
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
}
