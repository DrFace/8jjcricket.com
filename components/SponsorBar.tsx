"use client";

import { useSponsors } from "@/hooks/useSponsors";
import React from "react";
import styles from "./SponsorBar.module.css";

function SponsorBar() {
  const { sponsors, isLoading, error } = useSponsors();

  console.log("data", sponsors);

  if (isLoading || error || !sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2">
      <div
        className={`pointer-events-auto flex items-center gap-4 rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-md shadow-lg ${styles.sponsorBar}`}
      >
        {/* Decorative elements */}
        <div className="absolute -left-2 -top-2 h-3 w-3 rounded-full bg-amber-400/40 blur-sm"></div>
        <div className="absolute -right-2 -bottom-2 h-2 w-2 rounded-full bg-yellow-300/30 blur-sm"></div>

        <div className="relative flex items-center gap-4">
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
                className={[
                  styles.sponsorLink,
                  "relative text-base sm:text-lg font-bold text-transparent bg-clip-text whitespace-nowrap",
                  "bg-gradient-to-r from-amber-200 via-yellow-100 to-white",
                  "hover:no-underline hover:scale-150 hover:from-amber-300 hover:via-yellow-100 hover:to-white",
                  "transition-all duration-300 ease-out",
                  "cursor-pointer",
                  "drop-shadow-lg hover:drop-shadow-xl",
                ].join(" ")}
              >
                ✨ {sponsor.title}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SponsorBar;
