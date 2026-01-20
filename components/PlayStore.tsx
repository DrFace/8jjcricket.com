"use client";

import Link from "next/link";
import Image from "next/image";
import { GOOGLE_PLAY_STORE } from "@/lib/constant";

export default function PlayStore() {
  const store = GOOGLE_PLAY_STORE?.[0]; // your constant currently has 1 item

  return (
    <div
      className="
        relative w-full overflow-hidden rounded-2xl
        border border-white/10
        bg-gradient-to-br from-slate-950/70 via-slate-900/45 to-amber-950/20
        shadow-[0_20px_60px_rgba(0,0,0,0.55)]
        backdrop-blur-2xl
      "
    >
      {/* subtle glows (kept, but lighter so it doesn’t feel heavy in small card) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-16 h-56 w-56 rounded-full bg-amber-400/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-cyan-400/8 blur-3xl"
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Brand logo (small) */}
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-0 rounded-xl bg-amber-400/15 blur-md"
              />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/30">
                <Image
                  src="/8jjlogo.png"
                  alt="8jjcricket logo"
                  width={24}
                  height={24}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <h2 className="text-sm font-semibold text-white">Download</h2>
              </div>
              <p className="mt-0.5 text-xs text-white/70">
                Get the app on Google Play
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-200">
            Android
          </span>
        </div>

        {/* Compact CTA row */}
        <div className="mt-4">
          {store ? (
            <Link
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={store.alt}
              className="
                group relative flex w-full items-center justify-between gap-3
                rounded-2xl border border-white/10
                bg-black/25 px-4 py-3
                shadow-lg shadow-black/30
                transition
                hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-black/35
                active:translate-y-0 active:scale-[0.99]
              "
            >
              <span
                aria-hidden
                className="
                  pointer-events-none absolute inset-0 rounded-2xl
                  bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-orange-500/0
                  opacity-0 transition-opacity group-hover:opacity-100
                "
              />

              <div className="relative flex items-center gap-3">
                {/* Play icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/25">
                  <Image
                    src={store.img}
                    alt={store.alt}
                    width={34}
                    height={34}
                    className="object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white">
                    Google Play
                  </div>
                  <div className="text-xs text-white/60">Tap to install</div>
                </div>
              </div>

              {/* Arrow */}
              <div
                className="
                  relative flex h-9 w-9 items-center justify-center
                  rounded-xl border border-amber-400/20 bg-amber-500/10
                  text-amber-200 transition
                  group-hover:border-amber-400/35 group-hover:bg-amber-500/15
                "
                aria-hidden
              >
                →
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white/60">
              Store link not configured.
            </div>
          )}

          {/* single-line micro text (doesn’t increase height much) */}
          <p className="mt-2 text-[11px] text-white/55">
            Official app • Fast install • Secure
          </p>
        </div>
      </div>
    </div>
  );
}
