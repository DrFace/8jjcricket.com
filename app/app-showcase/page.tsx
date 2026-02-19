"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { APP_SOWCASE, MOBILE_APP } from "@/lib/constant";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";

export default function AppShowcasePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // autoplay every 2 seconds (resets when user manually selects a slide)
  const timerRef = useRef<number | null>(null);

  const startAutoplay = () => {
    if (timerRef.current !== null) return;
    timerRef.current = window.setInterval(() => {
      setCurrentSlide((s) => (s + 1) % APP_SOWCASE.length);
    }, 3000);
  };

  const stopAutoplay = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bg3.png')" }}
    >
      {/* <TopNav />
            <BottomNav /> */}
      <main className="flex-1">
        <div className="space-y-6  pt-6 2xl:w-[85%] xl:w-[90%] lg:w-[95%] mx-auto h-min-80 xl:pt-12 lg:pt-1">
          <div className="relative w-full min-h-screen overflow-hidden px-4 sm:px-6 lg:px-10 ">
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
                      Minimize the number of steps to get live scores, match
                      updates, and cricket news. With our mobile app, you can
                      stay connected to the world of cricket anytime, anywhere.
                      Download now and never miss a moment of the action!
                    </p>

                    {/* Store Buttons */}
                    <div className="mt-4 flex flex-wrap gap-3 sm:gap-4">
                      {MOBILE_APP.map((app, i) => (
                        <a
                          key={i}
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white font-semibold text-sm shadow-lg transition-all duration-300 active:scale-95 ${
                            app.alt === "Play Store"
                              ? "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 hover:shadow-emerald-400/50 hover:scale-105"
                              : app.alt === "App Store"
                                ? "bg-gradient-to-r from-sky-500 via-indigo-500 to-indigo-600 hover:shadow-sky-500/50 hover:scale-105"
                                : "bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-orange-500/50 hover:scale-105"
                          }`}
                        >
                          <Image
                            src={app.img}
                            alt={app.alt}
                            width={16}
                            height={16}
                            className="object-contain"
                          />
                          <span className="text-xs font-semibold">
                            {app.alt}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="ml-2 sm:ml-4 mt-0 xl:mt-8">
                  <p className="text-white/60 text-sm font-semibold mb-5 uppercase tracking-wide">
                    Featured Screens
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-0 xl:mt-8">
                    {APP_SOWCASE.map((img, idx) => (
                      <button
                        key={img.alt}
                        onClick={() => {
                          setCurrentSlide(idx);
                          resetAutoplay();
                        }}
                        className={`xl:w-[90%] lg:w-[90%] h-56 xl:h-[100%] lg:h-72 sm:h-64 md:h-72 rounded-2xl border-2 shadow-lg bg-transparent transition-transform duration-300 relative overflow-visible ring-0 ${
                          idx === currentSlide
                            ? "border-orange-500 shadow-orange-500/50 z-10"
                            : "border-gray-800/60 hover:border-orange-400/50 opacity-95 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-full rounded-2xl object-contain bg-black"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - big phone showing selected screen */}
              <div className="lg:col-span-3 flex justify-center lg:justify-center items-start pt-0 lg:pt-10">
                <div className="relative group lg:w-[72%] max-w-xs">
                  <div className="absolute -inset-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>

                  <div className="relative shadow-2xl rounded-3xl overflow-hidden w-full bg-black border-8 border-gray-800">
                    {/* Phone Mockup displaying selected screen */}
                    <div className="relative w-full aspect-[9/19] bg-black flex items-center justify-center">
                      {/* Animated display (framer-motion) */}
                      <AnimatePresence mode="wait">
                        {APP_SOWCASE[currentSlide] && (
                          <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, y: 28, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -18, scale: 0.98 }}
                            transition={{
                              duration: 0.45,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <Image
                              src={APP_SOWCASE[currentSlide].src}
                              alt={APP_SOWCASE[currentSlide].alt}
                              fill
                              style={{ objectFit: "contain" }}
                              quality={90}
                              priority
                              className="object-contain"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
