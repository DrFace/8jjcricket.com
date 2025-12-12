// components/TopNav.tsx
import Link from "next/link";
import Image from "next/image";
import NewsTicker from "@/components/NewsTicker";

export default function TopNav() {
    return (
        <>
            <div className="w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="flex w-full items-center gap-4 px-4 py-2 text-sm text-sky-100">
                    <span className="font-semibold tracking-wide uppercase text-amber-300">
                        Latest News
                    </span>
                    <div className="flex-1">
                        <NewsTicker />
                    </div>
                </div>
            </div>

            {/* sticky works inside the same scroll container */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl shadow-lg">
                <div className="flex w-full items-center justify-between px-4 py-2">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
                        <Image src="/8jjlogo.png" alt="8jjcricket logo" width={44} height={44} priority />
                        <span>8jjcricket</span>
                    </Link>

                    <nav className="hidden gap-6 text-[15px] font-semibold text-sky-100/90 md:flex">
                        <Link href="/" className="hover:text-amber-300">Home</Link>
                        <Link href="/archive" className="hover:text-amber-300">Archive</Link>
                        <Link href="/series" className="hover:text-amber-300">Series</Link>
                        <Link href="/players" className="hover:text-amber-300">Players</Link>
                        <Link href="/minigames" className="hover:text-amber-300">Minigames</Link>
                        <Link href="/news" className="hover:text-amber-300">News</Link>
                    </nav>

                    <Link
                        href="/minigames"
                        className="rounded-full bg-gradient-to-r from-[#FACC15] via-[#F97316] to-[#EA580C] px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-amber-500/40 ring-1 ring-white/20 hover:brightness-110 active:scale-95"
                    >
                        Play Now
                    </Link>
                </div>
            </header>
        </>
    );
}
