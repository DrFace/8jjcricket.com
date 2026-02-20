// components/HomeVerticalSwiper.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Mousewheel, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";

export default function HomeVerticalSwiper({
  children,
}: {
  children: React.ReactNode;
}) {
  const swiperRef = useRef<SwiperType | null>(null);

  const [initialIndex, setInitialIndex] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";
    document.body.style.margin = "0";

    const savedIndex = sessionStorage.getItem("home-swiper-index");
    if (savedIndex) {
      setInitialIndex(parseInt(savedIndex, 10));
    } else {
      setInitialIndex(0);
    }
  }, []);

  if (initialIndex === null) return null;

  return (
    <Swiper
      direction="vertical"
      slidesPerView={1}
      speed={1000}
      modules={[Mousewheel, EffectCreative]}
      effect="creative"
      creativeEffect={{
        prev: {
          shadow: true,
          translate: [0, "-30%", -800],
          rotate: [15, 0, 0],
          opacity: 0.3,
        },
        next: {
          shadow: true,
          translate: [0, "100%", 0],
          rotate: [0, 0, 0],
        },
      }}
      style={{ height: "100vh", background: "#000", perspective: "2000px" }}
      mousewheel={{
        forceToAxis: true,
        releaseOnEdges: true,
        thresholdDelta: 5,
      }}
      // ✅ allow Next <Link> taps/clicks to work reliably
      preventClicks={false}
      preventClicksPropagation={false}
      touchStartPreventDefault={false}
      initialSlide={initialIndex}
      onSlideChange={(s) => {
        sessionStorage.setItem("home-swiper-index", s.activeIndex.toString());
      }}
      onSwiper={(s) => {
        swiperRef.current = s;
      }}
    >
      {React.Children.map(children, (child, idx) => (
        <SwiperSlide key={idx} className="overflow-hidden">
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
