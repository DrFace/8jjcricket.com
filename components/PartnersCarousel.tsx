"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

const AUTO_PLAY_INTERVAL = 4000;
const SLIDE_WIDTH        = 320;
const CARD_SIZE          = 300;
const RING_GAP           = 18;
const RING_THICKNESS     = 14;
const LOGO_R             = CARD_SIZE / 2;
const RING_R             = LOGO_R + RING_GAP + RING_THICKNESS / 2;

export default function PartnersCarousel() {
  const [partners, setPartners]         = useState<Partner[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [centerIndex, setCenterIndex]   = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isAnimating, setIsAnimating]   = useState(false);

  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const touchStartX  = useRef<number | null>(null);
  const touchStartY  = useRef<number | null>(null);
  const stageRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/partners", {
          method: "GET", headers: { Accept: "application/json" }, cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to load partners: ${res.status}`);
        const json: PartnersApiResponse = await res.json();
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://8jjcricket.com";
        setPartners(
          json.sort((a, b) => a.sort_order - b.sort_order).map((item) => ({
            id: item.id, name: item.title,
            logo: `${backendUrl}/storage/${item.image}`, bg: "transparent",
          }))
        );
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load partners");
        setLoading(false);
      }
    })();
  }, []);

  const animateTo = useCallback((target: number) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsAnimating(true);
    const start = displayIndex, distance = target - start, duration = 500;
    const startTime = performance.now();
    const ease = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    const step = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      setDisplayIndex(start + distance * ease(p));
      if (p < 1) animFrameRef.current = requestAnimationFrame(step);
      else { setDisplayIndex(target); setIsAnimating(false); }
    };
    animFrameRef.current = requestAnimationFrame(step);
  }, [displayIndex]);

  const goTo = useCallback((nextIndex: number) => {
    if (isAnimating || partners.length === 0) return;
    const n = partners.length;
    const normalized = ((nextIndex % n) + n) % n;
    let delta = normalized - centerIndex;
    if (delta > n / 2) delta -= n;
    if (delta < -n / 2) delta += n;
    setCenterIndex(normalized);
    animateTo(displayIndex + delta);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCenterIndex((prev) => { const next = (prev + 1) % n; goTo(next); return next; });
    }, AUTO_PLAY_INTERVAL);
  }, [isAnimating, partners.length, centerIndex, displayIndex, animateTo]);

  const goNext = useCallback(() => goTo(centerIndex + 1), [goTo, centerIndex]);
  const goPrev = useCallback(() => goTo(centerIndex - 1), [goTo, centerIndex]);

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (partners.length === 0) return;
    timerRef.current = setInterval(goNext, AUTO_PLAY_INTERVAL);
  }, [partners.length, goNext]);

  useEffect(() => {
    if (partners.length > 0) startAutoPlay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [partners.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40)
      dx < 0 ? goNext() : goPrev();
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const getVisualProps = (offset: number) => {
    const abs = Math.abs(offset);
    return {
      scale:   Math.max(0.4,  1 - abs * 0.22),
      opacity: Math.max(0.15, 1 - abs * 0.35),
      blur:    Math.max(0,    (abs - 0.5) * 1.2),
      zIndex:  Math.round(10 - abs * 2),
    };
  };

  const getCards = () => {
    if (partners.length === 0) return [];
    const n = partners.length;
    return [-2, -1, 0, 1, 2].map((slot) => {
      const rawIdx = Math.round(displayIndex) + slot;
      const idx    = ((rawIdx % n) + n) % n;
      return { partner: partners[idx], offset: rawIdx - displayIndex, rawIdx };
    });
  };

  const cards          = getCards();
  const currentPartner = partners[centerIndex] ?? null;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4" />
        <p className="text-white/60 text-sm">Loading partners...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md px-6">
        <div className="text-red-500 text-5xl mb-4">⚠</div>
        <h3 className="text-white text-xl font-bold mb-2">Failed to Load Partners</h3>
        <p className="text-white/60 text-sm mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">Retry</button>
      </div>
    </div>
  );
  if (partners.length === 0) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-white/60">No partners available</p>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Neon orb variables (from codepen doc) ── */
        :root {
          --neon-orange:  #ff6b00;
          --neon-yellow:  #ffcc00;
          --neon-amber:   #ff9900;
          --neon-red:     #ff3300;
          --neon-white:   #fff5e0;
        }

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
          position:relative; z-index:10; width:100%; height:720px;
          -webkit-mask-image:linear-gradient(to right,transparent 0%,black 14%,black 86%,transparent 100%);
          mask-image:linear-gradient(to right,transparent 0%,black 14%,black 86%,transparent 100%);
        }

        .nav-arrow {
          position:absolute; top:50%; transform:translateY(-50%);
          z-index:30; width:60px; height:60px; border-radius:50%;
          background:rgba(20,25,35,0.95); backdrop-filter:blur(15px);
          border:3px solid rgba(255,153,0,0.45);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all 0.3s ease;
          color:#fff; font-size:32px; font-weight:bold; user-select:none;
          box-shadow:0 0 28px rgba(255,153,0,0.35),0 4px 20px rgba(0,0,0,0.5);
        }
        .nav-arrow:hover {
          background:rgba(255,153,0,0.95); border-color:#ffcc00;
          box-shadow:0 0 40px rgba(255,153,0,0.9),0 4px 25px rgba(0,0,0,0.6);
          transform:translateY(-50%) scale(1.15); color:#000;
        }
        .nav-arrow:active { transform:translateY(-50%) scale(0.98); }
        .nav-arrow-left  { left:40px; }
        .nav-arrow-right { right:40px; }
        @media (max-width:768px) {
          .nav-arrow { width:50px; height:50px; font-size:28px; }
          .nav-arrow-left  { left:15px; }
          .nav-arrow-right { right:15px; }
        }

        .stage {
          position:relative; width:100%; height:100%;
          display:flex; align-items:center; justify-content:center; cursor:grab;
        }
        .stage:active { cursor:grabbing; }

        .card-item {
          position:absolute; display:flex; align-items:center; justify-content:center;
          will-change:transform,opacity,filter; user-select:none;
        }

        .card-wrap {
          position:relative; width:${CARD_SIZE}px; height:${CARD_SIZE}px;
          display:flex; align-items:center; justify-content:center;
        }

        /* ══════════════════════════════════════════════════════════════
           NEON ORB RING — always active, no hover needed
           Ported directly from the codepen orb-button system:
           • ::before = rotating conic-gradient border (orbRotate)
           • ::after  = radial inner glow fill
           • logoPulse = outer box-shadow pulsing between two neon colors
           • Extra spinning arc layers for the multi-ring effect
        ══════════════════════════════════════════════════════════════ */

        /* Outer glow wrapper — this IS the orb ring */
        .neon-orb-ring {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width:  ${CARD_SIZE + (RING_GAP + RING_THICKNESS) * 2}px;
          height: ${CARD_SIZE + (RING_GAP + RING_THICKNESS) * 2}px;
          border-radius: 50%;
          z-index: 4;
          pointer-events: none;
        }

        /* Rotating conic-gradient border — the signature codepen effect */
        .neon-orb-ring::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          padding: 3px;
          background: conic-gradient(
            var(--neon-orange),
            var(--neon-yellow),
            var(--neon-white),
            var(--neon-amber),
            var(--neon-red),
            var(--neon-orange)
          );
          /* mask-composite trick to show only the border, not the fill */
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: orbRotate 3s linear infinite;
        }

        /* Radial inner glow — replicates the orb::after radial fill glow */
        .neon-orb-ring::after {
          content: "";
          position: absolute;
          inset: 4px;
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 55%),
            radial-gradient(circle at center, rgba(255,120,0,0.22), rgba(255,60,0,0.10) 60%, transparent 80%);
          animation: orbPulse 2.5s ease-in-out infinite;
        }

        /* Second spinning arc ring — slower, opposite direction */
        .neon-orb-ring-2 {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width:  ${CARD_SIZE + (RING_GAP + RING_THICKNESS) * 2 + 12}px;
          height: ${CARD_SIZE + (RING_GAP + RING_THICKNESS) * 2 + 12}px;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color:    var(--neon-yellow);
          border-right-color:  var(--neon-yellow);
          border-bottom-color: transparent;
          border-left-color:   transparent;
          z-index: 3;
          pointer-events: none;
          animation: orbRotateReverse 4.5s linear infinite;
          box-shadow: 0 0 12px rgba(255,200,0,0.5), inset 0 0 12px rgba(255,200,0,0.15);
        }

        /* Third arc — faster, different color */
        .neon-orb-ring-3 {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width:  ${CARD_SIZE + (RING_GAP + RING_THICKNESS) * 2 + 24}px;
          height: ${CARD_SIZE + (RING_GAP + RING_THICKNESS) * 2 + 24}px;
          border-radius: 50%;
          border: 2px solid transparent;
          border-bottom-color: var(--neon-orange);
          border-left-color:   var(--neon-orange);
          border-top-color:    transparent;
          border-right-color:  transparent;
          z-index: 3;
          pointer-events: none;
          animation: orbRotate 2s linear infinite;
          box-shadow: 0 0 16px rgba(255,107,0,0.6), inset 0 0 16px rgba(255,107,0,0.2);
        }

        /* Pulsing outer glow ring — replicates logoPulse box-shadow */
        .neon-orb-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width:  ${CARD_SIZE + (RING_GAP + RING_THICKNESS) * 2}px;
          height: ${CARD_SIZE + (RING_GAP + RING_THICKNESS) * 2}px;
          border-radius: 50%;
          z-index: 2;
          pointer-events: none;
          animation: logoPulse 2.5s ease-in-out infinite;
        }

        /* Side cards — subtle static neon ring (no animation, lower opacity) */
        .side-neon-ring {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width:  ${CARD_SIZE + (RING_GAP + RING_THICKNESS) * 2}px;
          height: ${CARD_SIZE + (RING_GAP + RING_THICKNESS) * 2}px;
          border-radius: 50%;
          border: 2px solid rgba(255, 120, 0, 0.25);
          box-shadow: 0 0 18px rgba(255,107,0,0.18), inset 0 0 18px rgba(255,107,0,0.08);
          pointer-events: none;
          z-index: 1;
        }

        .logo-circle {
          width:  ${CARD_SIZE}px;
          height: ${CARD_SIZE}px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          z-index: 6;
          background: transparent;
          border: none; outline: none; box-shadow: none;
        }

        /* ── Keyframes (direct ports from the codepen) ── */

        /* orbRotate: the spinning conic border */
        @keyframes orbRotate {
          to { transform: rotate(360deg); }
        }

        @keyframes orbRotateReverse {
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        /* logoPulse: outer box-shadow alternates between two neon colours */
        @keyframes logoPulse {
          0%, 100% {
            box-shadow:
              0 0 25px  var(--neon-orange),
              0 0 50px  rgba(255,107,0,0.5),
              0 0 80px  rgba(255,107,0,0.25),
              inset 0 0 30px rgba(255,107,0,0.12);
          }
          50% {
            box-shadow:
              0 0 35px  var(--neon-yellow),
              0 0 70px  rgba(255,200,0,0.6),
              0 0 110px rgba(255,200,0,0.3),
              inset 0 0 40px rgba(255,200,0,0.15);
          }
        }

        /* Inner radial glow breathe */
        @keyframes orbPulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1.0; }
        }

        /* ── Rest of layout ── */
        .info-area { position:relative; z-index:10; text-align:center; padding:0 24px; max-width:600px; }
        .info-name  { font-size:clamp(20px,2.8vw,30px); font-weight:800; color:#fff; letter-spacing:.01em; margin-bottom:12px; }
        .info-desc  { font-size:14px; font-weight:300; color:rgba(255,255,255,.48); line-height:1.85; }

        .dots-row { position:relative; z-index:10; display:flex; gap:8px; margin-top:26px; align-items:center; }
        .dot      { height:6px; border-radius:99px; transition:all .42s cubic-bezier(.34,1.56,.64,1); cursor:pointer; }
        .dot.on   { width:28px; background:#fb923c; box-shadow:0 0 10px #fb923c; }
        .dot.off  { width:6px;  background:rgba(255,255,255,.2); }
        .dot.off:hover { background:rgba(255,255,255,.4); }

        .progress-bar  { position:relative; z-index:10; width:120px; height:2px; background:rgba(255,255,255,.1); border-radius:99px; margin-top:12px; overflow:hidden; }
        .progress-fill { height:100%; background:linear-gradient(90deg,#fb923c,#f97316); border-radius:99px; animation:progressAnim 4000ms linear infinite; }

        .geo { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
        @keyframes progressAnim { from{width:0%} to{width:100%} }
      `}</style>

      <div className="root" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

        <div className="geo">
          <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.1 }}
            viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <polygon points="0,0 380,0 0,290"           fill="rgba(255,255,255,0.07)" />
            <polygon points="1440,0 1060,0 1440,290"     fill="rgba(255,255,255,0.07)" />
            <polygon points="0,900 280,900 0,640"        fill="rgba(255,255,255,0.05)" />
            <polygon points="1440,900 1160,900 1440,640" fill="rgba(255,255,255,0.05)" />
            <line x1="0"    y1="0" x2="380"  y2="290" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            <line x1="1440" y1="0" x2="1060" y2="290" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          </svg>
        </div>

        <div className="title-area">
          <div className="title-row">
            <span className="diamond">◆</span>
            <span className="title-text">ASSOCIATE PARTNERS</span>
            <span className="diamond">◆</span>
          </div>
        </div>

        <div className="stage-wrap">
          <div className="nav-arrow nav-arrow-left"
            onClick={() => { goTo((centerIndex-1+partners.length)%partners.length); startAutoPlay(); }}>‹</div>
          <div className="nav-arrow nav-arrow-right"
            onClick={() => { goTo((centerIndex+1)%partners.length); startAutoPlay(); }}>›</div>

          <div className="stage" ref={stageRef}>
            {cards.map(({ partner, offset, rawIdx }) => {
              const { scale, opacity, blur, zIndex } = getVisualProps(offset);
              const isCenter = Math.abs(offset) < 0.5;
              const isSide   = Math.abs(offset) >= 0.5 && Math.abs(offset) < 1.5;
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
                    if (!isCenter && !isAnimating) {
                      goTo(Math.round(displayIndex + offset));
                      startAutoPlay();
                    }
                  }}
                >
                  <div className="card-wrap">

                    {/* ── CENTRE card: full neon orb ring system ── */}
                    {isCenter && (
                      <>
                        {/* Pulsing outer glow halo */}
                        <div className="neon-orb-glow" />
                        {/* Spinning arc 3 (bottom-left, orange, fast) */}
                        <div className="neon-orb-ring-3" />
                        {/* Spinning arc 2 (top-right, yellow, slow reverse) */}
                        <div className="neon-orb-ring-2" />
                        {/* Main spinning conic border + inner radial fill */}
                        <div className="neon-orb-ring" />
                      </>
                    )}

                    {/* ── SIDE cards: static dim neon ring ── */}
                    {isSide && (
                      <div className="side-neon-ring" style={{ opacity: sideGlowOpacity }} />
                    )}

                    <div className="logo-circle">
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

        <div className="info-area">
          <div className="info-name">{currentPartner?.name ?? ""}</div>
          <p className="info-desc">
            The 8JJ Cricket Alliance not only partners with leading entertainment platforms
            but also expands its strategic partnerships with other renowned brands.
          </p>
        </div>

        <div className="dots-row">
          {partners.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === centerIndex ? "on" : "off"}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <div className="progress-bar">
          <div key={centerIndex} className="progress-fill" />
        </div>
      </div>
    </>
  );
}