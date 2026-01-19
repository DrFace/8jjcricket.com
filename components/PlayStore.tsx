"use client";

import Link from "next/link";
import Image from "next/image";
import { GOOGLE_PLAY_STORE, SOCIALS_LINKS } from "@/lib/constant";

export default function PlayStore() {
  return (
    <div
      className="
        w-full rounded-xl h-full relative
      "
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-yellow-400" />
        <h2 className="text-sm font-semibold text-white">Download</h2>
      </div>

      {/* Icons */}
      <div className="grid grid-cols-2 gap-8 place-items-center absolute bottom-3 w-full">
        {GOOGLE_PLAY_STORE.map((store, i) => (
          <Link
            key={i}
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={store.alt}
            className="
              flex items-center justify-center
              rounded-2xl
              shadow-md
              transition
              active:scale-95
            "
          >
            <Image
              src={store.img}
              alt={store.alt}
              width={100}
              height={55}
              className="object-contain"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
