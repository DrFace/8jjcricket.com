"use client";
import { useState } from "react";
import Image from "next/image";
import { APP_SOWCASE, MOBILE_APP } from "@/lib/constant";

export default function AppShowcasePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="relative w-full min-h-screen overflow-hidden px-4 sm:px-6 lg:px-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
        {/* Left - copy + buttons + thumbnails */}
        <div className="lg:col-span-9">
          {/* Logo + Text Block */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center p-4 rounded-2xl hover:scale-105 transition-transform duration-300">
              <img
                src="/8jjlogo.png"
                alt="8JJ Cricket App"
                className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] object-contain drop-shadow-lg"
              />
            </div>

            {/* Text + Store Buttons */}
            <div className="flex-1 p-3 sm:p-4 rounded-2xl ">
              <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold leading-tight bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300 bg-clip-text text-transparent">
                Download 8jjcricket mobile App
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-white/70 max-w-xl leading-relaxed">
                Minimize the number of steps to get live scores, match updates,
                and cricket news. With our mobile app, you can stay connected to
                the world of cricket anytime, anywhere. Download now and never
                miss a moment of the action!
              </p>

              {/* Store Buttons */}
              <div className="mt-4 flex flex-wrap gap-3 sm:gap-4">
                {MOBILE_APP.map((app, i) => (
                  <a
                    key={i}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 active:scale-95"
                  >
                    <Image
                      src={app.img}
                      alt={app.alt}
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                    <span className="text-xs font-semibold">{app.alt}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="ml-2 sm:ml-4">
            <p className="text-white/60 text-sm font-semibold mb-5 uppercase tracking-wide">
              Featured Screens
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 ">
              {APP_SOWCASE.map((img, idx) => (
                <button
                  key={img.alt}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-[80%] h-56 sm:h-64 md:h-72 rounded-2xl border-2 shadow-lg transition-transform duration-300 relative overflow-visible ${
                    idx === currentSlide
                      ? "border-orange-500 scale-105 shadow-orange-500/50 z-10"
                      : "border-white/20 hover:border-orange-400/50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full rounded-xl object-contain "
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right - big phone showing selected screen */}
        <div className="lg:col-span-3 flex justify-center lg:justify-center items-start pt-0 lg:pt-5">
          <div className="relative group lg:w-[72%] max-w-xs">
            <div className="absolute -inset-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>

            <div className="relative shadow-2xl rounded-3xl overflow-hidden w-full bg-black border-8 border-gray-800">
              {/* Phone Mockup displaying selected screen */}
              <div className="relative w-full aspect-[9/19] bg-black flex items-center justify-center">
                {/* Display Image */}
                {APP_SOWCASE[currentSlide] && (
                  <Image
                    src={APP_SOWCASE[currentSlide].src}
                    alt={APP_SOWCASE[currentSlide].alt}
                    fill
                    style={{ objectFit: "contain" }}
                    quality={90}
                    priority
                    className="transition-opacity duration-500 object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
