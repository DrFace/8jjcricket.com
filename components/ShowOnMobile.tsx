// components/ShowOnMobile.tsx
"use client";

import { useEffect, useState } from "react";

export default function ShowOnMobile({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        const sync = () => setIsMobile(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    // Don’t render until we know (prevents flash / hydration weirdness)
    if (isMobile === null) return null;

    return isMobile ? <>{children}</> : null;
}
