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
            href={`/players/${id}`}
            className="group block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
            <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
                    {image_path ? (
                        <Image
                            src={image_path}
                            alt={fullname}
                            fill
                            className="object-contain"
                            sizes="80px"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            No image
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <div className="truncate text-lg font-semibold">{fullname}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        {position && <span className="rounded-full bg-gray-100 px-2 py-0.5">{position}</span>}
                        {country && <span className="truncate">{country}</span>}
                    </div>
                </div>
            </div>
        </Link>
    );
}
