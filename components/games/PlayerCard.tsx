
'use client';

import Image from 'next/image';
import Link from 'next/link';

type Props = {
    id: number;
    fullname: string;
    position?: string | null;
    country?: string | null;
    image_path?: string | null;
};

export default function PlayerCard({ id, fullname, position, country, image_path }: Props) {
    return (
        <Link
            href={`/moblie/players/${id}`}
            className="group block rounded-2xl border border-white/20 bg-black/50 p-4 shadow-xl backdrop-blur-xl transition hover:border-amber-400 hover:shadow-amber-400/30"
        >
            <div className="flex items-center gap-4">
                {/* Player Image */}
                <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                    {image_path ? (
                        <Image
                            src={image_path}
                            alt={fullname}
                            fill
                            className="object-contain"
                            sizes="80px"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-sky-100/70">
                            No image
                        </div>
                    )}
                </div>

                {/* Player Details */}
                <div className="min-w-0">
                    <div className="truncate text-lg font-semibold text-amber-300 drop-shadow">
                        {fullname}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-sky-100/90">
                        {position && (
                            <span className="rounded-full bg-slate-800/70 px-2 py-0.5 text-white/80">
                                {position}
                            </span>
                        )}
                        {country && <span className="truncate">{country}</span>}
                    </div>
                </div>
            </div>
               </Link>
    );
}