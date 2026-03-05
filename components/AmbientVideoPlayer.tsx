"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  MouseEvent,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
} from "lucide-react";
import styles from "./VideoPlayer.module.css";

export interface AmbientVideoPlayerHandle {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  getVideoElement: () => HTMLVideoElement | null;
}

interface AmbientVideoPlayerProps {
  src: string;
  poster?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onPlayingChange?: (isPlaying: boolean) => void;
}

const formatTime = (time: number): string => {
  if (!time || isNaN(time)) return "00:00";

  let seconds: number | string = Math.floor(time % 60);
  let minutes: number | string = Math.floor(time / 60) % 60;
  let hours: number | string = Math.floor(time / 3600);

  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;

  if (hours === "00" || hours === 0) {
    return `${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};

const AmbientVideoPlayer = forwardRef<
  AmbientVideoPlayerHandle,
  AmbientVideoPlayerProps
>(function AmbientVideoPlayer(
  { src, poster, onPlay, onPause, onPlayingChange },
  ref,
) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const blurVideoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressTimeRef = useRef<HTMLSpanElement>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // State
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const speedOptions = [
    { value: 2, label: "2x" },
    { value: 1.5, label: "1.5x" },
    { value: 1, label: "Normal" },
    { value: 0.75, label: "0.75x" },
    { value: 0.5, label: "0.5x" },
  ];

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    play: () => {
      mainVideoRef.current?.play();
      blurVideoRef.current?.play();
    },
    pause: () => {
      mainVideoRef.current?.pause();
      blurVideoRef.current?.pause();
    },
    togglePlay: () => {
      if (mainVideoRef.current?.paused) {
        mainVideoRef.current?.play();
        blurVideoRef.current?.play();
      } else {
        mainVideoRef.current?.pause();
        blurVideoRef.current?.pause();
      }
    },
    getVideoElement: () => mainVideoRef.current,
  }));

  // Hide controls after inactivity
  const hideControls = useCallback(() => {
    if (mainVideoRef.current?.paused) return;

    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }

    hideControlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  // Show controls and reset timer
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    hideControls();
  }, [hideControls]);

  // Play/Pause toggle
  const togglePlay = useCallback(() => {
    const mainVideo = mainVideoRef.current;
    const blurVideo = blurVideoRef.current;

    if (!mainVideo) return;

    if (mainVideo.paused) {
      mainVideo.play();
      blurVideo?.play();
    } else {
      mainVideo.pause();
      blurVideo?.pause();
    }
  }, []);

  // Volume toggle (mute/unmute)
  const toggleMute = useCallback(() => {
    const mainVideo = mainVideoRef.current;
    if (!mainVideo) return;

    if (isMuted) {
      mainVideo.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      mainVideo.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // Volume change
  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      const mainVideo = mainVideoRef.current;

      if (mainVideo) {
        mainVideo.volume = newVolume;
      }

      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    },
    [],
  );

  // Skip backward
  const skipBackward = useCallback(() => {
    const mainVideo = mainVideoRef.current;
    const blurVideo = blurVideoRef.current;

    if (mainVideo) {
      mainVideo.currentTime -= 5;
    }
    if (blurVideo) {
      blurVideo.currentTime -= 5;
    }
  }, []);

  // Skip forward
  const skipForward = useCallback(() => {
    const mainVideo = mainVideoRef.current;
    const blurVideo = blurVideoRef.current;

    if (mainVideo) {
      mainVideo.currentTime += 5;
    }
    if (blurVideo) {
      blurVideo.currentTime += 5;
    }
  }, []);

  // Timeline hover - show time preview
  const handleTimelineMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const timeline = timelineRef.current;
      const progressTime = progressTimeRef.current;
      const mainVideo = mainVideoRef.current;

      if (!timeline || !progressTime || !mainVideo) return;

      const timelineWidth = timeline.clientWidth;
      let offsetX = e.nativeEvent.offsetX;
      const percent = Math.floor(
        (offsetX / timelineWidth) * mainVideo.duration,
      );

      // Clamp offsetX for display
      offsetX =
        offsetX < 20
          ? 20
          : offsetX > timelineWidth - 20
            ? timelineWidth - 20
            : offsetX;

      progressTime.style.left = `${offsetX}px`;
      progressTime.innerText = formatTime(percent);
    },
    [],
  );

  // Timeline click - seek
  const handleTimelineClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const timeline = timelineRef.current;
    const mainVideo = mainVideoRef.current;
    const blurVideo = blurVideoRef.current;

    if (!timeline || !mainVideo) return;

    const timelineWidth = timeline.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const newTime = (clickX / timelineWidth) * mainVideo.duration;

    mainVideo.currentTime = newTime;
    if (blurVideo) {
      blurVideo.currentTime = newTime;
    }
  }, []);

  // Draggable progress bar
  const handleTimelineDrag = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      const timeline = timelineRef.current;
      const mainVideo = mainVideoRef.current;
      const blurVideo = blurVideoRef.current;

      if (!timeline || !mainVideo) return;

      const timelineWidth = timeline.clientWidth;
      const rect = timeline.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const clampedX = Math.max(0, Math.min(offsetX, timelineWidth));
      const newTime = (clampedX / timelineWidth) * mainVideo.duration;

      setProgress((clampedX / timelineWidth) * 100);
      mainVideo.currentTime = newTime;
      if (blurVideo) {
        blurVideo.currentTime = newTime;
      }
      setCurrentTime(newTime);
    },
    [isDragging],
  );

  // Change playback speed
  const changeSpeed = useCallback((speed: number) => {
    const mainVideo = mainVideoRef.current;
    const blurVideo = blurVideoRef.current;

    if (mainVideo) {
      mainVideo.playbackRate = speed;
    }
    if (blurVideo) {
      blurVideo.playbackRate = speed;
    }

    setPlaybackSpeed(speed);
    setShowSpeedOptions(false);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      container.requestFullscreen();
      setIsFullscreen(true);
    }
  }, []);

  // Video event handlers
  useEffect(() => {
    const mainVideo = mainVideoRef.current;
    const blurVideo = blurVideoRef.current;

    if (!mainVideo) return;

    const handlePlayEvent = () => {
      setIsPlaying(true);
      onPlay?.();
      onPlayingChange?.(true);
    };
    const handlePauseEvent = () => {
      setIsPlaying(false);
      onPause?.();
      onPlayingChange?.(false);
    };
    const handleTimeUpdate = () => {
      const { currentTime, duration } = mainVideo;
      setCurrentTime(currentTime);
      setProgress((currentTime / duration) * 100);
    };
    const handleLoadedData = () => {
      setDuration(mainVideo.duration);
    };

    mainVideo.addEventListener("play", handlePlayEvent);
    mainVideo.addEventListener("pause", handlePauseEvent);
    mainVideo.addEventListener("timeupdate", handleTimeUpdate);
    mainVideo.addEventListener("loadeddata", handleLoadedData);

    // Mute blur video
    if (blurVideo) {
      blurVideo.volume = 0;
    }

    return () => {
      mainVideo.removeEventListener("play", handlePlayEvent);
      mainVideo.removeEventListener("pause", handlePauseEvent);
      mainVideo.removeEventListener("timeupdate", handleTimeUpdate);
      mainVideo.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [onPlay, onPause, onPlayingChange]);

  // Mouse up listener for drag end
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Close speed options on outside click
  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.playbackContent}`)) {
        setShowSpeedOptions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Initial hide controls
  useEffect(() => {
    hideControls();
    return () => {
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, [hideControls]);

  return (
    <div className={styles.playerWrapper}>
      {/* Blurred background video for ambient effect */}
      <video
        ref={blurVideoRef}
        src={src}
        poster={poster}
        className={styles.blurred}
        muted
        playsInline
      />

      {/* Main container */}
      <div
        ref={containerRef}
        className={`${styles.container} ${showControls ? styles.showControls : ""} ${isFullscreen ? styles.fullscreen : ""}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() =>
          !mainVideoRef.current?.paused && setShowControls(false)
        }
      >
        {/* Controls wrapper */}
        <div className={styles.wrapper}>
          {/* Video Timeline */}
          <div
            ref={timelineRef}
            className={styles.videoTimeline}
            onMouseMove={handleTimelineMouseMove}
            onClick={handleTimelineClick}
            onMouseDown={() => setIsDragging(true)}
          >
            <div className={styles.progressArea}>
              <span ref={progressTimeRef}>00:00</span>
              <div
                className={styles.progressBar}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Video Controls */}
          <ul className={styles.videoControls}>
            {/* Left options */}
            <li className={`${styles.options} ${styles.left}`}>
              <button className={styles.volume} onClick={toggleMute}>
                {isMuted || volume === 0 ? (
                  <VolumeX size={19} />
                ) : (
                  <Volume2 size={19} />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="any"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
              />
              <div className={styles.videoTimer}>
                <p className={styles.currentTime}>{formatTime(currentTime)}</p>
                <p className={styles.separator}> / </p>
                <p className={styles.videoDuration}>{formatTime(duration)}</p>
              </div>
            </li>

            {/* Center options */}
            <li className={`${styles.options} ${styles.center}`}>
              <button className={styles.skipBackward} onClick={skipBackward}>
                <SkipBack size={19} />
              </button>
              <button className={styles.playPause} onClick={togglePlay}>
                {isPlaying ? <Pause size={19} /> : <Play size={19} />}
              </button>
              <button className={styles.skipForward} onClick={skipForward}>
                <SkipForward size={19} />
              </button>
            </li>

            {/* Right options */}
            <li className={`${styles.options} ${styles.right}`}>
              <div className={styles.playbackContent}>
                <button
                  className={styles.playbackSpeed}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSpeedOptions(!showSpeedOptions);
                  }}
                >
                  <span className={styles.speedIcon}>⏱</span>
                </button>
                <ul
                  className={`${styles.speedOptions} ${showSpeedOptions ? styles.show : ""}`}
                >
                  {speedOptions.map((option) => (
                    <li
                      key={option.value}
                      data-speed={option.value}
                      className={
                        playbackSpeed === option.value ? styles.active : ""
                      }
                      onClick={() => changeSpeed(option.value)}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className={styles.fullscreenBtn}
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize size={19} /> : <Maximize size={19} />}
              </button>
            </li>
          </ul>
        </div>

        {/* Main Video */}
        <video
          ref={mainVideoRef}
          src={src}
          poster={poster}
          onClick={togglePlay}
          playsInline
        />
      </div>
    </div>
  );
});

export default AmbientVideoPlayer;
