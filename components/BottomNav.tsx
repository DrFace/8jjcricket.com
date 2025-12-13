"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Handshake, Gift, MessageSquareText, User } from "lucide-react";

type Item = {
    href: string;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
};

const items: Item[] = [
    { href: "/", label: "Home", Icon: Home },
    { href: "/sponsor", label: "Live score", Icon: Handshake },
    { href: "/gameshow", label: "Games", Icon: Gift },
    { href: "/feedback", label: "News", Icon: MessageSquareText },
    { href: "/account", label: "Upcoming", Icon: User },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="
        fixed bottom-0 inset-x-0 z-[60] md:hidden
        border-t border-white/10 bg-black/70 backdrop-blur-xl
        pb-[env(safe-area-inset-bottom)]
      "
            aria-label="Bottom navigation"
        >
            <div className="mx-auto max-w-md px-2">
                <div className="flex items-center justify-between py-2">
                    {items.map(({ href, label, Icon }) => {
                        const active =
                            pathname === href || (href !== "/" && pathname.startsWith(href));

                        return (
                            <Link
                                key={href}
                                href={href}
                                className="flex w-full flex-col items-center justify-center gap-0.5 py-1"
                            >
                                <Icon
                                    className={
                                        active
                                            ? "h-5 w-5 text-amber-300"
                                            : "h-5 w-5 text-white/60"
                                    }
                                />
                                <span
                                    className={
                                        active
                                            ? "text-[11px] font-semibold text-amber-300"
                                            : "text-[11px] font-medium text-white/45"
                                    }
                                >
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
