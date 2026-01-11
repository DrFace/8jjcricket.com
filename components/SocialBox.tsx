"use client";

import Link from "next/link";
import Image from "next/image";
import { SOCIALS_LINKS } from "@/lib/constant";

export default function SocialBox() {
  return (
    <div
      className="
        w-full rounded-xl h-full relative
      "
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-yellow-400" />
        <h2 className="text-sm font-semibold text-white">Follow Us</h2>
      </div>

      {/* Icons */}
      <div className="grid grid-cols-4 gap-4 place-items-center absolute bottom-3 w-full">
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
