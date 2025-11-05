'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const sources = [
    { src: '/banner002.png', alt: 'banner002' },
    { src: '/banner003.png', alt: 'banner003' },
    { src: '/banner004.png', alt: 'banner004' },
    { src: '/banner005.png', alt: 'banner005' },
]

export default function BannerCarousel() {
    const [index, setIndex] = useState(0)
    const timer = useRef<number | null>(null)
    const len = sources.length

    // Auto-advance
    useEffect(() => {
        start()
        return stop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index])

    const start = () => {
        stop()
        timer.current = window.setTimeout(() => {
            setIndex(i => (i + 1) % len)
        }, 4000)
    }

    const stop = () => {
        if (timer.current) {
            clearTimeout(timer.current)
            timer.current = null
        }
    }

    // Swipe support
    const touchX = useRef<number | null>(null)
    const onTouchStart = (e: React.TouchEvent) => {
        touchX.current = e.touches[0].clientX
        stop()
    }
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchX.current === null) return start()
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 40) {
            setIndex(i => (dx > 0 ? (i - 1 + len) % len : (i + 1) % len))
        }
        touchX.current = null
        start()
    }

    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl shadow"
            onMouseEnter={stop}
            onMouseLeave={start}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {/* Make it thinner */}
            <div className="relative h-28 sm:h-36 md:h-40 lg:h-48">
                <div
                    className="flex h-full w-full transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {sources.map(({ src, alt }) => (
                        <div key={src} className="relative h-full w-full flex-shrink-0">
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                sizes="100vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Prev / Next (icon-only) */}
            <button
                aria-label="previous"
                onClick={() => setIndex(i => (i - 1 + len) % len)}
                className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center h-9 w-9 rounded-full bg-black/40 hover:bg-black/55 backdrop-blur active:scale-95"
            >
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <button
                aria-label="next"
                onClick={() => setIndex(i => (i + 1) % len)}
                className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center h-9 w-9 rounded-full bg-black/40 hover:bg-black/55 backdrop-blur active:scale-95"
            >
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* Dot indicators (no words) */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {sources.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-2.5 w-2.5 rounded-full transition-all ${i === index ? 'scale-110 bg-white' : 'bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`go to item ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
