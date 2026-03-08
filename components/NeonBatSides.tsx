"use client";

import { useEffect } from "react";

const STYLE_ID = "neon-bat-sides-style";

export default function NeonBatSides() {
  useEffect(() => {
    // avoid duplicates (hot reload / route changes)
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes floatY {
        0%   { transform: translateY(0px); }
        50%  { transform: translateY(-18px); }
        100% { transform: translateY(0px); }
      }

      @keyframes glowPulse {
        0%   { opacity: .55; filter: blur(10px); }
        50%  { opacity: .85; filter: blur(14px); }
        100% { opacity: .55; filter: blur(10px); }
      }

      @keyframes ballDrift {
        0%   { transform: translateY(34vh); opacity: 0.0; }
        10%  { opacity: 1.0; }
        50%  { transform: translateY(10vh); opacity: 1.0; }
        90%  { opacity: 1.0; }
        100% { transform: translateY(-6vh); opacity: 0.0; }
      }

      @keyframes tailStretch {
        0%   { transform: translateY(34vh) scaleY(0.7); opacity: 0.0; }
        10%  { opacity: 0.7; }
        50%  { transform: translateY(10vh) scaleY(1.0); opacity: 0.75; }
        100% { transform: translateY(-6vh) scaleY(0.85); opacity: 0.0; }
      }

      .neon-side {
        pointer-events: none;
        position: absolute;
        top: 0;
        height: 100%;
        width: 22vw;
        max-width: 320px;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10;
      }
      @media (min-width: 1024px) { .neon-side { display: flex; } }

      .bat-wrap {
        position: relative;
        width: min(240px, 18vw);
        height: 78vh;
        max-height: 680px;
        animation: floatY 6s ease-in-out infinite;
      }

      .bat {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 34%;
        height: 78%;
        transform: translate(-50%, -50%) rotate(-10deg);
        border-radius: 22px;
        background:
          linear-gradient(180deg,
            rgba(0,170,255,0.0) 0%,
            rgba(0,170,255,0.28) 14%,
            rgba(255,184,0,0.22) 55%,
            rgba(255,184,0,0.0) 100%),
          linear-gradient(90deg,
            rgba(0,170,255,0.18),
            rgba(255,184,0,0.18));
        box-shadow:
          0 0 24px rgba(0,170,255,0.20),
          0 0 28px rgba(255,184,0,0.18);
        border: 1px solid rgba(255,255,255,0.10);
        backdrop-filter: blur(2px);
      }

      .bat::before {
        content: "";
        position: absolute;
        inset: -18px;
        border-radius: 28px;
        background: radial-gradient(circle at 40% 30%,
          rgba(0,170,255,0.35) 0%,
          rgba(0,170,255,0.0) 62%),
          radial-gradient(circle at 60% 70%,
          rgba(255,184,0,0.30) 0%,
          rgba(255,184,0,0.0) 60%);
        animation: glowPulse 3.8s ease-in-out infinite;
      }

      .handle {
        position: absolute;
        left: 50%;
        top: 80%;
        width: 22%;
        height: 18%;
        transform: translate(-50%, 0) rotate(-10deg);
        border-radius: 18px;
        background: linear-gradient(180deg,
          rgba(0,0,0,0.0),
          rgba(0,0,0,0.35) 30%,
          rgba(0,0,0,0.0));
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 0 16px rgba(0,170,255,0.12);
      }

      .handle::after {
        content: "";
        position: absolute;
        inset: 10px 6px;
        border-radius: 14px;
        background: repeating-linear-gradient(
          180deg,
          rgba(255,255,255,0.08) 0px,
          rgba(255,255,255,0.08) 2px,
          rgba(255,255,255,0.0) 6px,
          rgba(255,255,255,0.0) 10px
        );
        opacity: 0.55;
      }

      .ball {
        position: absolute;
        left: 62%;
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: radial-gradient(circle at 30% 30%,
          rgba(255,255,255,0.95) 0%,
          rgba(255,255,255,0.25) 35%,
          rgba(0,170,255,0.45) 65%,
          rgba(255,184,0,0.35) 100%);
        box-shadow:
          0 0 18px rgba(0,170,255,0.45),
          0 0 18px rgba(255,184,0,0.30);
        animation: ballDrift 4.6s ease-in-out infinite;
      }

      .trail {
        position: absolute;
        left: calc(62% + 6px);
        width: 10px;
        height: 180px;
        border-radius: 999px;
        background: linear-gradient(180deg,
          rgba(0,170,255,0.0) 0%,
          rgba(0,170,255,0.55) 30%,
          rgba(255,184,0,0.35) 70%,
          rgba(255,184,0,0.0) 100%);
        filter: blur(6px);
        animation: tailStretch 4.6s ease-in-out infinite;
      }

      .right .bat-wrap { transform: scaleX(-1); animation-delay: -3s; }
      .right .ball, .right .trail { animation-delay: -2.3s; }

      .fade-left {
        -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 60%, rgba(0,0,0,0) 100%);
        mask-image: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 60%, rgba(0,0,0,0) 100%);
        opacity: 0.9;
      }
      .fade-right {
        -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 60%, rgba(0,0,0,0) 100%);
        mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 60%, rgba(0,0,0,0) 100%);
        opacity: 0.9;
      }
    `;

    document.head.appendChild(style);

    return () => {
      // optional cleanup (keeps DOM clean on route change)
      style.remove();
    };
  }, []);

  return (
    <>
      {/* LEFT */}
      <div className="neon-side left-0 fade-left">
        <div className="bat-wrap">
          <div className="bat" />
          <div className="handle" />
          <div className="trail" />
          <div className="ball" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="neon-side right-0 fade-right right">
        <div className="bat-wrap">
          <div className="bat" />
          <div className="handle" />
          <div className="trail" />
          <div className="ball" />
        </div>
      </div>
    </>
  );
}