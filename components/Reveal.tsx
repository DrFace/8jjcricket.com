"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.15 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={[
                "transition-all duration-500 will-change-transform",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}
