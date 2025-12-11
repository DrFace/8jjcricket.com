"use client";

import Link from "next/link";
import Image from "next/image";

const socials = [
    {
        label: "Instagram",
        url: "https://www.instagram.com/8jj_cricket/",
        icon: "/instagram.png",
    },
    {
        label: "Facebook",
        url: "https://www.facebook.com/profile.php?id=61584089624639",
        icon: "/facebook.png",
    },
    {
        label: "Telegram",
        url: "https://t.me/Official8JJ_cricket",
        icon: "/telegram.png",
    },
    {
        label: "X (Twitter)",
        url: "https://x.com/8jjCricket73705",
        icon: "/x.png",
    },
];

export default function SocialBox() {
    return (
        <div
            className="
                rounded-xl border bg-white p-4 shadow-sm
                flex flex-col
            "
        >
            <h2 className="text-xs font-semibold tracking-wide text-gray-500">
                FOLLOW US
            </h2>

            {/* 2 x 2 grid, always stays inside the card */}
            <div className="mt-4 grid grid-cols-2 gap-4 place-items-center">
                {socials.map((s) => (
                    <Link
                        key={s.url}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            flex items-center justify-center
                            h-14 w-14 rounded-full border
                            hover:bg-gray-50 transition
                        "
                    >
                        <Image
                            src={s.icon}
                            alt={s.label}
                            width={24}
                            height={24}
                            className="object-contain"
                        />
                        <span className="sr-only">{s.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
