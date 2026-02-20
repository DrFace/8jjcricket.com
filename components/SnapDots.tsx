"use client";

export default function SnapDots({
    count,
    activeIndex,
    onGoTo,
}: {
    count: number;
    activeIndex: number;
    onGoTo: (index: number) => void;
}) {
    return (
        <div className="fixed right-4 top-1/2 z-50 -translate-y-1/2">
            <div className="flex flex-col gap-2 rounded-full border border-white/15 bg-black/40 p-2 backdrop-blur-xl">
                {Array.from({ length: count }).map((_, i) => {
                    const active = i === activeIndex;
                    return (
                        <button
                            key={i}
                            aria-label={`Go to section ${i + 1}`}
                            onClick={() => onGoTo(i)}
                            className={[
                                "h-2 w-2 rounded-full transition-all duration-300",
                                active 
                                    ? "bg-india-gold scale-150 shadow-[0_0_8px_rgba(255,153,51,0.6)]" 
                                    : "bg-white/20 hover:bg-white/40",
                            ].join(" ")}
                        />
                    );
                })}
            </div>
        </div>
    );
}
