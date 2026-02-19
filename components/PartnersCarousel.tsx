"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// TypeScript types for API response
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

export default function PartnersCarousel() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch partners from API
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
            bg: "linear-gradient(135deg, #ffffff, #ffffff)",
          }));

        setPartners(partnersData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching partners:", err);
        setError(err instanceof Error ? err.message : "Failed to load partners");
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const startAutoPlay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (partners.length === 0) return;
    
    timerRef.current = setInterval(() => {
      setCenterIndex(prev => (prev + 1) % partners.length);
    }, AUTO_PLAY_INTERVAL);
  };

  useEffect(() => {
    if (partners.length > 0) {
      startAutoPlay();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [partners.length]);

  const getVisualProps = (offset: number) => {
    const abs = Math.abs(offset);
    if (abs === 0) return { scale: 1,    opacity: 1,    size: 300, blur: 0,   x: 0    };
    if (abs === 1) return { scale: 0.73, opacity: 0.9,  size: 300, blur: 0,   x: offset * 320 };
    if (abs === 2) return { scale: 0.57, opacity: 0.55, size: 300, blur: 0.5, x: offset * 310 };
    return               { scale: 0.4,  opacity: 0.25, size: 300, blur: 1,   x: offset * 300 };
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Loading partners...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-neutral-900">
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
  }

  // No partners available
  if (partners.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-neutral-900">
        <p className="text-white/60">No partners available</p>
      </div>
    );
  }

  const displayed = [-2, -1, 0, 1, 2].map(offset => {
    const idx = ((centerIndex + offset) % partners.length + partners.length) % partners.length;
    return { ...partners[idx], offset };
  });

  const currentPartner = partners[centerIndex];

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
          background:
            radial-gradient(ellipse 90% 60% at 50% 38%, rgba(245, 159, 88, 0.36) 0%, transparent 70%),
            radial-gradient(ellipse 70% 50% at 50% 90%, rgba(249,115,22,0.2) 0%, transparent 65%),
            linear-gradient(165deg, #0f0f0f 0%, #1a1a1a 30%, #0a0a0a 65%, #000000 100%);
        }
        .geo { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .title-area { position: relative; z-index: 10; text-align: center; margin-bottom: 50px; }
        .title-row { display: flex; align-items: center; justify-content: center; gap: 20px; }
        .diamond { color: #e8883a; font-size: 20px; }
        .title-text { font-family: 'Bebas Neue', sans-serif; font-size: clamp(34px, 4.5vw, 56px); color: #fff; letter-spacing: 0.18em; }
        .stage { position: relative; z-index: 10; width: 100%; max-width: 1100px; height: 310px; display: flex; align-items: center; justify-content: center; }
        .logo-item {
          position: absolute; display: flex; align-items: center; justify-content: center;
          transition: transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.8s cubic-bezier(0.4, 0.0, 0.2, 1), filter 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
          cursor: pointer; user-select: none;
        }
        .logo-circle { border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; transition: inherit; position: relative; }
        .orbit { position: absolute; border-radius: 50%; pointer-events: none; }
        .orbit-outer { border: 1.5px solid rgba(180,180,200,0.28); }
        .orbit-inner { border: 1px solid rgba(150,150,180,0.15); }
        .orbit-dot { position: absolute; width: 10px; height: 10px; background: rgba(210,210,230,0.65); border-radius: 50%; transform: translateX(-50%); }
        .info-area { position: relative; z-index: 10; text-align: center; margin-top: 72px; padding: 0 24px; max-width: 600px; }
        .info-name { font-size: clamp(20px, 2.8vw, 30px); font-weight: 800; color: #fff; letter-spacing: 0.01em; margin-bottom: 12px; }
        .info-desc { font-size: 14px; font-weight: 300; color: rgba(255,255,255,0.48); line-height: 1.85; }
        .dots-row { position: relative; z-index: 10; display: flex; gap: 8px; margin-top: 26px; align-items: center; }
        .dot { height: 6px; border-radius: 99px; transition: all 0.42s cubic-bezier(0.34,1.56,0.64,1); cursor: pointer; }
        .dot.on  { width: 28px; background: #fb923c; }
        .dot.off { width: 6px;  background: rgba(255,255,255,0.2); }
        .dot.off:hover { background: rgba(255,255,255,0.4); }
        .progress-bar { position: relative; z-index: 10; width: 120px; height: 2px; background: rgba(255,255,255,0.1); border-radius: 99px; margin-top: 12px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #fb923c, #f97316); border-radius: 99px; animation: progressAnim 3000ms linear infinite; }
        @keyframes progressAnim { from { width: 0%; } to { width: 100%; } }
      `}</style>

      <div className="root">
        <div className="geo">
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.1 }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <polygon points="0,0 380,0 0,290" fill="rgba(255,255,255,0.07)" />
            <polygon points="1440,0 1060,0 1440,290" fill="rgba(255,255,255,0.07)" />
            <polygon points="0,900 280,900 0,640" fill="rgba(255,255,255,0.05)" />
            <polygon points="1440,900 1160,900 1440,640" fill="rgba(255,255,255,0.05)" />
            <line x1="0" y1="0" x2="380" y2="290" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            <line x1="1440" y1="0" x2="1060" y2="290" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          </svg>
        </div>

        <div className="title-area">
          <div className="title-row">
            <span className="diamond">◆</span>
            <span className="title-text">STRATEGIC PARTNERS</span>
            <span className="diamond">◆</span>
          </div>
        </div>

        <div className="stage">
          {displayed.map(({ offset, ...partner }) => {
            const v = getVisualProps(offset);
            const isCenter = offset === 0;
            const size = v.size * v.scale;
            const orbitOuter = size + 52;
            const orbitInner = size + 26;
            return (
              <div
                key={`${partner.id}-${offset}`}
                className="logo-item"
                style={{
                  transform: `translateX(${v.x}px) scale(${v.scale})`,
                  opacity: v.opacity,
                  filter: v.blur ? `blur(${v.blur}px)` : "none",
                  zIndex: isCenter ? 10 : (5 - Math.abs(offset)),
                }}
                onClick={() => {
                  if (offset > 0) for (let i = 0; i < offset; i++) setCenterIndex(p => (p + 1) % partners.length);
                  else if (offset < 0) for (let i = 0; i < -offset; i++) setCenterIndex(p => (p - 1 + partners.length) % partners.length);
                  startAutoPlay();
                }}
              >
                {isCenter && (
                  <>
                    <div className="orbit orbit-outer" style={{ width: orbitOuter, height: orbitOuter, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                      <div className="orbit-dot" style={{ top: -5, left: "50%" }} />
                      <div className="orbit-dot" style={{ bottom: -5, top: "auto", left: "50%" }} />
                    </div>
                    <div className="orbit orbit-inner" style={{ width: orbitInner, height: orbitInner, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
                  </>
                )}
                <div className="logo-circle" style={{
                  width: v.size, height: v.size, background: partner.bg,
                  boxShadow: isCenter ? "0 12px 60px rgba(0,0,0,0.65), 0 0 0 2px rgba(255,255,255,0.06) inset" : "0 6px 30px rgba(0,0,0,0.4)",
                  overflow: "hidden", position: "relative",
                }}>
                  <Image src={partner.logo} alt={partner.name} fill className="object-contain p-4" sizes={`${v.size}px`} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="info-area">
          <div className="info-name">{currentPartner.name}</div>
          <p className="info-desc">
            The 8JJ Cricket Alliance not only partners with leading entertainment platforms 
            but also expands its strategic partnerships with other renowned brands.
          </p>
        </div>

        <div className="dots-row">
          {partners.map((_, i) => (
            <div key={i} className={`dot ${i === centerIndex ? "on" : "off"}`} onClick={() => { setCenterIndex(i); startAutoPlay(); }} />
          ))}
        </div>

        <div className="progress-bar">
          <div key={centerIndex} className="progress-fill" />
        </div>
      </div>
    </>
  );
}