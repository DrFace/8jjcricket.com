"use client";

import { useEffect, useState } from "react";
import MatchCentre from "@/components/MatchCentre";

type LiveScorePayload = {
    matches: any[]; // Replace with your actual types
    updatedAt?: string;
};

export default function LiveScoreClient() {
    const [data, setData] = useState<LiveScorePayload | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        try {
            setError(null);
            const res = await fetch("/api/livescore", { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = (await res.json()) as LiveScorePayload;
            setData(json);
        } catch (e: any) {
            setError(e?.message ?? "Failed to load live scores");
        }
    }

    useEffect(() => {
        load();
        const t = setInterval(load, 15000); // poll every 15s
        return () => clearInterval(t);
    }, []);

    if (error) {
        return (
            <div className="rounded-md border p-4">
                <p className="font-medium">Live scores unavailable</p>
                <p className="text-sm opacity-80">{error}</p>
                <button className="mt-3 rounded-md border px-3 py-2 text-sm" onClick={load}>
                    Retry
                </button>
            </div>
        );
    }

    if (!data) return <div className="rounded-md border p-4">Loading live scores…</div>;

    // CASE B: pass props into MatchCentre
    return <MatchCentre />;
}
