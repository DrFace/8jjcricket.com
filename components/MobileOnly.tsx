
// components/MobileOnly.tsx
"use client";

import { useEffect, useState } from "react";

export default function MobileOnly({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    if (!isMobile) return null;
    return <>{children}</>;
}
