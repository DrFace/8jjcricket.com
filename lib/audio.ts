import { URLNormalize } from "./utils";

let globalAudio: HTMLAudioElement | null = null;

export function GetGlobalAudio(audioDataParam?: any) {
  if (typeof window === "undefined") return null;

  // 1. Get the URL (it might be empty string if data isn't ready)
  const audioUrl = audioDataParam?.file_path
    ? URLNormalize(audioDataParam.file_path, "audios")
    : "";

  // 2. Create the object if it doesn't exist
  if (!globalAudio) {
    globalAudio = new Audio(); // Create empty first
    globalAudio.loop = true;
    globalAudio.preload = "auto";
    globalAudio.muted = true;
  }

  // 3. CRITICAL: Update the source only if we have a valid URL
  if (audioUrl && globalAudio.src !== audioUrl) {
    globalAudio.src = audioUrl;
    globalAudio.load(); // Tell the browser to load the new file
  }

  return globalAudio;
}
