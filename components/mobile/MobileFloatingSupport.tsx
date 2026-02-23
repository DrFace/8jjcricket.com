"use client";

import { Headphones, Music2, TvMinimalPlay, VolumeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import MusicPopup from "@/components/MusicPopup";
import { useAudio } from "@/context/AudioContext";
import MobileMusicPopup from "./MobileMusicPopup";
import { PlayingAnimation } from "../ui/PlayingAnimation";

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
          className="p-1 rounded-full hover:scale-125 transition-all duration-200 hover:bg-orange-400/20"
          onClick={openMusicPopup}
          aria-label="Open Music Player"
        >
          {isPlaying ? (
            <PlayingAnimation />
          ) : (
            <TvMinimalPlay size={22} className="text-white" />
          )}
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
            <Music2 size={22} className="text-white" />
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
