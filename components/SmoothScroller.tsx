"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (reduceMotion.matches) return;

        const lenis = new Lenis({
            duration: 1.2,
            lerp: 0.08,
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1,
        });

        let raf = 0;
        const rafLoop = (time: number) => {
            lenis.raf(time);
            raf = requestAnimationFrame(rafLoop);
        };
        raf = requestAnimationFrame(rafLoop);

        let locked = false;

        const getSections = () => Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));

        const getActiveIndex = (sections: HTMLElement[]) => {
            const y = window.scrollY;
            let best = 0;
            let bestDist = Infinity;
            for (let i = 0; i < sections.length; i++) {
                const el = sections[i];
                const d = Math.abs(el.offsetTop - y);
                if (d < bestDist) {
                    bestDist = d;
                    best = i;
                }
            }
            return best;
        };

        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) < 8) return;

            const sections = getSections();
            if (sections.length === 0) return;
            if (locked) return;

            // Prevent native scroll from competing with Lenis
            e.preventDefault();

            const current = getActiveIndex(sections);
            const dir = e.deltaY > 0 ? 1 : -1;
            const next = Math.max(0, Math.min(sections.length - 1, current + dir));
            if (next === current) return;

            locked = true;
            lenis.scrollTo(sections[next], { duration: 0.9 });

            window.setTimeout(() => {
                locked = false;
            }, 900);
        };

        window.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            window.removeEventListener("wheel", onWheel);
            cancelAnimationFrame(raf);
            lenis.destroy();
        };
    }, [pathname]);

    return <>{children}</>;
}
