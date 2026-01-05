"use client";

import { useMemo, useState } from "react";

const LONG_FEEDBACK_EMAIL = "8jjcricket@gmail.com";

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <path
                d="M6 8l6 5 6-5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ExternalArrow(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M14 5h5v5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10 14 19 5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M19 14v4a2 2 0 0 1-2 2h-9a3 3 0 0 1-3-3V8a2 2 0 0 1 2-2h4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        </svg>
    );
}

type Props = {
    /** Optional: set these if you already have pages/routes for them */
    voteBrandHref?: string;
    voteSoftwareHref?: string;
};

export default function HomeFeedbackSection({
    voteBrandHref = "/vote/brands",
    voteSoftwareHref = "/vote/software",
}: Props) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const canSend = useMemo(() => {
        return email.trim().length > 3 && message.trim().length > 3;
    }, [email, message]);

    function handleSendFeedback(e: React.FormEvent) {
        e.preventDefault();

        // UI-only implementation: open user's email client
        const subject = encodeURIComponent("Website feedback");
        const body = encodeURIComponent(
            `From: ${email.trim()}\n\n${message.trim()}\n`
        );

        window.location.href = `mailto:${LONG_FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
    }

    function handleLongFeedbackSend() {
        // open email client for long feedback
        const subject = encodeURIComponent("Long feedback / Support request");
        window.location.href = `mailto:${LONG_FEEDBACK_EMAIL}?subject=${subject}`;
    }

    return (
        <section className="w-full">
            {/* TOP: Two panels */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* LEFT: Open policy text */}
                <div className="rounded-2xl border border-white/15 bg-slate-900/55 p-6 shadow-2xl backdrop-blur-2xl">
                    <h2 className="text-2xl font-semibold text-white">Open Policy</h2>

                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/85">
                        <li className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                            <p>
                                Our open policy is the guiding compass for the 8jjcricket Alliance’s
                                growth. We put customers at the center and treat customer
                                satisfaction as the measure of success. We want this openness to
                                reach every member.
                            </p>
                        </li>

                        <li className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                            <p>
                                This <span className="font-semibold text-amber-300">FEEDBACK</span>{" "}
                                area was built based on that idea.
                            </p>
                        </li>

                        <li className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                            <p>We listen to improve and value every single opinion.</p>
                        </li>

                        <li className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                            <p>
                                The system will grant special rewards to thank loyal members who
                                accompany us and contribute valuable feedback for continuous
                                improvement.
                            </p>
                        </li>

                        <li className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                            <p>Share your ideas to earn meaningful rewards.</p>
                        </li>

                        <li className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                            <p>8jjcricket Alliance sincerely thanks you, valued members.</p>
                        </li>
                    </ul>
                </div>

                {/* RIGHT: Feedback form */}
                <div className="rounded-2xl border border-white/15 bg-slate-900/55 p-6 shadow-2xl backdrop-blur-2xl">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-semibold text-white">Feedback</h2>
                            <p className="mt-1 text-sm text-white/70">
                                Log in to submit feedback and receive valuable rewards!{" "}
                                <a
                                    href="/login"
                                    className="font-semibold text-amber-300 hover:text-amber-200"
                                >
                                    Log in now.
                                </a>
                            </p>
                        </div>

                        <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/30">
                            <MailIcon className="h-5 w-5 text-white/80" />
                        </div>
                    </div>

                    <form onSubmit={handleSendFeedback} className="mt-5 space-y-4">
                        <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                                required
                            />
                        </div>

                        <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter your feedback"
                                className="h-40 w-full resize-none bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                                required
                            />
                            <div className="mt-3 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmail("");
                                        setMessage("");
                                    }}
                                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!canSend}
                            className="group w-full rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-slate-900 shadow-xl transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Send feedback →
                        </button>
                    </form>
                </div>
            </div>

            {/* BOTTOM: two cards + long feedback bar */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* LEFT: two action cards */}
                <div className="grid gap-6 sm:grid-cols-2">
                    <a
                        href={voteBrandHref}
                        className="group relative rounded-2xl border border-white/15 bg-slate-900/55 p-5 shadow-2xl backdrop-blur-2xl hover:border-amber-400/40"
                    >
                        <div className="absolute right-4 top-4 text-amber-300/90">
                            <ExternalArrow className="h-5 w-5" />
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                                <path
                                    d="M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M6 11h12v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8Z"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                />
                                <path
                                    d="M9 14h6"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-white">
                            Vote for Top Brands
                        </h3>
                        <p className="mt-1 text-sm text-white/70">
                            Shape the ranking — earn special rewards.
                        </p>
                    </a>

                    <a
                        href={voteSoftwareHref}
                        className="group relative rounded-2xl border border-white/15 bg-slate-900/55 p-5 shadow-2xl backdrop-blur-2xl hover:border-amber-400/40"
                    >
                        <div className="absolute right-4 top-4 text-amber-300/90">
                            <ExternalArrow className="h-5 w-5" />
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                                <path
                                    d="M9 11l2 2 4-5"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M7 4h10a2 2 0 0 1 2 2v14H5V6a2 2 0 0 1 2-2Z"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                />
                            </svg>
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-white">
                            Vote Software
                        </h3>
                        <p className="mt-1 text-sm text-white/70">
                            Your vote matters — unlock value rewards.
                        </p>
                    </a>
                </div>

                {/* RIGHT: long feedback email bar */}
                <div className="rounded-2xl border border-white/15 bg-slate-900/55 p-5 shadow-2xl backdrop-blur-2xl">
                    <p className="text-sm font-semibold text-white">
                        If your feedback is long, please send it by email
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                        We will receive it and support you as best as possible. Thank you!
                    </p>

                    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-black/25 p-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-slate-900">
                            <MailIcon className="h-6 w-6" />
                        </div>

                        <div className="flex-1">
                            <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-white/90">
                                {LONG_FEEDBACK_EMAIL}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLongFeedbackSend}
                            className="rounded-xl border border-amber-400/40 bg-amber-500/20 px-5 py-3 text-sm font-bold text-amber-200 hover:bg-amber-500/30"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
