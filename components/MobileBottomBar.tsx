// components/MobileBottomBar.tsx
import Link from "next/link";

export default function MobileBottomBar() {
    return (
        <div className="sticky bottom-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 md:hidden">
            <div className="container grid grid-cols-3 items-center py-2 text-center text-xs">
                <Link href="/recent" className="flex flex-col items-center gap-1">
                    <span></span>
                    <span className="font-medium">Recent</span>
                </Link>
                <Link href="/minigames" className="-mt-6">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/30 ring-2 ring-white/60">
                        Play
                    </span>
                </Link>
                <Link href="/upcoming" className="flex flex-col items-center gap-1">
                    <span>⏰</span>
                    <span className="font-medium">Upcoming</span>
                </Link>
            </div>
        </div>
    );
}
