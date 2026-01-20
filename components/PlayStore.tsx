"use client";

import Link from "next/link";
import Image from "next/image";
import { GOOGLE_PLAY_STORE } from "@/lib/constant";

export default function PlayStore() {
  return (
    <div
      className="
        relative h-full w-full overflow-hidden rounded-2xl
        border border-white/10
        bg-gradient-to-br from-slate-950/70 via-slate-900/45 to-amber-950/20
        shadow-[0_20px_60px_rgba(0,0,0,0.55)]
        backdrop-blur-2xl
      "
    >
      {/* Soft accent glows */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -top-20 -left-16 h-56 w-56 rounded-full
          bg-amber-400/10 blur-3xl
        "
      />
      <div
        aria-hidden
        className="
          pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full
          bg-cyan-400/10 blur-3xl
        "
      />

      <div className="flex h-full flex-col p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Brand logo (repo already uses /8jjlogo.png) */}
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-0 rounded-xl bg-amber-400/20 blur-md"
              />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/30">
                <Image
                  src="/8jjlogo.png"
                  alt="8jjcricket logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <h2 className="text-sm font-semibold text-white">Download</h2>
              </div>
              <p className="mt-1 text-xs text-white/70">
                Get the official 8jjcricket app on Google Play
              </p>
            </div>
          </div>

          {/* Optional “badge” */}
          <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-200">
            Android
          </span>
        </div>

        {/* Content */}
        <div className="mt-5 flex flex-1 flex-col justify-end">
          <div
            className="
              grid gap-3
              sm:grid-cols-2
            "
          >
            {GOOGLE_PLAY_STORE.map((store, i) => (
              <Link
                key={i}
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={store.alt}
                className="
                  group relative flex items-center justify-center
                  rounded-2xl border border-white/10
                  bg-black/25 p-4
                  shadow-lg shadow-black/30
                  transition
                  hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-black/35
                  active:translate-y-0 active:scale-[0.99]
                "
              >
                {/* Hover glow */}
                <span
                  aria-hidden
                  className="
                    pointer-events-none absolute inset-0 rounded-2xl
                    bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-orange-500/0
                    opacity-0 transition-opacity group-hover:opacity-100
                  "
                />
                <Image
                  src={store.img}
                  alt={store.alt}
                  width={140}
                  height={56}
                  className="relative object-contain"
                />
              </Link>
            ))}
          </div>

          {/* Fine print */}
          <p className="mt-4 text-[11px] leading-relaxed text-white/55">
            By downloading, you agree to our terms and policies. Play
            responsibly.
          </p>
        </div>
      </div>
    </div>
  );
}
