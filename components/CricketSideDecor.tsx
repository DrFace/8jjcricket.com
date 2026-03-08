"use client";

import React, { useEffect, useRef, useState } from "react";

// ─── Lazy video loader ────────────────────────────────────────────────────────
function LazyVideo({
  src,
  style,
  className,
  flipped = false,
}: {
  src: string;
  style?: React.CSSProperties;
  className?: string;
  flipped?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={style} className={className}>
      {shouldLoad && (
<video
  autoPlay
  loop
  muted
  playsInline
  preload="none"
  style={{
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "bottom",
    transform: flipped ? "scaleX(-1)" : "none",
  }}
>
  <source src="/trophy.webm" type="video/webm" />
</video>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function CricketSideDecor() {
  const sharedStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "clamp(140px, 16vw, 260px)",
    pointerEvents: "none",
    zIndex: 10,
  };

  return (
    <>
      {/* ── LEFT trophy ── */}
      <LazyVideo
        src="/trophy.mp4"
        style={{ ...sharedStyle, left: 0 }}
      />

      {/* ── RIGHT trophy (horizontally mirrored) ── */}
      <LazyVideo
        src="/trophy.mp4"
        style={{ ...sharedStyle, right: 0 }}
        flipped
      />
    </>
  );
}