"use client";

import Link from "next/link";
import Image from "next/image";
import { SOCIALS_LINKS } from "@/lib/constant";
import IconButton from "./ui/IconButton";

export default function SocialBox() {
  return (
    <div
      className="
        relative w-full overflow-hidden rounded-2xl
        border border-white/10
        bg-gradient-to-br from-slate-950/70 via-slate-900/45 to-amber-950/20
        shadow-[0_20px_60px_rgba(0,0,0,0.55)]
        backdrop-blur-2xl*
        india-card-gold-glow p-6 transition-all duration-500 
        hover:rotate-x-3 hover:translate-z-10 hover:scale-[1.02] hover:shadow-2xl
      "
    >
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
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
              <IconButton
                key={s.url}
                href={s.url}
                ariaLabel={s.label}
                className="h-11 w-11 rounded-2xl"
                icon={
                  <Image
                    src={s.icon}
                    alt={s.label}
                    width={24}
                    height={24}
                    className="relative object-contain"
                  />
                }
              />
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
