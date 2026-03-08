"use client"; 
 
import React, { useEffect, useRef, useState } from "react"; 
 
// ─── Lazy video loader ──────────────────────────────────────────────────────── 
function LazyTrophy({ 
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
        <img 
          src={src} 
          alt="Cricket Trophy" 
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "contain", 
            transform: flipped ? "scaleX(-1)" : "none", 
          }} 
        /> 
      )} 
    </div> 
  ); 
} 
 
// ─── Main export ────────────────────────────────────────────────────────────── 
export default function CricketSideDecor() { 
  const sharedStyle: React.CSSProperties = { 
    position: "absolute", 
    top: "50%", 
    height: "clamp(280px, 32vw, 520px)", 
    width: "clamp(280px, 32vw, 520px)", 
    pointerEvents: "none", 
    zIndex: 10, 
    filter: 
      "drop-shadow(0 0 12px rgba(255, 200, 50, 0.55)) drop-shadow(0 0 28px rgba(255, 160, 0, 0.35))", 
  }; 
 
  return ( 
    <> 
      {/* ── LEFT trophy ── */} 
      <LazyTrophy 
        src="/trophy.gif" 
        style={{ ...sharedStyle, left: "11%", transform: "translateY(-50%) translateX(-50%)" }} 
      /> 
 
      {/* ── RIGHT trophy (horizontally mirrored) ── */} 
      <LazyTrophy 
        src="/torphy2.gif" 
        style={{ ...sharedStyle, right: "11%", transform: "translateY(-50%) translateX(50%)" }} 
        flipped 
      /> 
    </> 
  ); 
}