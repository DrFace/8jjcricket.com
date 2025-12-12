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
                                "h-2.5 w-2.5 rounded-full transition",
                                active ? "bg-amber-300" : "bg-white/30 hover:bg-white/60",
                            ].join(" ")}
                        />
                    );
                })}
            </div>
        </div>
    );
}
