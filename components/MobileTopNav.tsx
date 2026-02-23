// components/MobileTopNav.tsx
import Link from "next/link";
import Image from "next/image";
import MobileSidebar from "@/components/MobileSidebar";
import { motion } from "framer-motion";
import PrimaryButton from "@/components/ui/PrimaryButton";

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
          href="/mobile"
          className="
            absolute left-1/2 top-1/2
            -translate-x-1/2 -translate-y-1/2
            flex items-center justify-center
            gap-2
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
          <motion.div
            className="logo3d-wrap"
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            {/* Soft stadium glow behind */}
            <span className="logo3d-glow" aria-hidden="true" />

            {"8JJCRICKET".split("").map((letter, index) => (
              <motion.span
                key={index}
                data-char={letter}
                variants={{
                  initial: { opacity: 0, y: 10, rotateX: -90 },
                  animate: {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    transition: {
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 220,
                      damping: 14,
                    },
                  },
                  hover: {
                    y: -5,
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300, damping: 16 },
                  },
                }}
                className="logo3d-letter"
                style={{ fontSize: "14px" }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </Link>

        {/* RIGHT — Play Now */}
        <PrimaryButton
          href="/minigames"
          size="sm"
          className="px-4 py-2"
        >
          Play Now
        </PrimaryButton>
      </div>
    </header>
  );
}
