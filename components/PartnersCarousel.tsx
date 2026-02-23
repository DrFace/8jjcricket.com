// // components/PartnersCarousel.tsx
// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import Image from "next/image";

// type Partner = {
//   id: number;
//   name: string;
//   logo: string;
//   bg: string;
// };

// type PartnersApiResponse = Array<{
//   id: number;
//   title: string;
//   image: string;
//   link: string | null;
//   sort_order: number;
// }>;

// const AUTO_PLAY_INTERVAL = 4000;
// const SLIDE_WIDTH = 320;
// const CARD_SIZE = 300;
// const RING_GAP = 18;
// const RING_THICKNESS = 22;

// const LOGO_R = CARD_SIZE / 2;
// const RING_R = LOGO_R + RING_GAP + RING_THICKNESS / 2;
// const SVG_PAD = 80;
// const SVG_SIZE = (RING_R + RING_THICKNESS / 2 + SVG_PAD) * 2;
// const SVG_C = SVG_SIZE / 2;

// export default function PartnersCarousel() {
//   const [partners, setPartners] = useState<Partner[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [centerIndex, setCenterIndex] = useState(0);
//   const [displayIndex, setDisplayIndex] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);

//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const animFrameRef = useRef<number | null>(null);
//   const touchStartX = useRef<number | null>(null);
//   const touchStartY = useRef<number | null>(null);
//   const stageRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchPartners = async () => {
//       try {
//         const res = await fetch("/api/partners", {
//           method: "GET",
//           headers: { Accept: "application/json" },
//           cache: "no-store",
//         });
//         if (!res.ok) throw new Error(`Failed to load partners: ${res.status}`);
//         const json: PartnersApiResponse = await res.json();
//         const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://8jjcricket.com";
//         const partnersData = json
//           .sort((a, b) => a.sort_order - b.sort_order)
//           .map((item) => ({
//             id: item.id,
//             name: item.title,
//             logo: `${backendUrl}/storage/${item.image}`,
//             // ── CHANGED: transparent/glass bg instead of white ──
//             bg: "transparent",
//           }));
//         setPartners(partnersData);
//         setLoading(false);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to load partners");
//         setLoading(false);
//       }
//     };
//     fetchPartners();
//   }, []);

//   const animateTo = useCallback(
//     (target: number) => {
//       if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
//       setIsAnimating(true);
//       const start = displayIndex;
//       const distance = target - start;
//       const duration = 500;
//       const startTime = performance.now();
//       const ease = (t: number) =>
//         t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
//       const step = (now: number) => {
//         const p = Math.min((now - startTime) / duration, 1);
//         setDisplayIndex(start + distance * ease(p));
//         if (p < 1) {
//           animFrameRef.current = requestAnimationFrame(step);
//         } else {
//           setDisplayIndex(target);
//           setIsAnimating(false);
//         }
//       };
//       animFrameRef.current = requestAnimationFrame(step);
//     },
//     [displayIndex]
//   );

//   const goTo = useCallback(
//     (nextIndex: number) => {
//       if (isAnimating || partners.length === 0) return;
//       const n = partners.length;
//       const normalized = ((nextIndex % n) + n) % n;
//       let delta = normalized - centerIndex;
//       if (delta > n / 2) delta -= n;
//       if (delta < -n / 2) delta += n;
//       setCenterIndex(normalized);
//       animateTo(displayIndex + delta);
//       if (timerRef.current) clearInterval(timerRef.current);
//       timerRef.current = setInterval(() => {
//         setCenterIndex((prev) => {
//           const next = (prev + 1) % n;
//           goTo(next);
//           return next;
//         });
//       }, AUTO_PLAY_INTERVAL);
//     },
//     [isAnimating, partners.length, centerIndex, displayIndex, animateTo]
//   );

//   const goNext = useCallback(() => goTo(centerIndex + 1), [goTo, centerIndex]);
//   const goPrev = useCallback(() => goTo(centerIndex - 1), [goTo, centerIndex]);

//   const startAutoPlay = useCallback(() => {
//     if (timerRef.current) clearInterval(timerRef.current);
//     if (partners.length === 0) return;
//     timerRef.current = setInterval(goNext, AUTO_PLAY_INTERVAL);
//   }, [partners.length, goNext]);

//   useEffect(() => {
//     if (partners.length > 0) startAutoPlay();
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//       if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
//     };
//   }, [partners.length]);

//   useEffect(() => {
//     const handleKey = (e: KeyboardEvent) => {
//       if (e.key === "ArrowRight") goNext();
//       if (e.key === "ArrowLeft") goPrev();
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [goNext, goPrev]);

//   const onTouchStart = (e: React.TouchEvent) => {
//     touchStartX.current = e.touches[0].clientX;
//     touchStartY.current = e.touches[0].clientY;
//   };
//   const onTouchEnd = (e: React.TouchEvent) => {
//     if (touchStartX.current === null || touchStartY.current === null) return;
//     const dx = e.changedTouches[0].clientX - touchStartX.current;
//     const dy = e.changedTouches[0].clientY - touchStartY.current;
//     if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40)
//       dx < 0 ? goNext() : goPrev();
//     touchStartX.current = null;
//     touchStartY.current = null;
//   };

//   const getVisualProps = (offset: number) => {
//     const abs = Math.abs(offset);
//     return {
//       scale: Math.max(0.4, 1 - abs * 0.22),
//       opacity: Math.max(0.15, 1 - abs * 0.35),
//       blur: Math.max(0, (abs - 0.5) * 1.2),
//       zIndex: Math.round(10 - abs * 2),
//     };
//   };

//   const getCards = () => {
//     if (partners.length === 0) return [];
//     const n = partners.length;
//     return [-2, -1, 0, 1, 2].map((slot) => {
//       const rawIdx = Math.round(displayIndex) + slot;
//       const idx = ((rawIdx % n) + n) % n;
//       return { partner: partners[idx], offset: rawIdx - displayIndex, rawIdx };
//     });
//   };

//   const cards = getCards();
//   const currentPartner = partners[centerIndex] ?? null;

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4" />
//           <p className="text-white/60 text-sm">Loading partners...</p>
//         </div>
//       </div>
//     );
//   if (error)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center max-w-md px-6">
//           <div className="text-red-500 text-5xl mb-4">⚠</div>
//           <h3 className="text-white text-xl font-bold mb-2">Failed to Load Partners</h3>
//           <p className="text-white/60 text-sm mb-6">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   if (partners.length === 0)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-white/60">No partners available</p>
//       </div>
//     );

//   const FireRingSVG = () => (
//     <svg
//       width={SVG_SIZE}
//       height={SVG_SIZE}
//       viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
//       style={{
//         position: "absolute",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//         pointerEvents: "none",
//         zIndex: 5,
//         overflow: "visible",
//       }}
//     >
//       <defs>
//         <filter id="fr-turbulence" x="-30%" y="-30%" width="160%" height="160%">
//           <feTurbulence type="turbulence" baseFrequency="0.025" numOctaves="3" seed="2" result="turb">
//             <animate attributeName="baseFrequency" dur="4s" values="0.025;0.015;0.03;0.02;0.025" repeatCount="indefinite" />
//             <animate attributeName="seed" dur="3s" values="2;8;4;11;2" repeatCount="indefinite" />
//           </feTurbulence>
//           <feDisplacementMap in="SourceGraphic" in2="turb" scale="14" xChannelSelector="R" yChannelSelector="G" />
//         </filter>
//         <filter id="fr-glow" x="-40%" y="-40%" width="180%" height="180%">
//           <feGaussianBlur stdDeviation="6" result="blur" />
//           <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
//         </filter>
//         <filter id="fr-glow-wide" x="-60%" y="-60%" width="220%" height="220%">
//           <feGaussianBlur stdDeviation="14" />
//         </filter>
//         <linearGradient id="fr-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
//           <stop offset="0%"   stopColor="#ff2200" />
//           <stop offset="25%"  stopColor="#ff7700" />
//           <stop offset="50%"  stopColor="#ffdd00" />
//           <stop offset="75%"  stopColor="#ff7700" />
//           <stop offset="100%" stopColor="#ff2200" />
//         </linearGradient>
//         <linearGradient id="fr-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
//           <stop offset="0%"   stopColor="#ffaa00" />
//           <stop offset="33%"  stopColor="#ffffff" />
//           <stop offset="66%"  stopColor="#ffee00" />
//           <stop offset="100%" stopColor="#ffaa00" />
//         </linearGradient>
//         <clipPath id="fr-ring-clip">
//           <path
//             d={`M 0 0 H ${SVG_SIZE} V ${SVG_SIZE} H 0 Z
//                 M ${SVG_C} ${SVG_C} m -${LOGO_R} 0
//                 a ${LOGO_R},${LOGO_R} 0 1,0 ${LOGO_R * 2},0
//                 a ${LOGO_R},${LOGO_R} 0 1,0 -${LOGO_R * 2},0`}
//             fillRule="evenodd"
//           />
//         </clipPath>
//       </defs>

//       <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none" stroke="#ff5500" strokeWidth={RING_THICKNESS * 3} opacity={0.35} filter="url(#fr-glow-wide)" clipPath="url(#fr-ring-clip)" />
//       <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none" stroke="url(#fr-grad-1)" strokeWidth={RING_THICKNESS + 4} opacity={0.9} filter="url(#fr-glow)" clipPath="url(#fr-ring-clip)">
//         <animateTransform attributeName="transform" type="rotate" from={`0 ${SVG_C} ${SVG_C}`} to={`360 ${SVG_C} ${SVG_C}`} dur="6s" repeatCount="indefinite" />
//       </circle>
//       <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none" stroke="url(#fr-grad-1)" strokeWidth={RING_THICKNESS} opacity={0.95} filter="url(#fr-turbulence)" clipPath="url(#fr-ring-clip)">
//         <animateTransform attributeName="transform" type="rotate" from={`0 ${SVG_C} ${SVG_C}`} to={`-360 ${SVG_C} ${SVG_C}`} dur="4s" repeatCount="indefinite" />
//       </circle>
//       <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none" stroke="url(#fr-grad-2)" strokeWidth={RING_THICKNESS * 0.45} opacity={0.85} filter="url(#fr-turbulence)" clipPath="url(#fr-ring-clip)">
//         <animateTransform attributeName="transform" type="rotate" from={`180 ${SVG_C} ${SVG_C}`} to={`-180 ${SVG_C} ${SVG_C}`} dur="2.5s" repeatCount="indefinite" />
//       </circle>
//       <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none" stroke="#ffcc44" strokeWidth={RING_THICKNESS * 0.6} filter="url(#fr-glow)" clipPath="url(#fr-ring-clip)">
//         <animate attributeName="opacity" dur="1.6s" values="0.3;0.9;0.5;1;0.3" repeatCount="indefinite" />
//         <animate attributeName="stroke-width" dur="1.6s" values={`${RING_THICKNESS * 0.6};${RING_THICKNESS};${RING_THICKNESS * 0.5};${RING_THICKNESS * 0.9};${RING_THICKNESS * 0.6}`} repeatCount="indefinite" />
//       </circle>

//       <circle cx={SVG_C} cy={SVG_C - RING_R} r={7} fill="#ffffff" filter="url(#fr-glow)">
//         <animate attributeName="r" dur="1.2s" values="6;9;6" repeatCount="indefinite" />
//         <animate attributeName="opacity" dur="1.2s" values="0.8;1;0.8" repeatCount="indefinite" />
//       </circle>
//       <circle cx={SVG_C} cy={SVG_C - RING_R} r={12} fill="#ff8800" opacity={0.5} filter="url(#fr-glow-wide)">
//         <animate attributeName="r" dur="1.2s" values="10;16;10" repeatCount="indefinite" />
//       </circle>
//       <circle cx={SVG_C} cy={SVG_C + RING_R} r={7} fill="#ffffff" filter="url(#fr-glow)">
//         <animate attributeName="r" dur="1.4s" values="6;10;6" repeatCount="indefinite" />
//         <animate attributeName="opacity" dur="1.4s" values="0.8;1;0.8" repeatCount="indefinite" />
//       </circle>
//       <circle cx={SVG_C} cy={SVG_C + RING_R} r={12} fill="#ff8800" opacity={0.5} filter="url(#fr-glow-wide)">
//         <animate attributeName="r" dur="1.4s" values="10;18;10" repeatCount="indefinite" />
//       </circle>

//       <circle r={5} fill="#ffee44" filter="url(#fr-glow)">
//         <animateMotion dur="3s" repeatCount="indefinite" path={`M ${SVG_C} ${SVG_C - RING_R} a ${RING_R} ${RING_R} 0 1 1 0.001 0`} />
//         <animate attributeName="r" dur="3s" values="4;7;5;8;4" repeatCount="indefinite" />
//         <animate attributeName="opacity" dur="3s" values="0.6;1;0.7;1;0.6" repeatCount="indefinite" />
//       </circle>
//       <circle r={4} fill="#ff9900" filter="url(#fr-glow)">
//         <animateMotion dur="4.5s" repeatCount="indefinite" path={`M ${SVG_C} ${SVG_C + RING_R} a ${RING_R} ${RING_R} 0 1 0 0.001 0`} />
//         <animate attributeName="r" dur="4.5s" values="3;6;4;7;3" repeatCount="indefinite" />
//         <animate attributeName="opacity" dur="4.5s" values="0.5;1;0.6;0.9;0.5" repeatCount="indefinite" />
//       </circle>

//       {[0, 60, 120, 180, 240, 300].map((angle, i) => {
//         const rad = (angle * Math.PI) / 180;
//         const x1 = SVG_C + Math.cos(rad) * (RING_R - 4);
//         const y1 = SVG_C + Math.sin(rad) * (RING_R - 4);
//         const x2 = SVG_C + Math.cos(rad) * (RING_R + 30);
//         const y2 = SVG_C + Math.sin(rad) * (RING_R + 30);
//         const delay = (i * 0.35).toFixed(2);
//         return (
//           <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffee00" strokeWidth={2} strokeLinecap="round" filter="url(#fr-glow)">
//             <animate attributeName="opacity" dur="2.1s" begin={`${delay}s`} values="0;1;0.8;0" repeatCount="indefinite" />
//             <animate attributeName="stroke-width" dur="2.1s" begin={`${delay}s`} values="1;3;1.5;0" repeatCount="indefinite" />
//             <animate attributeName="x2" dur="2.1s" begin={`${delay}s`} values={`${x1};${x2};${SVG_C + Math.cos(rad) * (RING_R + 45)}`} repeatCount="indefinite" />
//             <animate attributeName="y2" dur="2.1s" begin={`${delay}s`} values={`${y1};${y2};${SVG_C + Math.sin(rad) * (RING_R + 45)}`} repeatCount="indefinite" />
//           </line>
//         );
//       })}

//       {[45, 135, 225, 315].map((angle, i) => {
//         const rad = (angle * Math.PI) / 180;
//         const cx = SVG_C + Math.cos(rad) * RING_R;
//         const cy = SVG_C + Math.sin(rad) * RING_R;
//         return (
//           <circle key={angle} cx={cx} cy={cy} r={3} fill="#ffcc00" filter="url(#fr-glow)">
//             <animate attributeName="opacity" dur={`${1.5 + i * 0.3}s`} values="0;1;0.7;0" repeatCount="indefinite" begin={`${i * 0.4}s`} />
//             <animate attributeName="cy" dur={`${1.5 + i * 0.3}s`} values={`${cy};${cy - 20};${cy - 35}`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
//             <animate attributeName="r" dur={`${1.5 + i * 0.3}s`} values="3;4;1" repeatCount="indefinite" begin={`${i * 0.4}s`} />
//           </circle>
//         );
//       })}
//     </svg>
//   );

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&family=Bebas+Neue&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }

//         .root {
//           font-family: 'Inter', sans-serif;
//           min-height: 100vh;
//           display: flex; flex-direction: column; align-items: center; justify-content: center;
//           position: relative; overflow: hidden;
//         }

//         .title-area { position:relative; z-index:10; text-align:center; margin-bottom:50px; }
//         .title-row  { display:flex; align-items:center; justify-content:center; gap:20px; }
//         .diamond    { color:#e8883a; font-size:20px; }
//         .title-text { font-family:'Bebas Neue',sans-serif; font-size:clamp(34px,4.5vw,56px); color:#fff; letter-spacing:0.18em; }

//         .stage-wrap {
//           position:relative; z-index:10; width:100%; height:440px;
//           -webkit-mask-image:linear-gradient(to right,transparent 0%,black 16%,black 84%,transparent 100%);
//           mask-image:linear-gradient(to right,transparent 0%,black 16%,black 84%,transparent 100%);
//         }
//         .stage {
//           position:relative; width:100%; height:100%;
//           display:flex; align-items:center; justify-content:center; cursor:grab;
//         }
//         .stage:active { cursor:grabbing; }

//         .card-item {
//           position:absolute; display:flex; align-items:center; justify-content:center;
//           will-change:transform,opacity,filter; user-select:none;
//         }

//         .card-wrap {
//           position:relative;
//           width:${CARD_SIZE}px; height:${CARD_SIZE}px;
//           display:flex; align-items:center; justify-content:center;
//         }

//         /* ── CHANGED: logo circle is now transparent / glass ── */
//         .logo-circle {
//           width:${CARD_SIZE}px; height:${CARD_SIZE}px;
//           border-radius:50%;
//           overflow:hidden;
//           position:relative; z-index:2;
//           /* No background — fully transparent so page bg shows through */
//         }

//         /* Center card gets a very subtle dark glass tint so the logo
//            stands out against the fire ring without going back to white */
//         .logo-circle-center {
//           /* Soft frosted-dark glass — just enough to separate logo from bg */
//           background: rgba(10, 34, 80, 0) !important;
//           backdrop-filter: blur(2px);
//           -webkit-backdrop-filter: blur(2px);
//         }

//         /* Side cards: fully transparent — logo floats freely */
//         .logo-circle-side {
//           background: transparent !important;
//         }

//         .side-ring-glow {
//           position:absolute; top:50%; left:50%;
//           width:${CARD_SIZE + RING_GAP * 15 + RING_THICKNESS * 15}px;
//           height:${CARD_SIZE + RING_GAP * 15 + RING_THICKNESS * 15}px;
//           border-radius:50%;
//           border:2px solid rgba(255,120,0,0.35);
//           box-shadow:0 0 14px 4px rgba(255,80,0,0.25), inset 0 0 8px 2px rgba(255,100,0,0.1);
//           transform:translate(-50%,-50%);
//           pointer-events:none; z-index:1;
//         }

//         .info-area { position:relative; z-index:10; text-align:center; margin-top:56px; padding:0 24px; max-width:600px; }
//         .info-name  { font-size:clamp(20px,2.8vw,30px); font-weight:800; color:#fff; letter-spacing:.01em; margin-bottom:12px; }
//         .info-desc  { font-size:14px; font-weight:300; color:rgba(255,255,255,.48); line-height:1.85; }

//         .dots-row { position:relative; z-index:10; display:flex; gap:8px; margin-top:26px; align-items:center; }
//         .dot      { height:6px; border-radius:99px; transition:all .42s cubic-bezier(.34,1.56,.64,1); cursor:pointer; }
//         .dot.on   { width:28px; background:#fb923c; box-shadow:0 0 10px #fb923c; }
//         .dot.off  { width:6px; background:rgba(255,255,255,.2); }
//         .dot.off:hover { background:rgba(255,255,255,.4); }

//         .progress-bar  { position:relative; z-index:10; width:120px; height:2px; background:rgba(255,255,255,.1); border-radius:99px; margin-top:12px; overflow:hidden; }
//         .progress-fill { height:100%; background:linear-gradient(90deg,#fb923c,#f97316); border-radius:99px; animation:progressAnim 4000ms linear infinite; }

//         .geo { position:absolute; inset:0; pointer-events:none; overflow:hidden; }

//         @keyframes progressAnim { from{width:0%} to{width:100%} }
//       `}</style>

//       <div className="root" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

//         <div className="geo">
//           <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.1 }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
//             <polygon points="0,0 380,0 0,290"        fill="rgba(255,255,255,0.07)" />
//             <polygon points="1440,0 1060,0 1440,290"  fill="rgba(255,255,255,0.07)" />
//             <polygon points="0,900 280,900 0,640"     fill="rgba(255,255,255,0.05)" />
//             <polygon points="1440,900 1160,900 1440,640" fill="rgba(255,255,255,0.05)" />
//             <line x1="0" y1="0" x2="380" y2="290"   stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
//             <line x1="1440" y1="0" x2="1060" y2="290" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
//           </svg>
//         </div>

//         <div className="title-area">
//           <div className="title-row">
//             <span className="diamond">◆</span>
//             <span className="title-text">ASSOCIATE PARTNERS</span>
//             <span className="diamond">◆</span>
//           </div>
//         </div>

//         <div className="stage-wrap">
//           <div className="stage" ref={stageRef}>
//             {cards.map(({ partner, offset, rawIdx }) => {
//               const { scale, opacity, blur, zIndex } = getVisualProps(offset);
//               const isCenter = Math.abs(offset) < 0.5;
//               const isSide   = Math.abs(offset) >= 0.5 && Math.abs(offset) < 1.5;
//               const sideGlowOpacity = isSide ? Math.max(0, 1 - Math.abs(offset)) * 0.8 : 0;

//               return (
//                 <div
//                   key={rawIdx}
//                   className="card-item"
//                   style={{
//                     transform: `translateX(${offset * SLIDE_WIDTH}px) scale(${scale})`,
//                     opacity,
//                     filter: blur > 0 ? `blur(${blur}px)` : "none",
//                     zIndex,
//                     cursor: isCenter ? "default" : "pointer",
//                   }}
//                   onClick={() => {
//                     if (!isCenter && !isAnimating) {
//                       goTo(Math.round(displayIndex + offset));
//                       startAutoPlay();
//                     }
//                   }}
//                 >
//                   <div className="card-wrap">

//                     {isCenter && <FireRingSVG />}

//                     {isSide && (
//                       <div className="side-ring-glow" style={{ opacity: sideGlowOpacity }} />
//                     )}

//                     {/* ── CHANGED: transparent logo circle ── */}
//                     <div
//                       className={`logo-circle ${isCenter ? "logo-circle-center" : "logo-circle-side"}`}
//                       style={{
//                         // No background override here — handled by CSS classes above
//                         boxShadow: isCenter
//                           ? "0 0 40px 8px rgba(255, 119, 0, 0.61), 0 12px 60px rgba(172, 163, 163, 0.7)"
//                           : "none",
//                       }}
//                     >
//                       <Image
//                         src={partner.logo}
//                         alt={partner.name}
//                         fill
//                         className="object-contain p-4"
//                         sizes={`${CARD_SIZE}px`}
//                       />
//                     </div>

//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="info-area">
//           <div className="info-name">{currentPartner?.name ?? ""}</div>
//           <p className="info-desc">
//             The 8JJ Cricket Alliance not only partners with leading entertainment platforms
//             but also expands its strategic partnerships with other renowned brands.
//           </p>
//         </div>

//         <div className="dots-row">
//           {partners.map((_, i) => (
//             <div
//               key={i}
//               className={`dot ${i === centerIndex ? "on" : "off"}`}
//               onClick={() => goTo(i)}
//             />
//           ))}
//         </div>

//         <div className="progress-bar">
//           <div key={centerIndex} className="progress-fill" />
//         </div>
//       </div>
//     </>
//   );
// }


// components/PartnersCarousel.tsx
// components/PartnersCarousel.tsx
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
const SLIDE_WIDTH = 320;
const CARD_SIZE = 300;

// ── Ring geometry ──
const RING_GAP       = 28;
const RING_THICKNESS = 38;

const LOGO_R   = CARD_SIZE / 2;
const RING_R   = LOGO_R + RING_GAP + RING_THICKNESS / 2;
const SVG_PAD  = 100;
const SVG_SIZE = (RING_R + RING_THICKNESS / 2 + SVG_PAD) * 2;
const SVG_C    = SVG_SIZE / 2;

export default function PartnersCarousel() {
  const [partners, setPartners]     = useState<Partner[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isAnimating, setIsAnimating]   = useState(false);

  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const touchStartX  = useRef<number | null>(null);
  const touchStartY  = useRef<number | null>(null);
  const stageRef     = useRef<HTMLDivElement>(null);

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
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://8jjcricket.com";
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

  const animateTo = useCallback(
    (target: number) => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setIsAnimating(true);
      const start = displayIndex;
      const distance = target - start;
      const duration = 500;
      const startTime = performance.now();
      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const step = (now: number) => {
        const p = Math.min((now - startTime) / duration, 1);
        setDisplayIndex(start + distance * ease(p));
        if (p < 1) animFrameRef.current = requestAnimationFrame(step);
        else { setDisplayIndex(target); setIsAnimating(false); }
      };
      animFrameRef.current = requestAnimationFrame(step);
    },
    [displayIndex]
  );

  const goTo = useCallback(
    (nextIndex: number) => {
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
    },
    [isAnimating, partners.length, centerIndex, displayIndex, animateTo]
  );

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

  // ── Spark positions: 12 sparks evenly around ring ──
  const SPARK_ANGLES  = Array.from({ length: 12 }, (_, i) => i * 30);
  // ── Ember positions: 8 embers ──
  const EMBER_ANGLES  = Array.from({ length: 8  }, (_, i) => i * 45);

  const FireRingSVG = () => (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 5,
        overflow: "visible",
      }}
    >
      <defs>
        {/* 
          CHANGE: Slowed turbulence animation durations (2–3× longer).
          CHANGE: Reduced displacement scale from 22→14 and 18→11 for calmer distortion.
        */}
        <filter id="fr-turb" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="turbulence" baseFrequency="0.016" numOctaves="4" seed="3" result="turb">
            <animate attributeName="baseFrequency" dur="8s"
              values="0.016;0.009;0.02;0.012;0.016" repeatCount="indefinite" />
            <animate attributeName="seed" dur="7s"
              values="3;9;5;13;3" repeatCount="indefinite" />
          </feTurbulence>
          {/* CHANGE: scale 22 → 14 */}
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="14"
            xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="fr-turb2" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.010" numOctaves="3" seed="7" result="turb">
            <animate attributeName="baseFrequency" dur="10s"
              values="0.010;0.018;0.007;0.015;0.010" repeatCount="indefinite" />
            <animate attributeName="seed" dur="9s"
              values="7;2;11;4;7" repeatCount="indefinite" />
          </feTurbulence>
          {/* CHANGE: scale 18 → 11 */}
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="11"
            xChannelSelector="G" yChannelSelector="R" />
        </filter>

        <filter id="fr-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="fr-glow-wide" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="20" />
        </filter>

        <filter id="fr-glow-haze" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="35" />
        </filter>

        <filter id="fr-dot-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 
          CHANGE: Gradients shifted from harsh red (#ff1100) toward amber/gold tones.
          Deep reds replaced with warm orange-ambers. Opacity pulled back on outer layers.
        */}
        <linearGradient id="fr-grad-hot" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#cc5500" />   {/* was #ff1100 */}
          <stop offset="20%"  stopColor="#e87020" />   {/* was #ff5500 */}
          <stop offset="40%"  stopColor="#f5a030" />   {/* was #ff9900 */}
          <stop offset="50%"  stopColor="#ffd060" />   {/* was #ffee00 */}
          <stop offset="60%"  stopColor="#f5a030" />
          <stop offset="80%"  stopColor="#e87020" />
          <stop offset="100%" stopColor="#cc5500" />
        </linearGradient>

        <linearGradient id="fr-grad-white" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#f5c060" />   {/* was #ffcc00 */}
          <stop offset="25%"  stopColor="#fff8e0" />   {/* was #ffffff — softer white */}
          <stop offset="50%"  stopColor="#ffeeaa" />   {/* was #ffff88 */}
          <stop offset="75%"  stopColor="#fff8e0" />
          <stop offset="100%" stopColor="#f5c060" />
        </linearGradient>

        <linearGradient id="fr-grad-deep" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#8b3a00" />   {/* was #cc0000 */}
          <stop offset="30%"  stopColor="#c05010" />   {/* was #ff3300 */}
          <stop offset="60%"  stopColor="#d97828" />   {/* was #ff7700 */}
          <stop offset="100%" stopColor="#8b3a00" />
        </linearGradient>

        <clipPath id="fr-clip">
          <path
            d={`M 0 0 H ${SVG_SIZE} V ${SVG_SIZE} H 0 Z
                M ${SVG_C} ${SVG_C} m -${LOGO_R} 0
                a ${LOGO_R},${LOGO_R} 0 1,0 ${LOGO_R * 2},0
                a ${LOGO_R},${LOGO_R} 0 1,0 -${LOGO_R * 2},0`}
            fillRule="evenodd"
          />
        </clipPath>
      </defs>

      {/* ── Layer 0: Ambient heat haze — CHANGE: opacity 0.18 → 0.10, stroke darkened ── */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none"
        stroke="#c04000" strokeWidth={RING_THICKNESS * 5}
        opacity={0.10} filter="url(#fr-glow-haze)"
        clipPath="url(#fr-clip)" />

      {/* ── Layer 1: Wide deep glow — CHANGE: opacity 0.4 → 0.22, color darkened ── */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none"
        stroke="#b84a10" strokeWidth={RING_THICKNESS * 3.5}
        opacity={0.22} filter="url(#fr-glow-wide)"
        clipPath="url(#fr-clip)" />

      {/* ── Layer 2: Slow rotating base ring — CHANGE: dur 8s → 18s ── */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none"
        stroke="url(#fr-grad-deep)" strokeWidth={RING_THICKNESS * 1.6}
        opacity={0.75} filter="url(#fr-glow)"
        clipPath="url(#fr-clip)">
        <animateTransform attributeName="transform" type="rotate"
          from={`0 ${SVG_C} ${SVG_C}`} to={`360 ${SVG_C} ${SVG_C}`}
          dur="18s" repeatCount="indefinite" />
      </circle>

      {/* ── Layer 3: Main fire body — CHANGE: dur 3.5s → 9s ── */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none"
        stroke="url(#fr-grad-hot)" strokeWidth={RING_THICKNESS * 1.3}
        opacity={0.85} filter="url(#fr-turb)"
        clipPath="url(#fr-clip)">
        <animateTransform attributeName="transform" type="rotate"
          from={`0 ${SVG_C} ${SVG_C}`} to={`-360 ${SVG_C} ${SVG_C}`}
          dur="9s" repeatCount="indefinite" />
      </circle>

      {/* ── Layer 4: Counter-spin fractal — CHANGE: dur 5s → 13s ── */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none"
        stroke="url(#fr-grad-hot)" strokeWidth={RING_THICKNESS}
        opacity={0.70} filter="url(#fr-turb2)"
        clipPath="url(#fr-clip)">
        <animateTransform attributeName="transform" type="rotate"
          from={`90 ${SVG_C} ${SVG_C}`} to={`450 ${SVG_C} ${SVG_C}`}
          dur="13s" repeatCount="indefinite" />
      </circle>

      {/* ── Layer 5: Fast mid ring — CHANGE: dur 2s → 7s ── */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none"
        stroke="url(#fr-grad-hot)" strokeWidth={RING_THICKNESS * 0.7}
        opacity={0.65} filter="url(#fr-turb)"
        clipPath="url(#fr-clip)">
        <animateTransform attributeName="transform" type="rotate"
          from={`180 ${SVG_C} ${SVG_C}`} to={`-180 ${SVG_C} ${SVG_C}`}
          dur="7s" repeatCount="indefinite" />
      </circle>

      {/* ── Layer 6: White-hot core streak — CHANGE: dur 1.8s → 6s ── */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none"
        stroke="url(#fr-grad-white)" strokeWidth={RING_THICKNESS * 0.35}
        opacity={0.75} filter="url(#fr-turb)"
        clipPath="url(#fr-clip)">
        <animateTransform attributeName="transform" type="rotate"
          from={`270 ${SVG_C} ${SVG_C}`} to={`-90 ${SVG_C} ${SVG_C}`}
          dur="6s" repeatCount="indefinite" />
      </circle>

      {/* ── Layer 7: Pulsing brightness — CHANGE: dur 1.2s → 3.5s ── */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none"
        stroke="#e8900a" strokeWidth={RING_THICKNESS * 0.8}
        filter="url(#fr-glow)" clipPath="url(#fr-clip)">
        <animate attributeName="opacity"
          dur="3.5s" values="0.15;0.55;0.28;0.70;0.40;0.15" repeatCount="indefinite" />
        <animate attributeName="stroke-width" dur="3.5s"
          values={`${RING_THICKNESS*0.4};${RING_THICKNESS*0.9};${RING_THICKNESS*0.5};${RING_THICKNESS*0.8};${RING_THICKNESS*0.4}`}
          repeatCount="indefinite" />
      </circle>

      {/* ── Layer 8: Breathe ring — CHANGE: dur 2.4s → 6s ── */}
      <circle cx={SVG_C} cy={SVG_C} r={RING_R} fill="none"
        stroke="#d07020" strokeWidth={RING_THICKNESS * 0.5}
        opacity={0.45} filter="url(#fr-glow)" clipPath="url(#fr-clip)">
        <animateTransform attributeName="transform" type="scale"
          values={`1 1;1.04 1.04;0.97 0.97;1.02 1.02;1 1`}
          dur="6s" repeatCount="indefinite"
          additive="sum" />
        <animate attributeName="opacity"
          values="0.3;0.6;0.35;0.65;0.3" dur="6s" repeatCount="indefinite" />
      </circle>

      {/* ── Orbiting ember dots × 3 — CHANGE: all durations doubled ── */}
      <circle r={6} fill="#f5c040" filter="url(#fr-dot-glow)">
        <animateMotion dur="6s" repeatCount="indefinite"
          path={`M ${SVG_C} ${SVG_C - RING_R} a ${RING_R} ${RING_R} 0 1 1 0.001 0`} />
        <animate attributeName="r" dur="6s" values="5;9;6;10;5" repeatCount="indefinite" />
        <animate attributeName="opacity" dur="6s" values="0.6;0.9;0.7;1;0.6" repeatCount="indefinite" />
      </circle>

      <circle r={5} fill="#e08820" filter="url(#fr-dot-glow)">
        <animateMotion dur="8s" repeatCount="indefinite"
          path={`M ${SVG_C} ${SVG_C + RING_R} a ${RING_R} ${RING_R} 0 1 0 0.001 0`} />
        <animate attributeName="r" dur="8s" values="4;8;5;9;4" repeatCount="indefinite" />
        <animate attributeName="opacity" dur="8s" values="0.5;0.9;0.6;0.9;0.5" repeatCount="indefinite" />
      </circle>

      <circle r={4} fill="#fff0c0" filter="url(#fr-dot-glow)">
        <animateMotion dur="7s" repeatCount="indefinite" begin="1.2s"
          path={`M ${SVG_C} ${SVG_C - RING_R} a ${RING_R} ${RING_R} 0 1 0 0.001 0`} />
        <animate attributeName="r" dur="7s" values="3;7;4;8;3" repeatCount="indefinite" />
        <animate attributeName="opacity" dur="7s" values="0.4;0.85;0.5;0.8;0.4" repeatCount="indefinite" />
      </circle>

      {/* ── Static hot dots at top & bottom — CHANGE: dur doubled, colors softened ── */}
      {/* Top */}
      <circle cx={SVG_C} cy={SVG_C - RING_R} r={10} fill="#fff4d0" filter="url(#fr-dot-glow)">
        <animate attributeName="r"       dur="2.5s" values="8;13;9;14;8"       repeatCount="indefinite" />
        <animate attributeName="opacity" dur="2.5s" values="0.6;0.9;0.7;1;0.6"   repeatCount="indefinite" />
      </circle>
      <circle cx={SVG_C} cy={SVG_C - RING_R} r={18} fill="#d06010" opacity={0.35} filter="url(#fr-glow-wide)">
        <animate attributeName="r" dur="2.5s" values="15;24;17;26;15" repeatCount="indefinite" />
      </circle>
      {/* Bottom */}
      <circle cx={SVG_C} cy={SVG_C + RING_R} r={10} fill="#fff4d0" filter="url(#fr-dot-glow)">
        <animate attributeName="r"       dur="3s" values="8;14;10;13;8"      repeatCount="indefinite" />
        <animate attributeName="opacity" dur="3s" values="0.6;0.9;0.7;1;0.6"  repeatCount="indefinite" />
      </circle>
      <circle cx={SVG_C} cy={SVG_C + RING_R} r={18} fill="#d06010" opacity={0.35} filter="url(#fr-glow-wide)">
        <animate attributeName="r" dur="3s" values="15;26;18;24;15" repeatCount="indefinite" />
      </circle>

      {/* ── 12 Spark streaks — CHANGE: dur multiplied ~2×, colors warmer ── */}
      {SPARK_ANGLES.map((angle, i) => {
        const rad  = (angle * Math.PI) / 180;
        const x1   = SVG_C + Math.cos(rad) * (RING_R - 6);
        const y1   = SVG_C + Math.sin(rad) * (RING_R - 6);
        const x2far = SVG_C + Math.cos(rad) * (RING_R + 50);
        const y2far = SVG_C + Math.sin(rad) * (RING_R + 50);
        const x2end = SVG_C + Math.cos(rad) * (RING_R + 70);
        const y2end = SVG_C + Math.sin(rad) * (RING_R + 70);
        const delay = (i * 0.45).toFixed(2);             // was 0.22
        const dur   = (3.5 + (i % 3) * 0.8).toFixed(1); // was 1.6 + 0.4
        return (
          <line key={angle} x1={x1} y1={y1} x2={x1} y2={y1}
            stroke={i % 3 === 0 ? "#fff8e0" : i % 3 === 1 ? "#f5d060" : "#e89030"}
            strokeWidth={3} strokeLinecap="round"
            filter="url(#fr-dot-glow)">
            <animate attributeName="opacity"
              dur={`${dur}s`} begin={`${delay}s`}
              values="0;0.8;0.7;0.4;0" repeatCount="indefinite" />
            <animate attributeName="stroke-width"
              dur={`${dur}s`} begin={`${delay}s`}
              values="1;3.5;2;1;0" repeatCount="indefinite" />
            <animate attributeName="x2"
              dur={`${dur}s`} begin={`${delay}s`}
              values={`${x1};${x2far};${x2end}`} repeatCount="indefinite" />
            <animate attributeName="y2"
              dur={`${dur}s`} begin={`${delay}s`}
              values={`${y1};${y2far};${y2end}`} repeatCount="indefinite" />
          </line>
        );
      })}

      {/* ── 8 Rising ember particles — CHANGE: dur multiplied ~2× ── */}
      {EMBER_ANGLES.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx  = SVG_C + Math.cos(rad) * RING_R;
        const cy  = SVG_C + Math.sin(rad) * RING_R;
        const dur = (3.0 + i * 0.5).toFixed(2);          // was 1.4 + 0.25
        const rise = 30 + (i % 3) * 14;
        return (
          <circle key={angle} cx={cx} cy={cy} r={4}
            fill={i % 2 === 0 ? "#f5cc50" : "#e08830"}
            filter="url(#fr-dot-glow)">
            <animate attributeName="opacity"
              dur={`${dur}s`} begin={`${(i * 0.55).toFixed(2)}s`}
              values="0;0.85;0.65;0" repeatCount="indefinite" />
            <animate attributeName="cy"
              dur={`${dur}s`} begin={`${(i * 0.55).toFixed(2)}s`}
              values={`${cy};${cy - rise / 2};${cy - rise}`} repeatCount="indefinite" />
            <animate attributeName="r"
              dur={`${dur}s`} begin={`${(i * 0.55).toFixed(2)}s`}
              values="4;6;1" repeatCount="indefinite" />
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
          position:relative; z-index:10; width:100%; height:680px;
          -webkit-mask-image:linear-gradient(to right,transparent 0%,black 14%,black 86%,transparent 100%);
          mask-image:linear-gradient(to right,transparent 0%,black 14%,black 86%,transparent 100%);
        }
        
        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 30;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(20, 25, 35, 0.95);
          backdrop-filter: blur(15px);
          border: 3px solid #ff990079;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #fff;
          font-size: 32px;
          font-weight: bold;
          user-select: none;
          box-shadow: 0 0 30px rgba(255, 153, 0, 0.6), 0 4px 20px rgba(0, 0, 0, 0.5);
        }
        
        .nav-arrow:hover {
          background: rgba(255, 153, 0, 0.95);
          border-color: #ffcc00;
          box-shadow: 0 0 40px rgba(255, 153, 0, 0.9), 0 4px 25px rgba(0, 0, 0, 0.6);
          transform: translateY(-50%) scale(1.15);
          color: #000;
        }
        
        .nav-arrow:active {
          transform: translateY(-50%) scale(0.98);
          box-shadow: 0 0 35px rgba(255, 153, 0, 0.8), 0 2px 15px rgba(0, 0, 0, 0.5);
        }
        
        .nav-arrow-left  { left: 40px; }
        .nav-arrow-right { right: 40px; }
        
        @media (max-width: 768px) {
          .nav-arrow { width: 50px; height: 50px; font-size: 28px; }
          .nav-arrow-left  { left: 15px; }
          .nav-arrow-right { right: 15px; }
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
          position:relative;
          width:${CARD_SIZE}px; height:${CARD_SIZE}px;
          display:flex; align-items:center; justify-content:center;
        }

        .logo-circle {
          width:${CARD_SIZE}px; height:${CARD_SIZE}px;
          border-radius:50%; overflow:hidden;
          position:relative; z-index:2;
        }

        .logo-circle-center {
          background: rgba(8, 12, 22, 0) !important;
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
        }

        .logo-circle-side {
          background: transparent !important;
        }

        .side-ring-glow {
          position:absolute; top:50%; left:50%;
          width:${CARD_SIZE + RING_GAP * 2 + RING_THICKNESS * 2}px;
          height:${CARD_SIZE + RING_GAP * 2 + RING_THICKNESS * 2}px;
          border-radius:50%;
          border:2px solid rgba(255,120,0,0.3);
          box-shadow:0 0 18px 6px rgba(255,80,0,0.2), inset 0 0 10px 3px rgba(255,100,0,0.08);
          transform:translate(-50%,-50%);
          pointer-events:none; z-index:1;
        }

        .info-area { position:relative; z-index:10; text-align:center; padding:0 24px; max-width:600px; }
        .info-name  { font-size:clamp(20px,2.8vw,30px); font-weight:800; color:#fff; letter-spacing:.01em; margin-bottom:12px; }
        .info-desc  { font-size:14px; font-weight:300; color:rgba(255,255,255,.48); line-height:1.85; }

        .dots-row { position:relative; z-index:10; display:flex; gap:8px; margin-top:26px; align-items:center; }
        .dot      { height:6px; border-radius:99px; transition:all .42s cubic-bezier(.34,1.56,.64,1); cursor:pointer; }
        .dot.on   { width:28px; background:#fb923c; box-shadow:0 0 10px #fb923c; }
        .dot.off  { width:6px; background:rgba(255,255,255,.2); }
        .dot.off:hover { background:rgba(255,255,255,.4); }

        .progress-bar  { position:relative; z-index:10; width:120px; height:2px; background:rgba(255,255,255,.1); border-radius:99px; margin-top:12px; overflow:hidden; }
        .progress-fill { height:100%; background:linear-gradient(90deg,#fb923c,#f97316); border-radius:99px; animation:progressAnim 4000ms linear infinite; }

        .geo { position:absolute; inset:0; pointer-events:none; overflow:hidden; }

        @keyframes progressAnim { from{width:0%} to{width:100%} }
      `}</style>

      <div className="root" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

        <div className="geo">
          <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.1 }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <polygon points="0,0 380,0 0,290"        fill="rgba(255,255,255,0.07)" />
            <polygon points="1440,0 1060,0 1440,290"  fill="rgba(255,255,255,0.07)" />
            <polygon points="0,900 280,900 0,640"     fill="rgba(255,255,255,0.05)" />
            <polygon points="1440,900 1160,900 1440,640" fill="rgba(255,255,255,0.05)" />
            <line x1="0" y1="0" x2="380" y2="290"   stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
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
          <div 
            className="nav-arrow nav-arrow-left"
            onClick={() => {
              const newIndex = (centerIndex - 1 + partners.length) % partners.length;
              goTo(newIndex);
              startAutoPlay();
            }}
          >
            ‹
          </div>
          
          <div 
            className="nav-arrow nav-arrow-right"
            onClick={() => {
              const newIndex = (centerIndex + 1) % partners.length;
              goTo(newIndex);
              startAutoPlay();
            }}
          >
            ›
          </div>
          
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

                    {isCenter && <FireRingSVG />}

                    {isSide && (
                      <div className="side-ring-glow" style={{ opacity: sideGlowOpacity }} />
                    )}

                    <div
                      className={`logo-circle ${isCenter ? "logo-circle-center" : "logo-circle-side"}`}
                      style={{
                        boxShadow: isCenter
                          ? "0 0 50px 10px rgba(255,100,0,0.2), 0 12px 60px rgba(0,0,0,0.5)"
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