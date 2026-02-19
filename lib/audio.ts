// lib/audio.ts
import { URLNormalize } from "./utils";

let globalAudio: HTMLAudioElement | null = null;

export type AudioItem = {
  id: number;
  title: string;
  file_path: string;
};

export function GetGlobalAudio(audioDataParam?: Partial<AudioItem> | null) {
  if (typeof window === "undefined") return null;

  const audioUrl = audioDataParam?.file_path
    ? URLNormalize(audioDataParam.file_path, "audios")
    : "";

  if (!globalAudio) {
    globalAudio = new Audio();
    globalAudio.loop = true;
    globalAudio.preload = "auto";
    globalAudio.volume = 0.7;
    globalAudio.muted = true;
  }

  if (audioUrl && globalAudio.src !== audioUrl) {
    globalAudio.src = audioUrl;
    globalAudio.load();
  }

  return globalAudio;
}

export function SetGlobalAudioVolume(v: number) {
  if (!globalAudio) return;
  const clamped = Math.max(0, Math.min(1, v));
  globalAudio.volume = clamped;
}
