// components/MobileTopNav.tsx
import Link from "next/link";
import Image from "next/image";
import MobileSidebar from "@/components/MobileSidebar";

export default function MobileTopNav() {
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black shadow-lg">
            <div className="relative flex w-full items-center justify-between px-4 py-2">
                {/* LEFT — Hamburger */}
                <div className="flex items-center">
                    <MobileSidebar />
                </div>

                {/* CENTER — Logo */}
                <Link
                    href="/moblie"
                    className="
            absolute left-1/2 top-1/2
            -translate-x-1/2 -translate-y-1/2
            flex items-center justify-center
          "
                    aria-label="Go to mobile home"
                >
                    <Image
                        src="/8jjlogo.png"
                        alt="8jjcricket logo"
                        width={34}
                        height={34}
                        priority
                        className="drop-shadow-[0_0_6px_rgba(250,204,21,0.35)]"
                    />
                </Link>

                {/* RIGHT — Play Now */}
                <Link
                    href="/minigames"
                    className="
            rounded-full
            bg-gradient-to-r from-[#FACC15] via-[#F97316] to-[#EA580C]
            px-4 py-2 text-sm font-semibold text-black
            shadow-lg shadow-amber-500/40
            ring-1 ring-white/20
            hover:brightness-110 active:scale-95
          "
                >
                    Play Now
                </Link>
            </div>
        </header>
    );
}
