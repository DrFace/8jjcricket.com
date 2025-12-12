// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="snap-none border-t border-white/10 bg-black/70 py-10 backdrop-blur-xl">
            <div className="grid w-full grid-cols-1 gap-6 px-4 md:grid-cols-3">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <Image src="/8jjlogo.png" alt="8jjcricket" width={32} height={32} />
                        <span className="font-semibold text-white">8jjcricket</span>
                    </div>
                    <p className="text-sm text-sky-100/80">
                        Live cricket, instant odds and fast minigames. Play responsibly.
                    </p>
                </div>

                <div className="text-sm text-sky-100/90">
                    <p className="mb-2 font-semibold text-white">Quick Links</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Link href="/players" className="hover:text-amber-300">Players</Link>
                        <Link href="/minigames" className="hover:text-amber-300">Minigames</Link>
                        <Link href="/series" className="hover:text-amber-300">Series</Link>
                        <Link href="/archive" className="hover:text-amber-300">Archive</Link>
                    </div>
                </div>

                <div className="text-sm text-sky-100/80">
                    <p className="mb-2 font-semibold text-white">Trust &amp; Safety</p>
                    <ul className="space-y-1">
                        <li>Play responsibly</li>
                        <li>Support: support@8jjcricket.com</li>
                    </ul>
                </div>
            </div>

            <p className="mt-8 w-full px-4 text-center text-xs text-sky-100/70">
                © {new Date().getFullYear()} 8jjcricket. All rights reserved.
            </p>
        </footer>
    );
}
