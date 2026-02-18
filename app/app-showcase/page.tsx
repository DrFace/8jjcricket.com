import Image from "next/image";
import { MOBILE_APP } from "@/lib/constant";

export default function AppShowcasePage() {
  return (
    <div
      className="relative w-full min-h-screen overflow-hidden px-4 sm:px-6 lg:px-10 py-8 bg-cover bg-center bg-gray-500"
      // style={{ backgroundImage: `url('/images/bg1.jpg')` }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        {/* Left - copy + buttons + thumbnails */}
        <div className="lg:col-span-9">
          {/* Logo + Text Block */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center p-3 rounded-lg">
              <img
                src="/8jjlogo.png"
                alt="8JJ Cricket App"
                className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] object-contain"
              />
            </div>

            {/* Text + Store Buttons */}
            <div className="flex-1 p-3 sm:p-4 rounded-md">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight bg-gradient-to-r from-[#FF9F43] to-[#FFD000] bg-clip-text text-transparent">
                Download 8jjcricket mobile App
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-white/60 max-w-xl leading-relaxed">
                Minimize the number of steps to get live scores, match updates,
                and cricket news. With our mobile app, you can stay connected to
                the world of cricket anytime, anywhere. Download now and never
                miss a moment of the action!
              </p>

              {/* Store Buttons */}
              <div className="mt-4 flex flex-wrap gap-4 sm:gap-6">
                {MOBILE_APP.map((app, i) => (
                  <a
                    key={i}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md text-white font-bold shadow-lg hover:scale-105 transition-transform duration-200"
                  >
                    <Image
                      src={app.img}
                      alt={app.alt}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                    <span className="text-sm font-semibold">{app.alt}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-6 ml-0 sm:ml-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { src: "/images/mobile/home1.png", alt: "Home Screen" },
                { src: "/images/mobile/home2.png", alt: "Quick Access" },
                { src: "/images/mobile/live.png", alt: "Live Matches" },
                { src: "/images/mobile/news.png", alt: "Cricket News" },
              ].map((img) => (
                <img
                  key={img.alt}
                  src={img.src}
                  alt={img.alt}
                  className="flex-shrink-0 w-28 sm:w-32 md:w-36 h-auto rounded-2xl border border-white/10 shadow-lg object-cover"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right - big phone mockup */}
        <div className="lg:col-span-3 flex justify-center lg:justify-end">
          <div className="transform rotate-6 shadow-2xl rounded-3xl overflow-hidden w-[55%] sm:w-[40%] md:w-[35%] lg:w-[80%] xl:w-[75%]">
            <img
              src="/images/mobile/home1.png"
              alt="App Preview"
              className="w-full h-auto object-contain rounded-3xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
