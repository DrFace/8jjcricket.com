// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { SOCIALS_LINKS } from "@/lib/constant";
import IconButton from "./ui/IconButton";

export default function Footer() {
  return (
    <footer className="snap-none border-t border-white/10 bg-black/70 py-10 backdrop-blur-xl left-0 w-full">
      <div className="grid 2xl:w-[75%] xl:w-[80%] lg:w-[95%] mx-auto gap-3 md:grid-cols-[2fr_1fr_1fr_1fr]">
        {/* Logo */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Image src="/8jjlogo.png" alt="8jjcricket" width={32} height={32} />
            <span className="font-semibold text-white">8jjcricket</span>
          </div>
          <p className="text-sm text-sky-100/80">
            Live cricket, instant odds and fast minigames. Play responsibly.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-sm text-sky-100/90">
          <p className="mb-2 font-semibold text-white">Quick Links</p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/players">Players</Link>
            <Link href="/minigames">Minigames</Link>
            <Link href="/series">Series</Link>
            <Link href="/archive">Archive</Link>
          </div>
        </div>

        {/* Trust & Safety */}
        <div className="flex justify-between gap-1">
          <div className="text-sm text-sky-100/80">
            <p className="mb-2 font-semibold text-white">Trust &amp; Safety</p>
            <ul className="space-y-1">
              <li>Play responsibly</li>
              <li>
                Support:{" "}
                <a
                  href="mailto:8jjcricket@gmail.com"
                  className="underline hover:text-white"
                >
                  8jjcricket@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div>
          <div className="flex">
            {SOCIALS_LINKS.slice(0, 2).map((s) => (
              <IconButton
                key={s.url}
                href={s.url}
                ariaLabel={s.label}
                className="h-12 w-12 rounded-2xl"
                icon={<Image src={s.icon} alt={s.label} width={32} height={32} />}
              />
            ))}
          </div>
          <div className="flex">
            {SOCIALS_LINKS.slice(2, 4).map((s) => (
              <IconButton
                key={s.url}
                href={s.url}
                ariaLabel={s.label}
                className="h-12 w-12 rounded-2xl"
                icon={<Image src={s.icon} alt={s.label} width={32} height={32} />}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="mt-8 w-full px-4 text-center text-xs text-sky-100/70">
        © {new Date().getFullYear()} 8jjcricket. All rights reserved.
      </p>
    </footer>
  );
}
