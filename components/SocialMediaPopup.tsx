"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SOCIALS_LINKS } from "@/lib/constant";
import IconButton from "./ui/IconButton";

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
              <IconButton
                key={s.url}
                href={s.url}
                ariaLabel={s.label}
                className="h-11 w-11 rounded-2xl animate-social-pop"
                icon={
                  <Image
                    src={s.icon}
                    alt={s.label}
                    width={30}
                    height={30}
                    className="relative object-contain"
                  />
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
