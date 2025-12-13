// components/DesktopOnly.tsx
"use client";

import { useEffect, useState } from "react";

export default function DesktopOnly({ children }: { children: React.ReactNode }) {
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 769px)");

        const update = () => setIsDesktop(mq.matches);
        update();

        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    // Prevent flash / hydration mismatch
    if (isDesktop === null) return null;

    return isDesktop ? <>{children}</> : null;
}
