"use client"

import Link from "next/link"
import Image from "next/image"

export default function BetButton() {
    return (
        <div className="relative group inline-block">

            {/* Gradient glow border */}
            <div
                className="
                    absolute inset-0 rounded-lg p-[1.5px]
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300
                    bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600
                    blur-[3px]
                "
            >
                <div className="w-full h-full bg-white rounded-lg"></div>
            </div>

            <Link
                href="https://9ipl.org/"
                className="
                    relative z-10 block p-1.5 rounded-lg
                    transition-all duration-300
                    group-hover:shadow-lg
                    group-hover:-translate-y-[2px]
                "
            >
                <div className="flex items-center justify-start">

                    {/* Smaller Button Image */}
                    <Image
                        src="/1xbet.png"
                        alt="1xBet"
                        width={135}
                        height={40}
                        className="
                            w-auto h-9 rounded-md
                            transition-all duration-300
                            group-hover:brightness-110
                            group-hover:drop-shadow-[0_0_8px_rgba(30,144,255,0.5)]
                        "
                    />
                </div>
            </Link>
        </div>
    )
}
