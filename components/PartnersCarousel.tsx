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
const RING_GAP = 22;
const RING_THICKNESS = 10;
const LOGO_R = CARD_SIZE / 2;
const RING_R = LOGO_R + RING_GAP + RING_THICKNESS / 2;

const CANVAS_SIZE = 680;
const CANVAS_C    = CANVAS_SIZE / 2;
const GRID_W = 180;
const GRID_H = 180;
const RING_SAMPLES = 240;

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
    };
    fetchPartners();
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

  // ── Fire Ring Canvas ──────────────────────────────────────────────────────
  // Ring is drawn via canvas arc. Fire seeds ONLY on TOP HALF of the ring.
  const FireRingCanvas = () => {
    const canvasRef    = useRef<HTMLCanvasElement>(null);
    const offscreenRef = useRef<CanvasRenderingContext2D | null>(null);
    const rafRef       = useRef<number>(0);

    useEffect(() => {
      const off = document.createElement("canvas");
      off.width = GRID_W; off.height = GRID_H;
      offscreenRef.current = off.getContext("2d");
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const fire    = new Float32Array(GRID_W * GRID_H);
      const fireTmp = new Float32Array(GRID_W * GRID_H);

      const scaleX  = GRID_W / CANVAS_SIZE;
      const scaleY  = GRID_H / CANVAS_SIZE;
      const gcx     = CANVAS_C * scaleX;
      const gcy     = CANVAS_C * scaleY;
      const ringRgx = RING_R * scaleX;
      const ringRgy = RING_R * scaleY;

      // Pre-compute masks
      const innerR2 = ((LOGO_R - 6) * scaleX) ** 2;
      const outerR2 = ((RING_R + 120) * scaleX) ** 2;
      const innerMask = new Uint8Array(GRID_W * GRID_H);
      const outerMask = new Uint8Array(GRID_W * GRID_H);
      for (let y = 0; y < GRID_H; y++) {
        for (let x = 0; x < GRID_W; x++) {
          const dx = x - gcx, dy = y - gcy, d2 = dx*dx + dy*dy;
          const i = y * GRID_W + x;
          innerMask[i] = d2 < innerR2 ? 1 : 0;
          outerMask[i] = d2 > outerR2 ? 1 : 0;
        }
      }

      // ── Seed points: TOP HALF ONLY ──────────────────────────────────────
      // In canvas coords: y increases downward, so sin(angle) < 0 = top half
      // Threshold 0.05 gives a clean cut right at the horizontal centre line
      type RingSeed = { gx: number; gy: number; strength: number };
      const ringSeeds: RingSeed[] = [];
      for (let s = 0; s < RING_SAMPLES; s++) {
        const angle = (s / RING_SAMPLES) * Math.PI * 2;
        // ── KEY GATE: bottom half gets no seeds ──
        if (Math.sin(angle) > 0.05) continue;

        const gx = Math.round(gcx + Math.cos(angle) * ringRgx);
        const gy = Math.round(gcy + Math.sin(angle) * ringRgy);
        if (gx < 1 || gx >= GRID_W - 1 || gy < 1 || gy >= GRID_H - 1) continue;

        // Hottest at the very top (-π/2), tapering to sides (0 / π)
        const normUp   = Math.max(0, -Math.sin(angle)); // 0..1
        // Min strength 0.70 so sides still burn well; top hits 1.0
        const strength = 0.70 + normUp * 0.30;
        ringSeeds.push({ gx, gy, strength });
      }

      // Fire colour palette: transparent → dark red → orange → yellow → white
      const palette = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let r = 0, g = 0, b = 0, a = 0;
        if (i < 20) {
          a = 0;
        } else if (i < 70) {
          const t = (i - 20) / 50;
          r = Math.round(130 + t * 90); g = 0; b = 0; a = Math.round(t * 220);
        } else if (i < 130) {
          const t = (i - 70) / 60;
          r = 220 + Math.round(t * 35); g = Math.round(t * 120); b = 0; a = 220 + Math.round(t * 30);
        } else if (i < 195) {
          const t = (i - 130) / 65;
          r = 255; g = 120 + Math.round(t * 120); b = Math.round(t * 20); a = 250;
        } else {
          const t = (i - 195) / 60;
          r = 255; g = 240 + Math.round(t * 15); b = Math.round(t * 255); a = 255;
        }
        palette[i] = ((a & 0xff) << 24) | ((b & 0xff) << 16) | ((g & 0xff) << 8) | (r & 0xff);
      }

      const imgData = ctx.createImageData(GRID_W, GRID_H);
      const buf32   = new Uint32Array(imgData.data.buffer);
      let noiseT = 0;

      const noise = (x: number, y: number, t: number) =>
        Math.sin(x * 3.3 + t * 2.0) *
        Math.cos(y * 2.8 - t * 1.7) *
        Math.sin((x + y) * 1.9 + t * 1.4);

      const tick = () => {
        noiseT += 0.058;

        // STEP 1 — inject heat (top half ring only)
        for (const { gx, gy, strength } of ringSeeds) {
          const flicker = 0.35 + 0.65 * Math.random();
          const n       = noise(gx * 0.3, gy * 0.3, noiseT) * 0.22 + 0.78;
          // High base heat for tall flames
          const heat    = 255 * strength * flicker * n;
          const idx     = gy * GRID_W + gx;
          fire[idx]                          = Math.min(255, fire[idx]                          + heat);
          if (gx > 0)          fire[idx - 1]           = Math.min(255, fire[idx - 1]           + heat * 0.55);
          if (gx < GRID_W - 1) fire[idx + 1]           = Math.min(255, fire[idx + 1]           + heat * 0.55);
          if (gy > 0)          fire[idx - GRID_W]      = Math.min(255, fire[idx - GRID_W]      + heat * 0.42);
          if (gx > 1)          fire[idx - 2]           = Math.min(255, fire[idx - 2]           + heat * 0.22);
          if (gx < GRID_W - 2) fire[idx + 2]           = Math.min(255, fire[idx + 2]           + heat * 0.22);
          // Extra upward pre-seeding → taller flames
          if (gy > 1)          fire[idx - GRID_W * 2]  = Math.min(255, fire[idx - GRID_W * 2]  + heat * 0.20);
          if (gy > 2)          fire[idx - GRID_W * 3]  = Math.min(255, fire[idx - GRID_W * 3]  + heat * 0.12);
          if (gy > 3)          fire[idx - GRID_W * 4]  = Math.min(255, fire[idx - GRID_W * 4]  + heat * 0.06);
        }

        // STEP 2 — advect upward + cool
        for (let y = 1; y < GRID_H - 1; y++) {
          for (let x = 1; x < GRID_W - 1; x++) {
            const i = y * GRID_W + x;
            if (outerMask[i]) { fireTmp[i] = 0; continue; }

            const wobble = noise(x * 0.22, y * 0.22, noiseT) * 1.6;
            const srcX   = Math.max(0, Math.min(GRID_W - 1.001, x + wobble));
            const srcY   = y + 1.05;

            const sx0 = Math.floor(srcX), sy0 = Math.min(Math.floor(srcY), GRID_H - 1);
            const fx = srcX - sx0, fy = srcY - sy0;
            const sx1 = Math.min(sx0 + 1, GRID_W - 1), sy1 = Math.min(sy0 + 1, GRID_H - 1);
            const cx0 = Math.max(0, Math.min(GRID_W - 1, sx0));
            const cy0 = Math.max(0, Math.min(GRID_H - 1, sy0));

            const v00 = fire[cy0 * GRID_W + cx0], v10 = fire[cy0 * GRID_W + sx1];
            const v01 = fire[sy1 * GRID_W + cx0], v11 = fire[sy1 * GRID_W + sx1];
            const sampled =
              v00 * (1-fx)*(1-fy) + v10 * fx*(1-fy) +
              v01 * (1-fx)*fy     + v11 * fx*fy;

            // Lower cooling = taller flames
            const yFrac   = y / GRID_H;
            const cooling = 4.0 + (1 - yFrac) * 7.5;
            fireTmp[i] = Math.max(0, sampled - cooling);
          }
        }

        for (let x = 0; x < GRID_W; x++) {
          fireTmp[x] = 0;
          fireTmp[(GRID_H - 1) * GRID_W + x] = 0;
        }
        for (let y = 0; y < GRID_H; y++) {
          fireTmp[y * GRID_W] = 0;
          fireTmp[y * GRID_W + GRID_W - 1] = 0;
        }
        fire.set(fireTmp);

        // STEP 3 — heat → palette
        for (let i = 0; i < GRID_W * GRID_H; i++) {
          if (innerMask[i] || outerMask[i]) { buf32[i] = 0; continue; }
          const heat = Math.min(255, fire[i] | 0);
          buf32[i] = heat > 12 ? palette[heat] : 0;
        }

        // STEP 4 — blit fire pixels
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        const offCtx = offscreenRef.current;
        if (offCtx) {
          offCtx.putImageData(imgData, 0, 0);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(offCtx.canvas, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
        }

        // STEP 5 — draw decorative ring ON TOP of fire (full 360°)
        ctx.save();

        // Outer dark shadow
        ctx.beginPath();
        ctx.arc(CANVAS_C, CANVAS_C, RING_R + RING_THICKNESS * 0.3, 0, Math.PI * 2);
        ctx.lineWidth = RING_THICKNESS * 0.5;
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        ctx.stroke();

        // Main ring body — dark copper
        ctx.beginPath();
        ctx.arc(CANVAS_C, CANVAS_C, RING_R, 0, Math.PI * 2);
        ctx.lineWidth = RING_THICKNESS;
        ctx.strokeStyle = "#3a1500";
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        ctx.stroke();

        // Glowing orange highlight
        ctx.beginPath();
        ctx.arc(CANVAS_C, CANVAS_C, RING_R, 0, Math.PI * 2);
        ctx.lineWidth = RING_THICKNESS * 0.55;
        ctx.strokeStyle = "#e05000";
        ctx.shadowColor = "#ff4400";
        ctx.shadowBlur = 18;
        ctx.globalAlpha = 0.88 + 0.08 * Math.sin(noiseT * 2.2);
        ctx.stroke();

        // Inner gold bevel
        ctx.beginPath();
        ctx.arc(CANVAS_C, CANVAS_C, RING_R - RING_THICKNESS * 0.3, 0, Math.PI * 2);
        ctx.lineWidth = RING_THICKNESS * 0.15;
        ctx.strokeStyle = "rgba(255,190,60,0.5)";
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        ctx.stroke();

        // Outer gold bevel
        ctx.beginPath();
        ctx.arc(CANVAS_C, CANVAS_C, RING_R + RING_THICKNESS * 0.3, 0, Math.PI * 2);
        ctx.lineWidth = RING_THICKNESS * 0.12;
        ctx.strokeStyle = "rgba(255,150,30,0.3)";
        ctx.globalAlpha = 1;
        ctx.stroke();

        // Hot centre line
        ctx.beginPath();
        ctx.arc(CANVAS_C, CANVAS_C, RING_R, 0, Math.PI * 2);
        ctx.lineWidth = RING_THICKNESS * 0.12;
        ctx.strokeStyle = "#ffaa44";
        ctx.shadowColor = "#ffaa44";
        ctx.shadowBlur = 6;
        ctx.globalAlpha = 0.65 + 0.20 * Math.sin(noiseT * 3.1);
        ctx.stroke();

        ctx.restore();

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 5,
          imageRendering: "auto",
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
        }}
      />
    );
  };

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
          position:relative; z-index:10; width:100%; height:720px;
          -webkit-mask-image:linear-gradient(to right,transparent 0%,black 14%,black 86%,transparent 100%);
          mask-image:linear-gradient(to right,transparent 0%,black 14%,black 86%,transparent 100%);
        }

        .nav-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          z-index: 30; width: 60px; height: 60px; border-radius: 50%;
          background: rgba(20,25,35,0.95); backdrop-filter: blur(15px);
          border: 3px solid rgba(255,153,0,0.45);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.3s ease;
          color: #fff; font-size: 32px; font-weight: bold; user-select: none;
          box-shadow: 0 0 28px rgba(255,153,0,0.35), 0 4px 20px rgba(0,0,0,0.5);
        }
        .nav-arrow:hover {
          background: rgba(255,153,0,0.95); border-color: #ffcc00;
          box-shadow: 0 0 40px rgba(255,153,0,0.9), 0 4px 25px rgba(0,0,0,0.6);
          transform: translateY(-50%) scale(1.15); color: #000;
        }
        .nav-arrow:active { transform: translateY(-50%) scale(0.98); }
        .nav-arrow-left  { left: 40px; }
        .nav-arrow-right { right: 40px; }
        @media (max-width: 768px) {
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

        .logo-circle {
          width:${CARD_SIZE}px; height:${CARD_SIZE}px;
          border-radius:50%; overflow:hidden; position:relative; z-index:6;
          background: transparent; border:none; outline:none; box-shadow:none;
        }

        .side-ring-glow {
          position:absolute; top:50%; left:50%;
          width:${CARD_SIZE + RING_GAP * 2 + RING_THICKNESS * 2}px;
          height:${CARD_SIZE + RING_GAP * 2 + RING_THICKNESS * 2}px;
          border-radius:50%;
          border:2px solid rgba(255,120,0,0.22);
          box-shadow:0 0 16px 5px rgba(255,80,0,0.14);
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
            onClick={() => { goTo((centerIndex - 1 + partners.length) % partners.length); startAutoPlay(); }}>
            ‹
          </div>
          <div className="nav-arrow nav-arrow-right"
            onClick={() => { goTo((centerIndex + 1) % partners.length); startAutoPlay(); }}>
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
                    {isCenter && <FireRingCanvas />}
                    {isSide && (
                      <div className="side-ring-glow" style={{ opacity: sideGlowOpacity }} />
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