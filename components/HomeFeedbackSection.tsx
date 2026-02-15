"use client";

import { useMemo, useState } from "react";
import Reveal from "./Reveal";
import SocialBox from "./SocialBox";
import Image from "next/image";
import { GOOGLE_PLAY_STORE } from "@/lib/constant";
import PlayStore from "./PlayStore";

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
      `From: ${email.trim()}\n\n${message.trim()}\n`,
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
        <div className="india-card-blue-glow p-6">
          <h2 className="text-2xl india-header-text">Open Policy</h2>

          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-200">
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-india-gold" />
              <p>
                Our open policy is the guiding compass for the 8jjcricket
                Alliance’s growth. We put customers at the center and treat
                customer satisfaction as the measure of success. We want this
                openness to reach every member.
              </p>
            </li>

            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-india-gold" />
              <p>
                This{" "}
                <span className="font-semibold text-india-saffron">FEEDBACK</span>{" "}
                area was built based on that idea.
              </p>
            </li>

            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-india-gold" />
              <p>We listen to improve and value every single opinion.</p>
            </li>

            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-india-gold" />
              <p>
                The system will grant special rewards to thank loyal members who
                accompany us and contribute valuable feedback for continuous
                improvement.
              </p>
            </li>

            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-india-gold" />
              <p>Share your ideas to earn meaningful rewards.</p>
            </li>

            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-india-gold" />
              <p>8jjcricket Alliance sincerely thanks you, valued members.</p>
            </li>
          </ul>
        </div>

        {/* RIGHT: Feedback form */}
        <div className="india-card-saffron-glow p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-india-gold">Feedback</h2>
              <p className="mt-1 text-sm text-gray-300">
                Log in to submit feedback and receive valuable rewards!
              </p>
            </div>

            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-india-gold/30 bg-black/30">
              <MailIcon className="h-5 w-5 text-india-gold" />
            </div>
          </div>

          <form onSubmit={handleSendFeedback} className="mt-5 space-y-4">
            <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 focus-within:border-india-gold focus-within:ring-1 focus-within:ring-india-gold transition-all shadow-inner">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
                required
              />
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 focus-within:border-india-gold focus-within:ring-1 focus-within:ring-india-gold transition-all shadow-inner">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your feedback"
                className="h-40 w-full resize-none bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
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
              className="india-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="group relative india-card-gold-glow p-5 hover:scale-[1.02] transition-transform">
            {/* Play Store */}
            <Reveal>
              <PlayStore />
            </Reveal>
          </div>

          <div className="group relative india-card-saffron-glow p-5 hover:scale-[1.02] transition-transform">
            {/* social media */}
            <Reveal>
              <SocialBox />
            </Reveal>
          </div>
        </div>

        {/* RIGHT: long feedback email bar */}
        <div className="india-card-blue-glow p-6">
          <p className="text-sm font-semibold text-white">
            If your feedback is long, please send it by email
          </p>
          <p className="mt-1 text-sm text-gray-300">
            We will receive it and support you as best as possible. Thank you!
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-india-blue/30 bg-black/25 p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-india-blue text-white">
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
              className="india-btn-secondary py-2 px-4 shadow-none"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

