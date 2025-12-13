"use client";

import Link from "next/link";
import Image from "next/image";

const socials = [
    { label: "Instagram", url: "https://www.instagram.com/8jj_cricket/", icon: "/instagram.png" },
    { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61584089624639", icon: "/facebook.png" },
    { label: "Telegram", url: "https://t.me/Official8JJ_cricket", icon: "/telegram.png" },
    { label: "X", url: "https://x.com/8jjCricket73705", icon: "/x.png" },
];

export default function SocialBox() {
    return (
        <div
            className="
        w-full rounded-xl
        border border-white/10
        bg-gradient-to-b from-black/80 to-black/60
        p-4
      "
        >
            {/* Header */}
            <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                <h2 className="text-sm font-semibold text-white">Follow Us</h2>
            </div>

            {/* Icons */}
            <div className="grid grid-cols-4 gap-4 place-items-center">
                {socials.map((s) => (
                    <Link
                        key={s.url}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="
              flex h-12 w-12 items-center justify-center
              rounded-2xl
              bg-white
              shadow-md
              transition
              active:scale-95
            "
                    >
                        <Image
                            src={s.icon}
                            alt={s.label}
                            width={22}
                            height={22}
                            className="object-contain"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
