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

                    {/* LEFT: Hamburger + Branding */}
                    <div className="flex items-center gap-3">
                        <MobileSidebar />

                        <div className="min-w-0">
                            <div className="text-sm font-semibold leading-tight">
                                8jjcricket
                            </div>
                            <div className="text-[11px] text-white/60 leading-tight">
                                Live scores & updates
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: 8jj Logo (click → /moblie) */}
                    <Link href="/moblie" className="shrink-0">
                        <img
                            src="/8jjlogo.png"
                            alt="8jj"
                            className="
                            h-9 w-auto object-contain
                            transition
                            hover:scale-105 hover:brightness-110
                            active:scale-95"
                        />
                    </Link>

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
