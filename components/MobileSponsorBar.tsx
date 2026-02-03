"use client";

import { useSponsors } from "@/hooks/useSponsors";
import { STORAGE_BASE_URL } from "@/lib/constant";
import React from "react";

function MobileSponsorBar() {
  const { sponsors, isLoading, error } = useSponsors();
  console.log("Sponsors data:", sponsors);

  if (isLoading || error || !sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url(/brands/brands-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative px-4 py-3">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
          <h3 className="text-sm font-semibold text-white">Sponsors</h3>
        </div>

        <div className="grid grid-cols-5 gap-x-3 gap-y-4">
          {sponsors && sponsors.length > 0
            ? sponsors.map((b, i) => (
                <a
                  key={i}
                  href={b.info || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center transition active:scale-95"
                >
                  {b?.image ? (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
                      <img
                        src={
                          b.image
                            ? `${STORAGE_BASE_URL}${b.image}`
                            : "/placeholder.png"
                        }
                        alt={b.name || "Sponsor Logo"}
                        className="h-9 w-9 object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                </a>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default MobileSponsorBar;
