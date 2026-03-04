"use client";

import { Volume2, VolumeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useAudio } from "@/context/AudioContext";
import MobileMusicPopup from "./MobileMusicPopup";

export default function MobileFloatingSupport() {
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

  // ✅ memoized handlers (performance improvement)
  const openMusicPopup = useCallback(() => {
    setMusicPopupOpen(true);
  }, []);

  const closeMusicPopup = useCallback(() => {
    setMusicPopupOpen(false);
  }, []);

  const handleSelectTrack = useCallback(
    (id: number) => {
      const track = audios.find((a) => a.id === id);
      if (!track) return;

      setCurrentTrack(track);

      // only play if not already playing
      if (!isPlaying) {
        togglePlay();
      }
    },
    [audios, setCurrentTrack, isPlaying, togglePlay],
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, [setIsMuted]);

  return (
    <div className="fixed right-0 top-1/3 z-50 flex flex-col items-center">
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-orange-400/20 to-green-400/20 
                   backdrop-blur-md rounded-l-2xl px-1 py-2 
                   flex flex-col items-center gap-4 shadow-xl"
      >
        {/* 🎧 Open Music Popup */}
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

        {/* 🔇 Mute / Unmute */}
        <button
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
          className="p-1 rounded-full hover:scale-125 transition-all duration-200 hover:bg-orange-400/20"
        >
          {isMuted ? (
            <VolumeOff size={22} className="text-white" />
          ) : (
            <Volume2 size={22} className="text-white" />
          )}
        </button>
      </motion.div>

      <MobileMusicPopup
        open={musicPopupOpen}
        onClose={closeMusicPopup}
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
    </div>
  );
}
