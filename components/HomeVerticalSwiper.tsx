"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollIndicator from "@/components/ScrollIndicator";

function SectionWrapper({ 
  children, 
  idx, 
  containerRef, 
  containerHeight, 
}: { 
  children: React.ReactNode; 
  idx: number; 
  containerRef: React.RefObject<HTMLDivElement | null>;
  containerHeight: number;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: containerRef,
    offset: ["start end", "end start"]
  });

  // Very subtle 3D-like transforms
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98]);
  const opacity = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0.5, 1, 1, 0.5]);

  return (
    <motion.div
      ref={targetRef}
      data-index={idx}
      style={{
        height: containerHeight ? `${containerHeight}px` : "100vh",
        rotateX,
        scale,
        opacity,
        transformStyle: "preserve-3d",
      }}
      className="section-wrapper w-full snap-start snap-always overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

export default function HomeVerticalSwiper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const available = Math.max(0, Math.floor(window.innerHeight - rect.top));
      setContainerHeight(available);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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

    const sections = container.querySelectorAll(".section-wrapper");
    sections.forEach((node: Element) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [childrenArray.length, activeIndex]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("home-slide-change", { detail: activeIndex }));
  }, [activeIndex]);

  const handleSectionClick = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    container.scrollTo({
      top: index * containerHeight,
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
        className="relative w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scrollbar-hide perspective-2000 preserve-3d"
      >
        {childrenArray.map((child: React.ReactNode, idx: number) => (
          <SectionWrapper
            key={idx}
            idx={idx}
            containerRef={containerRef}
            containerHeight={containerHeight}
          >
            {child}
          </SectionWrapper>
        ))}
      </div>
    </>
  );
}
