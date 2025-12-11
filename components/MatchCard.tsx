'use client';

import Image from 'next/image';
import Link from 'next/link';

type Team = {
    id: number;
    name?: string;
    image_path?: string;
};

type League = {
    name?: string;
    code?: string;
};

type Run = {
    team_id: number;
    score?: number;
    wickets?: number | null;
    overs?: number | string | null;
};

type Match = {
    id: number;
    league?: League;
    league_id?: number;
    round?: string;
    note?: string;
    status?: string;
    live_status?: string;
    current_over?: string | number;
    starting_at?: string;
    localteam?: Team;
    visitorteam?: Team;
    runs?: Run[];
};

interface Props {
    match: Match;
    href?: string;
}

export default function MatchCard({ match, href = "/live-score-page" }: Props) {
    const leagueName = match.league?.name || String(match.league_id || "");
    const round = match.round || "";
    const heading = [round, leagueName].filter(Boolean).join(" • ");

    const format = match.league?.code || match.note || "Match";

    const local = match.localteam;
    const visitor = match.visitorteam;

    const runs = match.runs || [];

    const getScore = (teamId?: number) => {
        if (!teamId) return "";
        const r = runs.find(run => run.team_id === teamId);
        if (!r || r.score == null) return "";
        let score = `${r.score}`;
        if (r.wickets != null) score += `/${r.wickets}`;
        if (r.overs != null) score += ` (${r.overs} ov)`;
        return score;
    };

    const localScore = getScore(local?.id);
    const visitorScore = getScore(visitor?.id);

    // Time formatting
    let startIST = "";
    let startUTC = "";
    if (match.starting_at) {
        const d = new Date(match.starting_at);
        if (!isNaN(d.getTime())) {
            startIST = new Intl.DateTimeFormat("en-IN", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                timeZone: "Asia/Kolkata",
                timeZoneName: "short",
            }).format(d);

            startUTC = new Intl.DateTimeFormat("en-GB", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                timeZone: "UTC",
                timeZoneName: "short",
            }).format(d);
        }
    }

    let statusLine = match.status || "";
    if (match.note) statusLine += ` - ${match.note}`;
    if (match.live_status) statusLine += ` • ${match.live_status}`;
    if (match.current_over) statusLine += ` • Overs ${match.current_over}`;

    const isLive =
        match.status?.toLowerCase().includes("live") ||
        match.live_status?.toLowerCase().includes("live");

    return (
        <Link
            href={href}
            className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
        >
            {/* HEADER */}
            <div className="mb-2 flex items-center justify-between">
                <div className="truncate text-xs font-semibold text-gray-600">
                    {heading}
                </div>

                <div className="flex items-center gap-2">
                    {isLive && (
                        <span className="text-red-600 text-[11px] font-bold flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
                            LIVE
                        </span>
                    )}
                    <span className="bg-gray-100 text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase">
                        {format}
                    </span>
                </div>
            </div>

            {/* BODY */}
            <div className="space-y-3">
                {/* LOCAL TEAM */}
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full bg-gray-50 overflow-hidden">
                        {local?.image_path ? (
                            <img
                                src={local?.image_path || ""}
                                alt={`${local?.name || ""} logo`}
                                className="h-full w-full object-contain p-1"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">
                                No Logo
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex justify-between">
                            <div className="truncate text-sm font-semibold text-gray-900">
                                {local?.name || ""}
                            </div>
                            <div className="text-sm font-bold text-gray-900 tabular-nums">
                                {localScore || ""}
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">{startIST}</div>
                    </div>
                </div>

                {/* VISITOR TEAM */}
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full bg-gray-50 overflow-hidden">
                        {visitor?.image_path ? (
                            <img
                                src={local?.image_path || ""}
                                alt={`${local?.name || ""} logo`}
                                className="h-full w-full object-contain p-1"
                            />

                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">
                                No Logo
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex justify-between">
                            <div className="truncate text-sm font-semibold text-gray-900">
                                {visitor?.name || ""}
                            </div>
                            <div className="text-sm font-bold text-gray-900 tabular-nums">
                                {visitorScore || ""}
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">
                            {startUTC ? `UTC: ${startUTC}` : ""}
                        </div>
                    </div>
                </div>
            </div>

            {/* STATUS */}
            {statusLine && (
                <div className="mt-3 text-xs font-medium text-gray-700">
                    {statusLine}
                </div>
            )}

            {/* FOOTER */}
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>View More</span>
                <span className="text-base">&rsaquo;</span>
            </div>
        </Link>
    );
}
