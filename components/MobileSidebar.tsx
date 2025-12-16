// components/MobileSidebar.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    Home,
    Archive,
    Trophy,
    Users,
    Gamepad2,
    Newspaper,
    Search,
    CalendarClock,
    BarChart3,
} from "lucide-react";

type NavItem = {
    href: string;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
};

function cx(...classes: Array<string | false | undefined | null>) {
    return classes.filter(Boolean).join(" ");
}

export default function MobileSidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const items: NavItem[] = useMemo(
        () => [
            { href: "/moblie", label: "Home", Icon: Home },
            { href: "/moblie/search", label: "Search", Icon: Search },
            { href: "/moblie/upcoming", label: "Upcoming", Icon: CalendarClock },
            { href: "/moblie/recent", label: "Recent", Icon: CalendarClock },
            { href: "/moblie/series", label: "Series", Icon: Trophy },
            { href: "/moblie/teams", label: "Teams", Icon: Users },
            { href: "/moblie/players", label: "Players", Icon: Users },
            { href: "/moblie/rankings/t20i", label: "Team Rankings", Icon: BarChart3 },
            { href: "/moblie/archive", label: "Archive", Icon: Archive },
            { href: "/moblie/minigames", label: "Minigames", Icon: Gamepad2 },
            { href: "/moblie/news", label: "News", Icon: Newspaper },
        ],
        [],
    );

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open]);

    return (
        <>
            {/* Hamburger button */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="
          inline-flex items-center justify-center
          h-10 w-10 rounded-full
          border border-white/10 bg-black
          text-white shadow-lg
          active:scale-95
        "
                aria-label="Open menu"
                aria-haspopup="dialog"
                aria-expanded={open}
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Overlay */}
            <div
                className={cx(
                    "fixed inset-0 z-[80]",
                    open ? "pointer-events-auto" : "pointer-events-none",
                )}
                aria-hidden={!open}
            >
                {/* Darker overlay so the menu stands out */}
                <div
                    className={cx(
                        "absolute inset-0 bg-black/80 transition-opacity",
                        open ? "opacity-100" : "opacity-0",
                    )}
                    onClick={() => setOpen(false)}
                />

                {/* Drawer */}
                <aside
                    role="dialog"
                    aria-modal="true"
                    className={cx(
                        "absolute left-0 top-0 h-full w-[86%] max-w-[360px]",
                        "border-r border-white/10",
                        // Solid, readable background (no transparency)
                        "bg-black",
                        // Optional subtle depth
                        "bg-gradient-to-b from-black via-black to-zinc-950",
                        "shadow-2xl transition-transform duration-300 ease-out",
                        open ? "translate-x-0" : "-translate-x-full",
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2"
                        >
                            <Image
                                src="/8jjlogo.png"
                                alt="8jjcricket logo"
                                width={36}
                                height={36}
                                priority
                            />
                            <div className="leading-tight">
                                <div className="text-sm font-semibold text-white">8jjcricket</div>
                                <div className="text-[11px] text-white/60">Mobile Menu</div>
                            </div>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="
                inline-flex items-center justify-center
                h-9 w-9 rounded-full
                border border-white/10 bg-white/5
                text-white
                active:scale-95
              "
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Primary action */}
                    <div className="px-4 pt-4">
                        <Link
                            href="/minigames"
                            onClick={() => setOpen(false)}
                            className="
                inline-flex w-full items-center justify-center
                rounded-full
                bg-gradient-to-r from-[#FACC15] via-[#F97316] to-[#EA580C]
                px-4 py-2.5
                text-sm font-semibold text-black
                shadow-lg shadow-amber-500/40
                ring-1 ring-white/20
                hover:brightness-110 active:scale-95
              "
                        >
                            Play Now
                        </Link>
                    </div>

                    {/* Nav */}
                    <nav className="px-2 py-3">
                        {items.map(({ href, label, Icon }) => {
                            const active =
                                pathname === href || (href !== "/" && pathname?.startsWith(href));

                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setOpen(false)}
                                    className={cx(
                                        "flex items-center gap-3 rounded-xl px-3 py-2.5 transition",
                                        active
                                            ? "bg-amber-950/50 text-amber-300 border border-amber-400/20"
                                            : "text-white/90 hover:bg-white/5",
                                    )}
                                >
                                    <Icon
                                        className={cx(
                                            "h-5 w-5",
                                            active ? "text-amber-300" : "text-white/70",
                                        )}
                                    />
                                    <span className="text-sm font-semibold">{label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                 
                </aside>
            </div>
        </>
    );
}
