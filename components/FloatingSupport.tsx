"use client";

// components/FloatingSupport.tsx
import { Headphones, Radio, Share2 } from "lucide-react";
import MusicPopup from "@/components/MusicPopup";
import { useState } from "react";
import { useAudio } from "@/context/AudioContext";
import LivePopup from "./LivePopup";
import SocialMediaPopup from "./SocialMediaPopup";

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
    <div className="fixed right-0 top-1/3 z-50 flex flex-col items-center">
      {/* Main Vertical Button */}
      {/* <div className="bg-black text-yellow-400 rounded-2xl px-3 py-6 flex flex-col items-center shadow-xl">
        <span className="rotate-90 tracking-widest font-semibold text-sm">
          ONLINE 24/7
        </span>
      </div> */}

      {/* Icon Buttons */}
      <div className="bg-gradient-to-r from-orange-400/20 to-green-400/20 backdrop-blur-md rounded-l-2xl px-1 py-2 flex flex-col items-center gap-3 shadow-xl">
        <button
          className="
          p-1 
          rounded-full 
          transition-all 
          duration-200 
          hover:scale-125 
          hover:bg-orange-400/20 
          active:bg-orange-500
        "
        >
          <img
            src="/icons/install_rm_bg.png"
            alt="Install"
            className="w-7 h-7 object-contain"
          />
        </button>

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
          <Headphones size={20} className="text-white" />
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
      <LivePopup open={livePopupOpen} onClose={() => setLivePopupOpen(false)} />
      <SocialMediaPopup
        open={socialPopupOpen}
        onClose={() => setSocialPopupOpen(false)}
      />
    </div>
  );
}
