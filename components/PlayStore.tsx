"use client";

import Link from "next/link";
import Image from "next/image";
import { GOOGLE_PLAY_STORE, APPLE_APP_STORE } from "@/lib/constant";
import { motion } from "framer-motion";

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M5,19.34V4.66c0-0.74,0.76-1.18,1.35-0.73l11.75,7.34c0.52,0.32,0.52,1.06,0,1.39l-11.75,7.34C5.76,20.52,5,20.08,5,19.34z" />
    </svg>
  );
}

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.05,20.28c-0.96,0.95-2.05,1.72-3.14,1.72s-1.48-0.34-2.55-0.34s-1.63,0.34-2.55,0.34s-2.13-0.77-3.13-1.72c-2.09-1.98-3.68-5.75-3.68-8.9c0-5,3.13-7.64,6.13-7.64c1.55,0,2.86,0.9,3.72,0.9c0.86,0,2.17-0.9,3.72-0.9c1.23,0,4.68,0.49,6.54,3.22c-0.15,0.09-3.92,2.28-3.92,6.97c0,5.74,5.04,7.66,5.13,7.69C23.08,18.06,20.04,17.28,17.05,20.28z M12.06,4.67C12,4.67,11.94,4.67,11.89,4.67C11.39,4.67,10.08,4.19,10,2.77c0-0.5,0.08-1.55,0.85-2.22C11.6,0,13.06,0.25,13.1,1.72C13.1,2.5,12.83,4.67,12.06,4.67z" />
    </svg>
  );
}

export default function PlayStore() {
  const gPlay = GOOGLE_PLAY_STORE?.[0];
  const aStore = APPLE_APP_STORE?.[0];

  return (
    <div
      className="
        india-card-gold-glow p-6 transition-all duration-500 
        hover:rotate-x-3 hover:translate-z-10 hover:scale-[1.02] hover:shadow-2xl
      "
    >
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/30">
              <Image
                src="/8jjlogo.png"
                alt="8jjcricket logo"
                width={22}
                height={22}
                className="object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white leading-tight">Download App</h2>
              <p className="text-[10px] text-white/50">Fast install • Secure</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-200">
            Store
          </span>
        </div>

        {/* Single Row Stores Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Google Play */}
          {gPlay && (
            <motion.div
              whileHover={{ scale: 1.05, translateZ: 10, rotateX: 2 }}
              whileTap={{ scale: 0.98 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Link
                href={gPlay.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group relative flex items-center justify-center gap-2
                  rounded-xl border border-white/10
                  bg-black/40 py-2.5 px-2 transition-all duration-300
                  hover:border-amber-400/40 hover:bg-black/50
                "
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-amber-400/20 to-orange-500/10 border border-white/5">
                  <PlayIcon className="h-4 w-4 text-amber-400" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-[8px] font-medium text-white/40 leading-none">Android</div>
                  <div className="text-[11px] font-bold text-white leading-tight">Google Play</div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* App Store */}
          {aStore && (
            <motion.div
              whileHover={{ scale: 1.05, translateZ: 10, rotateX: 2 }}
              whileTap={{ scale: 0.98 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Link
                href={aStore.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group relative flex items-center justify-center gap-2
                  rounded-xl border border-white/10
                  bg-black/40 py-2.5 px-2 transition-all duration-300
                  hover:border-blue-400/40 hover:bg-black/50
                "
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-400/20 to-indigo-500/10 border border-white/5">
                  <AppleIcon className="h-4 w-4 text-blue-400" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-[8px] font-medium text-white/40 leading-none">iOS / iPhone</div>
                  <div className="text-[11px] font-bold text-white leading-tight">App Store</div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-[10px] text-white/25 font-medium">
        Official 8JJ Cricket Application
      </p>
    </div>
  );
}
