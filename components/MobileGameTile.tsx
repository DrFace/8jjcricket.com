// components/MobileGameTile.tsx
"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = {
    href: string;
    title: string;
    icon: string;
};

export default function MobileGameTile({ href, title, icon }: Props) {
    const router = useRouter();

    return (
        <button
            type="button"
            // pointerup is more reliable than click on mobile inside scroll containers
            onPointerUp={() => router.push(href)}
            className="flex flex-col items-center transition active:scale-95 touch-manipulation"
            aria-label={title}
        >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
                <img
                    src={icon}
                    alt={title}
                    className="h-9 w-9 object-contain"
                    loading="lazy"
                    draggable={false}
                />
            </div>
        </button>
    );
}
