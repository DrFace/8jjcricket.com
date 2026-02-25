"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ScrollIndicator from "@/components/ScrollIndicator";

// ─── How long one slide transition takes (ms) ───────────────────────────────
const TRANSITION_DURATION = 900;

// ─── CSS easing — matches the silky OKVIP feel ──────────────────────────────
const EASE = "cubic-bezier(0.77, 0, 0.175, 1)";

export default function HomeVerticalSwiper({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);   // fixed viewport window
  const sliderRef  = useRef<HTMLDivElement>(null);   // tall strip that moves

  const [activeIndex, setActiveIndex]         = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const isAnimatingRef = useRef(false);

  const childrenArray = useMemo(
    () => React.Children.toArray(children),
    [children],
  );
  const total = childrenArray.length;

  // ── Measure the viewport window ──────────────────────────────────────────
  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const h    = Math.max(1, Math.floor(window.innerHeight - rect.top));
      setContainerHeight(h);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // ── Core: slide to index ─────────────────────────────────────────────────
  const goTo = useCallback(
    (index: number) => {
      if (isAnimatingRef.current) return;
      const next = Math.max(0, Math.min(total - 1, index));
      if (next === activeIndex) return;

      isAnimatingRef.current = true;
      setActiveIndex(next);

      setTimeout(() => {
        isAnimatingRef.current = false;
      }, TRANSITION_DURATION);
    },
    [activeIndex, total],
  );

  // ── Wheel ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let acc      = 0;
    let lastTime = 0;
    let pending: ReturnType<typeof setTimeout> | null = null;

    const flush = (dir: number) => {
      acc = 0;
      goTo(activeIndex + dir);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimatingRef.current) return;

      const now = Date.now();
      if (now - lastTime > 250) acc = 0;
      lastTime = now;

      acc += e.deltaY;

      if (pending) clearTimeout(pending);

      if (Math.abs(acc) >= 60) {
        flush(acc > 0 ? 1 : -1);
      } else {
        pending = setTimeout(() => {
          if (Math.abs(acc) > 15) flush(acc > 0 ? 1 : -1);
          acc = 0;
        }, 150);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (pending) clearTimeout(pending);
    };
  }, [activeIndex, goTo]);

  // ── Touch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let startY = 0;
    let startT = 0;

    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startT = Date.now();
    };

    const onEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;
      const dy  = startY - e.changedTouches[0].clientY;
      const dt  = Date.now() - startT;
      const vel = Math.abs(dy) / dt;

      if (Math.abs(dy) > 35 || (vel > 0.25 && Math.abs(dy) > 10)) {
        goTo(activeIndex + (dy > 0 ? 1 : -1));
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend",   onEnd,   { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend",   onEnd);
    };
  }, [activeIndex, goTo]);

  // ── Keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, goTo]);

  // ── Broadcast active index ────────────────────────────────────────────────
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("home-slide-change", { detail: activeIndex }),
    );
  }, [activeIndex]);

  // ── Compute translateY ────────────────────────────────────────────────────
  const translateY = containerHeight > 0 ? -(activeIndex * containerHeight) : 0;

  return (
    <>
      <ScrollIndicator
        activeIndex={activeIndex}
        total={total}
        onSectionClick={goTo}
      />

      {/* Fixed-height viewport window — overflow:hidden clips everything */}
      <div
        ref={wrapperRef}
        style={{
          height: containerHeight > 0 ? `${containerHeight}px` : "calc(100vh - 1px)",
          overflow: "hidden",
          position: "relative",
        }}
        className="w-full"
      >
        {/* The tall strip that slides up/down via GPU-accelerated transform */}
        <div
          ref={sliderRef}
          style={{
            transform: `translateY(${translateY}px)`,
            transition: `transform ${TRANSITION_DURATION}ms ${EASE}`,
            willChange: "transform",
            height: containerHeight > 0 ? `${total * containerHeight}px` : "auto",
          }}
        >
          {childrenArray.map((child, idx) => (
            <div
              key={idx}
              data-index={idx}
              style={{
                height: containerHeight > 0 ? `${containerHeight}px` : "100vh",
                overflow: "hidden",
              }}
              className="w-full"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        body { overflow: hidden; }
      `}</style>
    </>
  );
}