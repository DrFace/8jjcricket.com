"use client";

import { useSponsors } from "@/hooks/useSponsors";
import React from "react";
import styles from "./SponsorBar.module.css";

function MobileSponsorBar() {
  const { sponsors, isLoading, error } = useSponsors();

  if (isLoading || error || !sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 w-full px-4">
      {sponsors?.map((sponsor, index) => {
        return (
          <a
            key={index}
            href={sponsor.info ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              animationDelay: `${index * 0.2}s`,
            }}
            className={`${styles.sponsorBar} ${styles.sponsorLink} relative pointer-events-auto flex items-center justify-center gap-2 rounded-full border border-amber-200 bg-white/5 px-4 py-2.5 backdrop-blur-md shadow-lg transition-all duration-300 ease-out cursor-pointer hover:no-underline hover:shadow-2xl`}
          >
            {/* Decorative elements */}
            <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-amber-400/40 blur-sm"></div>
            <div className="absolute -right-1 -bottom-1 h-1.5 w-1.5 rounded-full bg-yellow-300/30 blur-sm"></div>

            <span className="relative text-sm font-bold text-transparent bg-clip-text whitespace-nowrap bg-gradient-to-r from-amber-200 via-yellow-100 to-white drop-shadow-lg">
              ✨ {sponsor.title}
            </span>
          </a>
        );
      })}
    </div>
  );
}

export default MobileSponsorBar;
