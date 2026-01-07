"use client";

import { useEffect, useState } from "react";

type CarouselItem = {
  src: string;
  href: string;
  title?: string;
};

export default function ImageCarousel({
  items,
  interval = 5000,
}: {
  items: CarouselItem[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval]);

  if (!items.length) return null;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
      {items.map((item, i) => {
        const active = i === index;

        return (
          <a
            key={i}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.title}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              active ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={item.src}
              alt={item.title || ""}
              className="h-full w-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </a>
        );
      })}
    </div>
  );
}
