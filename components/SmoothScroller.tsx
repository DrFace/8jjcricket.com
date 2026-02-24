"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroller({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // Mobile OR reduced motion → skip Lenis entirely
    if (reduceMotion || isTouch) return;

    // ---------- DESKTOP ONLY ----------
    // Lenis provides smooth inertia for the wheel.
    // Section snapping is handled entirely by HomeVerticalSwiper (Swiper.js),
    // so we do NOT add any custom wheel / snap logic here.
    const lenis = new Lenis({
      duration: 0.8,
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1.2,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}