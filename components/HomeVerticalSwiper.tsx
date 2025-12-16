// components/HomeVerticalSwiper.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Mousewheel } from "swiper/modules";
import "swiper/css";

export default function HomeVerticalSwiper({
  children,
}: {
  children: React.ReactNode;
}) {
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";
    document.body.style.margin = "0";

    const s = swiperRef.current;
    if (s?.wrapperEl) {
      (s.wrapperEl as HTMLElement).style.transitionTimingFunction =
        "cubic-bezier(0.34, 1.56, 0.64, 1)";
    }
  }, []);

  return (
    <Swiper
      direction="vertical"
      slidesPerView={1}
      speed={800}
      modules={[Mousewheel]}
      style={{ height: "100vh" }}
      mousewheel={{
        forceToAxis: true,
        releaseOnEdges: true,
        thresholdDelta: 5,
      }}
      // ✅ allow Next <Link> taps/clicks to work reliably
      preventClicks={false}
      preventClicksPropagation={false}
      touchStartPreventDefault={false}
      onSwiper={(s) => {
        swiperRef.current = s;
        (s.wrapperEl as HTMLElement).style.transitionTimingFunction =
          "cubic-bezier(0.34, 1.56, 0.64, 1)";
      }}
    >
      {React.Children.map(children, (child, idx) => (
        <SwiperSlide key={idx}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
}
