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

    // Mobile OR reduced motion → no Lenis, no JS snapping
    if (reduceMotion || isTouch) return;

    // ---------- DESKTOP ONLY ----------
    const lenis = new Lenis({
      duration: 0.8,
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 2.5,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    let locked = false;

    const sections = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("[data-snap]")
      );

    const activeIndex = (els: HTMLElement[]) => {
      const y = window.scrollY;
      let best = 0;
      let dist = Infinity;
      els.forEach((el, i) => {
        const d = Math.abs(el.offsetTop - y);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      return best;
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 10) return;
      if (locked) return;

      const els = sections();
      if (!els.length) return;

      e.preventDefault();

      const current = activeIndex(els);
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(els.length - 1, current + dir));
      if (next === current) return;

      locked = true;
      const targetEl = els[next];
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const elH = targetEl.offsetHeight;
      // If the element is shorter than the viewport, centre it by adding
      // half of the remaining height as an offset.  Otherwise, align to top.
      const offset = Math.max(0, (viewportH - elH) / 2);
      lenis.scrollTo(targetEl, { duration: 0.9, offset });
      setTimeout(() => (locked = false), 900);
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}