"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SOCIALS_LINKS } from "@/lib/constant";

export type AudioItem = {
  id: number;
  title: string;
  file_path: string;
};

export default function SocialMediaPopup(props: {
  open: boolean;
  onClose: () => void;
}) {
  const { open, onClose } = props;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const panelRef = useRef<HTMLDivElement | null>(null);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-end pr-12"
      onMouseDown={(e) => {
        const target = e.target as Node;
        if (panelRef.current && !panelRef.current.contains(target)) onClose();
      }}
    >
      {/* Overlay */}
      <button className="absolute inset-0 " onClick={onClose} />
      {/* Gradient Border Wrapper */}
      <div
        ref={panelRef}
        className="relative w-[5vw] max-w-md max-h-[90vh] shadow-2xl overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Inner */}
        <div className="rounded-2xl  p-5 text-white max-h-[86vh] overflow-y-auto">
          <div className="mb-10 gap-3 flex flex-col items-center">
            {SOCIALS_LINKS.map((s, i) => (
              <Link
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{ animationDelay: `${i * 120}ms` }}
                className="
                  group relative flex h-11 w-11 items-center justify-center
                  rounded-2xl border border-white/10
                  bg-black/40 bg-blur-sm
                  shadow-lg shadow-black/30
                  transition
                  hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-black/35
                  active:translate-y-0 active:scale-[0.96]
                  animate-social-pop
                "
              >
                <span
                  aria-hidden
                  className="
                    pointer-events-none absolute inset-0 rounded-2xl
                    bg-gradient-to-br from-amber-500/0 via-amber-500/15 to-orange-500/0
                    opacity-0 transition-opacity group-hover:opacity-100
                  "
                />
                <Image
                  src={s.icon}
                  alt={s.label}
                  width={30}
                  height={30}
                  className="relative object-contain"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
