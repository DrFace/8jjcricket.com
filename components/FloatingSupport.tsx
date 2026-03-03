"use client";

// components/FloatingSupport.tsx
import { Radio, Share2, Volume2, VolumeOff } from "lucide-react";
import MusicPopup from "@/components/MusicPopup";
import { useState } from "react";
import { useAudio } from "@/context/AudioContext";
import LivePopup from "./LivePopup";
import SocialMediaPopup from "./SocialMediaPopup";
import Link from "next/link";

export default function FloatingSupport() {
  const {
    audios,
    currentTrack,
    setCurrentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    previousTrack,
    shuffle,
    toggleShuffle,
    repeatMode,
    cycleRepeatMode,
    setIsMuted,
    isMuted,
    volume,
    setVolume,
  } = useAudio();
  const [musicPopupOpen, setMusicPopupOpen] = useState(false);
  const [livePopupOpen, setLivePopupOpen] = useState(false);
  const [socialPopupOpen, setSocialPopupOpen] = useState(false);

  const openMusicPopup = () => setMusicPopupOpen(true);
  const openLivePopup = () => setLivePopupOpen(true);
  const openSocialPopup = () => setSocialPopupOpen(true);

  const handleSelectTrack = (id: number) => {
    const track = audios.find((a) => a.id === id);
    if (!track) return;
    setCurrentTrack(track);
    togglePlay();
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <>
      <div className="fixed right-0 top-1/3 z-50 flex flex-col items-center">
        {/* Icon Buttons */}
        <div className="bg-gradient-to-r from-orange-400/20 to-green-400/20 backdrop-blur-md rounded-l-2xl px-1 py-2 flex flex-col items-center gap-3 shadow-xl">
          <Link
            className="
          p-1 
          rounded-full 
          transition-all 
          duration-200 
          hover:scale-125 
          hover:bg-orange-400/20 
          active:bg-orange-500
        "
            target="blank"
            href="/app-showcase"
          >
            <img
              src="/icons/install_rm_bg.svg"
              alt="Install"
              className="w-6 h-6 object-contain"
            />
          </Link>

          <button
            className="p-1 rounded-full hover:scale-125 hover:bg-orange-400/20"
            onClick={openSocialPopup}
            aria-label="Social Popup"
          >
            <Share2 size={20} className="text-white" />
          </button>

          <button
            className="p-1 rounded-full hover:scale-125 hover:bg-orange-400/20"
            onClick={openLivePopup}
            aria-label="Live Popup"
          >
            <Radio size={20} className="text-white" />
          </button>

          <button
            className="p-1 rounded-full hover:scale-125 hover:bg-orange-400/20"
            onClick={openMusicPopup}
            aria-label="Mute/Unmute"
            aria-pressed={!isMuted}
          >
            <div
              className="w-6 h-6"
              style={{
                background: isPlaying
                  ? "linear-gradient(135deg, #fb923c 0%, #facc15 50%,  #4ade80 100%)"
                  : "white",
                WebkitMaskImage: "url('/icons/music-player.svg')",
                maskImage: "url('/icons/music-player.svg')",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                animation: isPlaying
                  ? "musicColorCycle 2s linear infinite"
                  : "none",
              }}
            />
            <style>{`
              @keyframes musicColorCycle {
                0%   { filter: hue-rotate(0deg) brightness(1.1); }
                25%  { filter: hue-rotate(90deg) brightness(1.2); }
                50%  { filter: hue-rotate(180deg) brightness(1.3); }
                75%  { filter: hue-rotate(270deg) brightness(1.2); }
                100% { filter: hue-rotate(360deg) brightness(1.1); }
              }
            `}</style>
          </button>
          {/* Mute / Unmute (restored) */}
          <button
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
            className="p-1 rounded-full hover:scale-125 hover:bg-orange-400/20"
          >
            {isMuted ? <VolumeOff size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
        <MusicPopup
          open={musicPopupOpen}
          onClose={() => setMusicPopupOpen(false)}
          audios={audios}
          selectedId={currentTrack?.id ?? null}
          onSelect={handleSelectTrack}
          musicEnabled={isPlaying}
          isMuted={isMuted}
          onToggleMusic={togglePlay}
          onToggleMute={toggleMute}
          onNext={nextTrack}
          onPrev={previousTrack}
          shuffle={shuffle}
          onToggleShuffle={toggleShuffle}
          repeatMode={repeatMode}
          onCycleRepeat={cycleRepeatMode}
          volume={volume}
          onChangeVolume={setVolume}
        />
        <LivePopup
          open={livePopupOpen}
          onClose={() => setLivePopupOpen(false)}
        />
        <SocialMediaPopup
          open={socialPopupOpen}
          onClose={() => setSocialPopupOpen(false)}
        />
      </div>
    </>
  );
}
