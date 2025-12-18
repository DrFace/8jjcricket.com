'use client';

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
            className="rounded-2xl border border-amber-400 bg-black/50 backdrop-blur-xl p-4 shadow-lg hover:border-amber-400/80 hover:shadow-[0_20px_50px_rgba(251,191,36,0.3)] hover:scale-105 hover:brightness-110 transition-all"
        >
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-amber-300">{statusLine}</span>
                <span className="text-xs text-sky-100/90">{startIST}</span>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-amber-300">{local?.name || ""}</span>
                </div>
                <span className="text-sm font-medium text-amber-400">vs</span>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-amber-300">{visitor?.name || ""}</span>
                </div>
            </div>
            <div className="mt-2 text-sm text-sky-100/90">{startUTC ? `UTC: ${startUTC}` : ""}</div>
        </Link>
    );
}
