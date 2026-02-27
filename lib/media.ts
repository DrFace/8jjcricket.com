import { BACKEND_URL_API } from "@/app/api/backendurl";

export function GetVideoUrl(videoPath: string): string {
  if (!videoPath) return "";

  if (videoPath.startsWith("http://") || videoPath.startsWith("https://")) {
    return videoPath;
  }

  const baseUrl = BACKEND_URL_API.replace(/\/api\/?$/, "");
  return `${baseUrl}/${videoPath}`;
}
