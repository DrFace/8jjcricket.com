"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ScrollIndicator from "@/components/ScrollIndicator";

export default function HomeVerticalSwiper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const available = Math.max(0, Math.floor(window.innerHeight - rect.top));
      setContainerHeight(available);
      setIsDesktop(window.innerWidth >= 1024);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isDesktop) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const height = containerHeight;
      if (height <= 0) return;

      sectionRefs.current.forEach((section, idx) => {
        if (!section) return;
        
        const sectionTop = idx * height;
        const diff = scrollTop - sectionTop;
        const progress = diff / height;

        if (Math.abs(progress) < 1) {
          const scale = 1 - Math.abs(progress) * 0.1;
          const rotateX = progress * 20;
          const translateY = progress * (height * 0.2);
          const opacity = 1 - Math.abs(progress) * 0.5;

          section.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            scale(${scale}) 
            translateY(${translateY}px)
          `;
          section.style.opacity = `${opacity}`;
          section.style.zIndex = Math.abs(progress) < 0.1 ? "10" : "1";
        } else {
          section.style.transform = "none";
          section.style.opacity = "1";
          section.style.zIndex = "1";
        }
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [isDesktop, containerHeight, childrenArray.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIdx = activeIndex;
        let bestRatio = 0;

        for (const entry of entries) {
          const idx = Number(entry.target.getAttribute("data-index"));
          if (!Number.isFinite(idx)) continue;

          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIdx = idx;
          }
        }

        if (bestIdx !== activeIndex) setActiveIndex(bestIdx);
      },
      {
        root: container,
        threshold: [0.35, 0.5, 0.65, 0.8],
      },
    );

    sectionRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [childrenArray.length, activeIndex]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("home-slide-change", { detail: activeIndex }));
  }, [activeIndex]);

  const handleSectionClick = (index: number) => {
    const el = sectionRefs.current[index];
    const container = containerRef.current;
    if (!el || !container) return;

    container.scrollTo({
      top: el.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <>
      <ScrollIndicator
        activeIndex={activeIndex}
        total={childrenArray.length}
        onSectionClick={handleSectionClick}
      />

      <div
        ref={containerRef}
        style={{
          height: containerHeight ? `${containerHeight}px` : "calc(100vh - 1px)",
          overscrollBehavior: "none",
          WebkitOverflowScrolling: "touch",
        }}
        className="relative w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
      >
        {childrenArray.map((child, idx) => (
          <div
            key={idx}
            ref={(node) => {
              sectionRefs.current[idx] = node;
            }}
            data-index={idx}
            style={{
              height: containerHeight ? `${containerHeight}px` : "100vh",
              transition: isDesktop ? "none" : "transform 0.5s ease-out, opacity 0.5s ease-out",
              transformStyle: "preserve-3d",
              willChange: "transform, opacity",
            }}
            className="w-full snap-start snap-always overflow-hidden"
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
}
