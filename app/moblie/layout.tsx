// app/moblie/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import MobileSidebar from "@/components/MobileSidebar";
import BottomNav from "@/components/BottomNav";

export default function MoblieLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen w-screen max-w-none overflow-x-hidden bg-black text-white">

            {/* TOP NAV BAR (GLOBAL) */}
            <header className="sticky top-0 z-[70] w-full border-b border-white/10 bg-black">
                <div className="flex items-center justify-between px-3 py-2">

                    {/* LEFT: Hamburger + Logo + Brand */}
                    <div className="flex items-center gap-3">
                        <MobileSidebar />

                        <Link
                            href="/moblie"
                            className="flex items-center gap-2 relative active:scale-95"
                            aria-label="Go to Home"
                        >
                            {/* Logo */}
                            <div className="relative">
                                <img
                                    src="/8jjlogo.png"
                                    alt="8JJCRICKET"
                                    className="relative z-10 h-9 w-9 object-contain"
                                />

                                {/* Glow underneath */}
                                <span
                                    aria-hidden
                                    className="
                    pointer-events-none
                    absolute inset-x-0 -bottom-1
                    mx-auto
                    h-2 w-10
                    rounded-full
                    bg-cyan-400/60
                    blur-lg
                    opacity-70
                  "
                                />
                            </div>

                            {/* Brand text */}
                            <span className="text-sm font-semibold tracking-tight text-white">
                                8JJCRICKET
                            </span>
                        </Link>
                    </div>

                    {/* RIGHT: Small M button */}
                    <button
                        type="button"
                        className="
              inline-flex items-center justify-center
              h-8 w-8
              rounded-full
              border border-white/15
              bg-white/5
              text-sm font-semibold text-white
              hover:bg-white/10
              active:scale-95
            "
                        aria-label="M button"
                    >
                        M
                    </button>

                </div>
            </header>

            {/* PAGE CONTENT */}
            <main
                className="
          h-[calc(100vh-56px)]
          w-full max-w-none
          overflow-y-auto overflow-x-hidden
          px-3 pt-3 pb-24
          [scrollbar-width:none] [-ms-overflow-style:none]
        "
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {children}
            </main>

            {/* BOTTOM NAV (GLOBAL) */}
            <BottomNav />
        </div>
    );
}
