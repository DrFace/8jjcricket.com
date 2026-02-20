"use client";

import Link from "next/link";
import Image from "next/image";
import { SOCIALS_LINKS } from "@/lib/constant";

export default function MobileSocialBox() {
  return (
    <div
      className="
        w-full rounded-xl
        border border-white/10
        bg-gradient-to-b from-black/80 to-black/60
        p-4
      "
    >
      {/* Icons */}
      <div className="grid grid-cols-4 gap-4 place-items-center">
        {SOCIALS_LINKS.map((s) => (
          <Link
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="
              flex h-12 w-12 items-center justify-center
              rounded-2xl
              bg-amber-950
              shadow-md
              transition
              active:scale-95
            "
          >
            <Image
              src={s.icon}
              alt={s.label}
              width={55}
              height={55}
              className="object-contain"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
