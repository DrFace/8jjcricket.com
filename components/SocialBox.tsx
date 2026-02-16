"use client";

import Link from "next/link";
import Image from "next/image";
import { SOCIALS_LINKS } from "@/lib/constant";

export default function SocialBox() {
  return (
    <div
      className="
        relative w-full h-full overflow-hidden rounded-2xl
        border border-white/10
        bg-gradient-to-br from-slate-950/70 via-slate-900/45 to-amber-950/20
        shadow-[0_20px_60px_rgba(0,0,0,0.55)]
        backdrop-blur-2xl
      "
    >
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <h2 className="text-sm font-semibold text-white">Follow Us</h2>
            </div>
            <p className="mt-0.5 text-xs text-white/70">
              Stay connected with 8jjcricket
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-200">
            Social
          </span>
        </div>

        {/* Icons (pulled up; no bottom anchoring) */}
        <div className="mt-4">
          <div className="grid w-full grid-cols-4 gap-3">
            {SOCIALS_LINKS.map((s) => (
              <Link
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="
                  group relative flex h-11 w-11 items-center justify-center
                  rounded-2xl border border-white/10
                  bg-black/25
                  shadow-lg shadow-black/30
                  transition
                  hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-black/35
                  active:translate-y-0 active:scale-[0.96]
                "
              >
                <span
                  aria-hidden
                  className="
                    pointer-events-none absolute inset-0 rounded-2xl
                    bg-gradient-to-br from-amber-500/0 via-amber-500/15 to-orange-500/0
                    opacity-0 transition-opacity group-hover:opacity-100
                  "
                />
                <Image
                  src={s.icon}
                  alt={s.label}
                  width={24}
                  height={24}
                  className="relative object-contain"
                />
              </Link>
            ))}
          </div>

          <p className="mt-3 text-[11px] text-white/55">
            Follow us for updates, offers, and match insights.
          </p>
        </div>
      </div>
    </div>
  );
}
