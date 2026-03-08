
"use client";

export default function WavingFlags() {
  return (
    <>
      <style>{`
        @keyframes flagFloat {
          0%   { transform: translateY(0px)   rotateY(0deg); }
          25%  { transform: translateY(-12px) rotateY(8deg); }
          50%  { transform: translateY(-18px) rotateY(0deg); }
          75%  { transform: translateY(-8px)  rotateY(-8deg); }
          100% { transform: translateY(0px)   rotateY(0deg); }
        }

        @keyframes flagFloatR {
          0%   { transform: scaleX(-1) translateY(0px)   rotateY(0deg); }
          25%  { transform: scaleX(-1) translateY(-12px) rotateY(8deg); }
          50%  { transform: scaleX(-1) translateY(-18px) rotateY(0deg); }
          75%  { transform: scaleX(-1) translateY(-8px)  rotateY(-8deg); }
          100% { transform: scaleX(-1) translateY(0px)   rotateY(0deg); }
        }

        .flag-left {
          animation: flagFloat 6s ease-in-out infinite;
          transform-origin: center center;
          transform-style: preserve-3d;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: fill;
        }

        .flag-right {
          animation: flagFloatR 6s ease-in-out infinite;
          animation-delay: -3s;
          transform-origin: center center;
          transform-style: preserve-3d;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: fill;
        }
      `}</style>

      {/* LEFT flag */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full hidden lg:flex items-center justify-center z-10 w-[22vw] max-w-[320px]"
        style={{ perspective: "400px" }}
      >
        <img
          src="/flag2.png"
          alt=""
          className="flag-left opacity-90 drop-shadow-[0_0_24px_rgba(220,30,30,0.55)]"
        />
      </div>

      {/* RIGHT flag */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full hidden lg:flex items-center justify-center z-10 w-[22vw] max-w-[320px]"
        style={{ perspective: "400px" }}
      >
        <img
          src="/flag2.png"
          alt=""
          className="flag-right opacity-90 drop-shadow-[0_0_24px_rgba(220,30,30,0.55)]"
        />
      </div>
    </>
  );
}