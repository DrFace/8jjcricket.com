"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * MobileNav renders a hamburger button that toggles a full‑screen overlay
 * navigation menu on small screens. The overlay lists all primary pages
 * (Home, Archive, Series, Players, Minigames, News) along with team
 * ranking categories and quick links for Recent and Upcoming matches.
 * State and interactivity live entirely within this client component so
 * that the server component layout can remain free of useState. On
 * larger screens the component renders nothing because the button is
 * hidden via Tailwind's `md:hidden` utility.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button – visible only on mobile */}
      <button
        className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        type="button"
      >
        <span className="block w-5 h-0.5 bg-gray-800 mb-1"></span>
        <span className="block w-5 h-0.5 bg-gray-800 mb-1"></span>
        <span className="block w-5 h-0.5 bg-gray-800"></span>
      </button>
      {/* Overlay menu */}
      {open && (
        // Full‑screen overlay menu. Use a high z‑index to ensure it appears
        // above all other content. The overlay itself is hidden on medium
        // and larger screens thanks to the `md:hidden` class.
        <div className="fixed inset-0 z-[100] bg-white flex flex-col p-6 overflow-y-auto md:hidden">
          <button
            className="self-end p-2 text-2xl font-bold text-gray-700"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            type="button"
          >
            ×
          </button>
          <nav className="mt-4 flex flex-col space-y-4 text-lg font-medium text-gray-800">
            <Link href="/" onClick={() => setOpen(false)} className="hover:text-blue-600">
              Home
            </Link>
            <Link href="/archive" onClick={() => setOpen(false)} className="hover:text-blue-600">
              Archive
            </Link>
            <Link href="/series" onClick={() => setOpen(false)} className="hover:text-blue-600">
              Series
            </Link>
            <Link href="/players" onClick={() => setOpen(false)} className="hover:text-blue-600">
              Players
            </Link>
            <Link href="/minigames" onClick={() => setOpen(false)} className="hover:text-blue-600">
              Minigames
            </Link>
            <Link href="/news" onClick={() => setOpen(false)} className="hover:text-blue-600">
              News
            </Link>
            <div>
              <p className="mb-1 font-semibold text-gray-600">Team Rankings</p>
              <div className="ml-2 flex flex-col space-y-2">
                <Link href="/rankings/t20i" onClick={() => setOpen(false)} className="hover:text-blue-600">
                  T20I
                </Link>
                <Link href="/rankings/odi" onClick={() => setOpen(false)} className="hover:text-blue-600">
                  ODI
                </Link>
                <Link href="/rankings/test" onClick={() => setOpen(false)} className="hover:text-blue-600">
                  Test
                </Link>
              </div>
            </div>
            <hr className="my-4 border-gray-200" />
            <Link href="/recent" onClick={() => setOpen(false)} className="hover:text-blue-600">
              Recent
            </Link>
            <Link href="/upcoming" onClick={() => setOpen(false)} className="hover:text-blue-600">
              Upcoming
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}