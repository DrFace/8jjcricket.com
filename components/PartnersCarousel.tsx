"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TouchEvent } from "react";
import Image from "next/image";

type Partner = {
  id: number;
  name: string;
  logo: string;
  bg: string;
};

type PartnersApiResponse = Array<{
  id: number;
  title: string;
  image: string;
  link: string | null;
  sort_order: number;
}>;

const AUTO_PLAY_INTERVAL = 3000;
const SLIDE_WIDTH = 320;
const CARD_SIZE = 300;
const RING_GAP = 18;
const RING_THICKNESS = 22;

const LOGO_R = CARD_SIZE / 2;
const RING_R = LOGO_R + RING_GAP + RING_THICKNESS / 2;
const SVG_PAD = 80;
const SVG_SIZE = (RING_R + RING_THICKNESS / 2 + SVG_PAD) * 2;
const SVG_C = SVG_SIZE / 2;

export default function PartnersCarousel() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // ── Refs to always have latest values (prevents stale closures) ──────────
  const displayIndexRef = useRef(0);
  const centerIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  useEffect(() => { displayIndexRef.current = displayIndex; }, [displayIndex]);
  useEffect(() => { centerIndexRef.current = centerIndex; }, [centerIndex]);
  useEffect(() => { isAnimatingRef.current = isAnimating; }, [isAnimating]);

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch("/api/partners", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to load partners: ${res.status}`);
        const json: PartnersApiResponse = await res.json();

        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "https://8jjcricket.com";

        const partnersData = json
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((item) => ({
            id: item.id,
            name: item.title,
            logo: `${backendUrl}/storage/${item.image}`,
            bg: "transparent",
          }));

        setPartners(partnersData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load partners");
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  // ── Animation ────────────────────────────────────────────────────────────
  const animateTo = useCallback((target: number) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    setIsAnimating(true);

    const start = displayIndexRef.current;
    const distance = target - start;
    const duration = 700; // slightly longer for smooth feel
    const startTime = performance.now();

    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const nextVal = start + distance * ease(p);
      setDisplayIndex(nextVal);

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayIndex(target);
        setIsAnimating(false);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // ── goTo — uses refs so never stale ─────────────────────────────────────
  const goTo = useCallback(
    (nextIndex: number) => {
      if (isAnimatingRef.current) return;
      const n = partners.length;
      if (n === 0) return;

      const normalized = ((nextIndex % n) + n) % n;
      let delta = normalized - centerIndexRef.current;
      if (delta > n / 2) delta -= n;
      if (delta < -n / 2) delta += n;
      if (delta === 0) return;

      setCenterIndex(normalized);
      animateTo(displayIndexRef.current + delta);
    },
    [partners.length, animateTo]
  );

  const goNext = useCallback(() => goTo(centerIndexRef.current + 1), [goTo]);
  const goPrev = useCallback(() => goTo(centerIndexRef.current - 1), [goTo]);

  // ── Autoplay — uses refs, no stale closure ───────────────────────────────
  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    if (partners.length === 0) return;
    timerRef.current = setInterval(() => {
      // Always read from ref — never stale
      if (!isAnimatingRef.current) {
        goTo(centerIndexRef.current + 1);
      }
    }, AUTO_PLAY_INTERVAL);
  }, [stopAutoPlay, partners.length, goTo]);

  useEffect(() => {
    if (partners.length > 0) startAutoPlay();
    return () => {
      stopAutoPlay();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [partners.length, startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { stopAutoPlay(); goNext(); startAutoPlay(); }
      if (e.key === "ArrowLeft")  { stopAutoPlay(); goPrev(); startAutoPlay(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, startAutoPlay, stopAutoPlay]);

  // ── Touch ────────────────────────────────────────────────────────────────
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      stopAutoPlay();
      dx < 0 ? goNext() : goPrev();
      startAutoPlay();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // ── Cards ────────────────────────────────────────────────────────────────
  const getVisualProps = (offset: number) => {
    const abs = Math.abs(offset);
    return {
      scale: Math.max(0.4, 1 - abs * 0.22),
      opacity: Math.max(0.15, 1 - abs * 0.35),
      blur: Math.max(0, (abs - 0.5) * 1.2),
      zIndex: Math.round(10 - abs * 2),
    };
  };

  const getCards = () => {
    if (partners.length === 0) return [];
    const n = partners.length;
    return [-2, -1, 0, 1, 2].map((slot) => {
      const rawIdx = Math.round(displayIndex) + slot;
      const idx = ((rawIdx % n) + n) % n;
      return { partner: partners[idx], offset: rawIdx - displayIndex, rawIdx };
    });
  };

  const cards = getCards();
  const currentPartner = partners[centerIndex] ?? null;

  // ── Loading / Error / Empty ──────────────────────────────────────────────
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading partners...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md px-6">
          <div className="text-red-500 text-5xl mb-4">⚠</div>
          <h3 className="text-white text-xl font-bold mb-2">Failed to Load Partners</h3>
          <p className="text-white/60 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );

  if (partners.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white/60">No partners available</p>
      </div>
    );

  // ── Fire Ring SVG — slowed down ──────────────────────────────────────────
  const FireRingSVG = () => (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 5,
        overflow: "visible",
      }}
    >
      <defs>
        <filter id="fr-turbulence" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="3" seed="2" result="turb">
            <animate attributeName="baseFrequency" dur="8s" values="0.018;0.012;0.022;0.015;0.018" repeatCount="indefinite" />
            <animate attributeName="seed" dur="6s" values="2;8;4;11;2" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="fr-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="fr-glow-wide" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>

        <linearGradient id="fr-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#084b92" />
          <stop offset="22%"  stopColor="#27B0FF" />
          <stop offset="50%"  stopColor="#FFD166" />
          <stop offset="78%"  stopColor="#1A6BFF" />
          <stop offset="100%" stopColor="#0753a9" />
        </linearGradient>

        <linearGradient id="fr-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#0b5780" />
          <stop offset="35%"  stopColor="#eeae38e0" />
          <stop offset="65%"  stopColor="#b68a08" />
          <stop offset="100%" stopColor="#9BE7FF" />
        </linearGradient>

        <radialGradient id="fr-aura" cx="50%" cy="50%" r="60%">
          <stop offset="0%"   stopColor="#000000" stopOpacity="0" />
          <stop offset="55%"  stopColor="#1A6BFF"  stopOpacity="0.1" />
          <stop offset="75%"  stopColor="#FFD166"  stopOpacity="0.14" />
          <stop offset="100%" stopColor="#27B0FF"  stopOpacity="0.1" />
        </radialGradient>

        <clipPath id="fr-ring-clip">
          <path
            d={`M 0 0 H ${SVG_SIZE} V ${SVG_SIZE} H 0 Z
                M ${SVG_C} ${SVG_C} m -${LOGO_R} 0
                a ${LOGO_R},${LOGO_R} 0 1,0 ${LOGO_R * 2},0
                a ${LOGO_R},${LOGO_R} 0 1,0 -${LOGO_R * 2},0`}
            fillRule="evenodd"
          />
        </clipPath>
      </defs>

      {/* Aura */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none" stroke="url(#fr-aura)"
        strokeWidth={RING_THICKNESS * 5} opacity={0.9} filter="url(#fr-glow-wide)" clipPath="url(#fr-ring-clip)" />

      {/* Layer 1: ambient glow */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none" stroke="#2AA8FF"
        strokeWidth={RING_THICKNESS * 2} opacity={0.28} filter="url(#fr-glow-wide)" clipPath="url(#fr-ring-clip)" />

      {/* Layer 2: base ring — slowed from 6s to 14s */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none" stroke="url(#fr-grad-1)"
        strokeWidth={RING_THICKNESS + 1} opacity={0.92} filter="url(#fr-glow)" clipPath="url(#fr-ring-clip)">
        <animateTransform attributeName="transform" type="rotate"
          from={`0 ${SVG_C} ${SVG_C}`} to={`360 ${SVG_C} ${SVG_C}`} dur="14s" repeatCount="indefinite" />
      </circle>

      {/* Layer 3: turbulent ring — slowed from 4s to 10s */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none" stroke="url(#fr-grad-1)"
        strokeWidth={RING_THICKNESS} opacity={0.45} filter="url(#fr-turbulence)" clipPath="url(#fr-ring-clip)">
        <animateTransform attributeName="transform" type="rotate"
          from={`0 ${SVG_C} ${SVG_C}`} to={`-360 ${SVG_C} ${SVG_C}`} dur="10s" repeatCount="indefinite" />
      </circle>

      {/* Layer 4: bright core — slowed from 2.5s to 7s */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none" stroke="url(#fr-grad-2)"
        strokeWidth={RING_THICKNESS * 0.45} opacity={0.85} filter="url(#fr-turbulence)" clipPath="url(#fr-ring-clip)">
        <animateTransform attributeName="transform" type="rotate"
          from={`180 ${SVG_C} ${SVG_C}`} to={`-180 ${SVG_C} ${SVG_C}`} dur="7s" repeatCount="indefinite" />
      </circle>

      {/* Layer 5: pulsing — slowed from 1.6s to 4s */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none" stroke="#1759ab"
        strokeWidth={RING_THICKNESS * 2.6} filter="url(#fr-glow)" clipPath="url(#fr-ring-clip)">
        <animate attributeName="opacity" dur="4s" values="0.25;0.9;0.5;1;0.25" repeatCount="indefinite" />
        <animate attributeName="stroke-width" dur="4s"
          values={`${RING_THICKNESS * 0.6};${RING_THICKNESS};${RING_THICKNESS * 0.5};${RING_THICKNESS * 0.9};${RING_THICKNESS * 0.6}`}
          repeatCount="indefinite" />
      </circle>

      {/* Hot dot top */}
      <circle cx={SVG_C} cy={SVG_C - RING_R} r={7} fill="#FFFFFF55" filter="url(#fr-glow)">
        <animate attributeName="r" dur="3s" values="6;9;6" repeatCount="indefinite" />
        <animate attributeName="opacity" dur="3s" values="0.8;1;0.8" repeatCount="indefinite" />
      </circle>
      <circle cx={SVG_C} cy={SVG_C - RING_R} r={12} fill="#FFD166" opacity={0.45} filter="url(#fr-glow-wide)">
        <animate attributeName="r" dur="3s" values="10;16;10" repeatCount="indefinite" />
      </circle>

      {/* Hot dot bottom */}
      <circle cx={SVG_C} cy={SVG_C + RING_R} r={7} fill="#9BE7FF55" filter="url(#fr-glow)">
        <animate attributeName="r" dur="3.5s" values="6;10;6" repeatCount="indefinite" />
        <animate attributeName="opacity" dur="3.5s" values="0.8;1;0.8" repeatCount="indefinite" />
      </circle>
      <circle cx={SVG_C} cy={SVG_C + RING_R} r={12} fill="#27B0FF" opacity={0.38} filter="url(#fr-glow-wide)">
        <animate attributeName="r" dur="3.5s" values="10;18;10" repeatCount="indefinite" />
      </circle>

      {/* Orbiting ember — blue, slowed from 3s to 8s */}
      <circle r={5} fill="#9BE7FF" filter="url(#fr-glow)">
        <animateMotion dur="8s" repeatCount="indefinite"
          path={`M ${SVG_C} ${SVG_C - RING_R} a ${RING_R} ${RING_R} 0 1 1 0.001 0`} />
        <animate attributeName="r" dur="8s" values="4;7;5;8;4" repeatCount="indefinite" />
        <animate attributeName="opacity" dur="8s" values="0.6;1;0.7;1;0.6" repeatCount="indefinite" />
      </circle>

      {/* Orbiting ember — gold, slowed from 4.5s to 12s */}
      <circle r={4} fill="#FFD166" filter="url(#fr-glow)">
        <animateMotion dur="12s" repeatCount="indefinite"
          path={`M ${SVG_C} ${SVG_C + RING_R} a ${RING_R} ${RING_R} 0 1 0 0.001 0`} />
        <animate attributeName="r" dur="12s" values="3;6;4;7;3" repeatCount="indefinite" />
        <animate attributeName="opacity" dur="12s" values="0.5;1;0.6;0.9;0.5" repeatCount="indefinite" />
      </circle>

      {/* Spark streaks — slowed from 2.1s to 5s */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = SVG_C + Math.cos(rad) * (RING_R - 4);
        const y1 = SVG_C + Math.sin(rad) * (RING_R - 4);
        const x2 = SVG_C + Math.cos(rad) * (RING_R + 30);
        const y2 = SVG_C + Math.sin(rad) * (RING_R + 30);
        const delay = (i * 0.8).toFixed(2);
        return (
          <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#FFD166" strokeWidth={2} strokeLinecap="round" filter="url(#fr-glow)">
            <animate attributeName="opacity" dur="5s" begin={`${delay}s`} values="0;1;0.8;0" repeatCount="indefinite" />
            <animate attributeName="stroke-width" dur="5s" begin={`${delay}s`} values="1;3;1.5;0" repeatCount="indefinite" />
            <animate attributeName="x2" dur="5s" begin={`${delay}s`}
              values={`${x1};${x2};${SVG_C + Math.cos(rad) * (RING_R + 45)}`} repeatCount="indefinite" />
            <animate attributeName="y2" dur="5s" begin={`${delay}s`}
              values={`${y1};${y2};${SVG_C + Math.sin(rad) * (RING_R + 45)}`} repeatCount="indefinite" />
          </line>
        );
      })}

      {/* Floating embers — slowed */}
      {[45, 135, 225, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = SVG_C + Math.cos(rad) * RING_R;
        const cy = SVG_C + Math.sin(rad) * RING_R;
        return (
          <circle key={angle} cx={cx} cy={cy} r={3} fill="#FFD166" filter="url(#fr-glow)">
            <animate attributeName="opacity" dur={`${3.5 + i * 0.6}s`} values="0;1;0.7;0" repeatCount="indefinite" begin={`${i * 0.9}s`} />
            <animate attributeName="cy" dur={`${3.5 + i * 0.6}s`} values={`${cy};${cy - 20};${cy - 35}`} repeatCount="indefinite" begin={`${i * 0.9}s`} />
            <animate attributeName="r" dur={`${3.5 + i * 0.6}s`} values="3;4;1" repeatCount="indefinite" begin={`${i * 0.9}s`} />
          </circle>
        );
      })}
    </svg>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .root {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }

        .title-area { position:relative; z-index:10; text-align:center; margin-bottom:50px; }
        .title-row  { display:flex; align-items:center; justify-content:center; gap:20px; }
        .diamond    { color:#e8883a; font-size:20px; }
        .title-text { font-family:'Bebas Neue',sans-serif; font-size:clamp(34px,4.5vw,56px); color:#fff; letter-spacing:0.18em; }

        .stage-wrap {
          position:relative; z-index:10; width:100%; height:540px;
          -webkit-mask-image:linear-gradient(to right,transparent 0%,black 16%,black 84%,transparent 100%);
          mask-image:linear-gradient(to right,transparent 0%,black 16%,black 84%,transparent 100%);
        }
        .stage {
          position:relative; width:100%; height:100%;
          display:flex; align-items:center; justify-content:center;
          cursor:grab;
        }
        .stage:active { cursor:grabbing; }

        .card-item {
          position:absolute;
          display:flex; align-items:center; justify-content:center;
          will-change:transform,opacity,filter; user-select:none;
        }

        .card-wrap {
          position:relative;
          width:${CARD_SIZE}px; height:${CARD_SIZE}px;
          display:flex; align-items:center; justify-content:center;
        }

        /* Transparent logo circle — no background */
        .logo-circle {
          width:${CARD_SIZE}px; height:${CARD_SIZE}px;
          border-radius:50%;
          overflow:hidden;
          position:relative; z-index:2;
          background: transparent;
        }

        .side-ring-glow {
          position:absolute; top:50%; left:50%;
          width:${CARD_SIZE + RING_GAP * 2 + RING_THICKNESS * 2}px;
          height:${CARD_SIZE + RING_GAP * 2 + RING_THICKNESS * 2}px;
          border-radius:50%;
          border:2px solid rgba(39,176,255,0.28);
          box-shadow:0 0 14px 4px rgba(39,176,255,0.18), inset 0 0 8px 2px rgba(255,209,102,0.08);
          transform:translate(-50%,-50%);
          pointer-events:none; z-index:1;
        }

        .info-area { position:relative; z-index:10; text-align:center; margin-top:56px; padding:0 24px; max-width:600px; }
        .info-name  { font-size:clamp(20px,2.8vw,30px); font-weight:800; color:#fff; letter-spacing:.01em; margin-bottom:12px; }
        .info-desc  { font-size:14px; font-weight:300; color:rgba(255,255,255,.48); line-height:1.85; }

        .dots-row { position:relative; z-index:10; display:flex; gap:8px; margin-top:26px; align-items:center; }
        .dot      { height:6px; border-radius:99px; transition:all .42s cubic-bezier(.34,1.56,.64,1); cursor:pointer; }
        .dot.on   { width:28px; background:#fb923c; box-shadow:0 0 10px #fb923c; }
        .dot.off  { width:6px; background:rgba(255,255,255,.2); }
        .dot.off:hover { background:rgba(255,255,255,.4); }

        .progress-bar  { position:relative; z-index:10; width:120px; height:2px; background:rgba(255,255,255,.1); border-radius:99px; margin-top:12px; overflow:hidden; }
        .progress-fill { height:100%; background:linear-gradient(90deg,#27B0FF,#FFD166); border-radius:99px; animation:progressAnim ${AUTO_PLAY_INTERVAL}ms linear infinite; }

        .geo { position:absolute; inset:0; pointer-events:none; overflow:hidden; }

        @keyframes progressAnim { from{width:0%} to{width:100%} }
      `}</style>

      <div className="root" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* Geo background */}
        <div className="geo">
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.1 }}
            viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <polygon points="0,0 380,0 0,290" fill="rgba(255,255,255,0.07)" />
            <polygon points="1440,0 1060,0 1440,290" fill="rgba(255,255,255,0.07)" />
            <polygon points="0,900 280,900 0,640" fill="rgba(255,255,255,0.05)" />
            <polygon points="1440,900 1160,900 1440,640" fill="rgba(255,255,255,0.05)" />
            <line x1="0" y1="0" x2="380" y2="290" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="1440" y1="0" x2="1060" y2="290" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </svg>
        </div>

        {/* Title */}
        <div className="title-area">
          <div className="title-row">
            <span className="diamond">◆</span>
            <span className="title-text">ASSOCIATE PARTNERS</span>
            <span className="diamond">◆</span>
          </div>
        </div>

        {/* Carousel */}
        <div className="stage-wrap">
          <div className="stage" ref={stageRef}>
            {cards.map(({ partner, offset, rawIdx }) => {
              const { scale, opacity, blur, zIndex } = getVisualProps(offset);
              const isCenter = Math.abs(offset) < 0.5;
              const isSide = Math.abs(offset) >= 0.5 && Math.abs(offset) < 1.5;
              const sideGlowOpacity = isSide ? Math.max(0, 1 - Math.abs(offset)) * 0.8 : 0;

              return (
                <div
                  key={rawIdx}
                  className="card-item"
                  style={{
                    transform: `translateX(${offset * SLIDE_WIDTH}px) scale(${scale})`,
                    opacity,
                    filter: blur > 0 ? `blur(${blur}px)` : "none",
                    zIndex,
                    cursor: isCenter ? "default" : "pointer",
                  }}
                  onClick={() => {
                    if (!isCenter && !isAnimatingRef.current) {
                      stopAutoPlay();
                      goTo(Math.round(displayIndexRef.current + offset));
                      startAutoPlay();
                    }
                  }}
                >
                  <div className="card-wrap">
                    {isCenter && <FireRingSVG />}

                    {isSide && (
                      <div className="side-ring-glow" style={{ opacity: sideGlowOpacity }} />
                    )}

                    {/* Transparent logo — no white background */}
                    <div
                      className="logo-circle"
                      style={{
                        boxShadow: isCenter
                          ? "0 0 40px 8px rgba(39,176,255,0.12), 0 12px 60px rgba(0,0,0,0.3)"
                          : "none",
                      }}
                    >
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain p-4"
                        sizes={`${CARD_SIZE}px`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div className="info-area">
          <div className="info-name">{currentPartner?.name ?? ""}</div>
          <p className="info-desc">
            The 8JJ Cricket Alliance not only partners with leading entertainment
            platforms but also expands its strategic partnerships with other renowned brands.
          </p>
        </div>

        {/* Dots */}
        <div className="dots-row">
          {partners.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === centerIndex ? "on" : "off"}`}
              onClick={() => { stopAutoPlay(); goTo(i); startAutoPlay(); }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          <div key={centerIndex} className="progress-fill" />
        </div>
      </div>
    </>
  );
}