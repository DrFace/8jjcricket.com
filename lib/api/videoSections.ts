import {
  VideoSection,
  VideoSectionListItem,
  VideoSectionError,
} from "@/types/videoSection";

// Get API base URL from environment variable
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

/**
 * Fetch all video sections
 * @returns Promise<VideoSectionListItem[]>
 * @throws Error if the request fails
 */
export async function getVideoSections(): Promise<VideoSectionListItem[]> {
  try {
    const url = `${API_BASE_URL}/video-sections`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store", // Disable caching for dynamic data
    });

    if (!response.ok) {
      const errorData: VideoSectionError = await response.json().catch(() => ({
        message: `Failed to fetch video sections: ${response.status} ${response.statusText}`,
      }));
      throw new Error(errorData.message);
    }

    const data: VideoSectionListItem[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching video sections:", error);
    throw error;
  }
}

/**
 * Fetch a single video section by slug
 * @param slug - The video section slug
 * @returns Promise<VideoSection>
 * @throws Error if the request fails or video not found
 */
export async function getVideoSectionBySlug(
  slug: string,
): Promise<VideoSection> {
  try {
    const url = `${API_BASE_URL}/video-sections/${encodeURIComponent(slug)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Video Section not found");
      }

      const errorData: VideoSectionError = await response.json().catch(() => ({
        message: `Failed to fetch video section: ${response.status} ${response.statusText}`,
      }));
      throw new Error(errorData.message);
    }

    const data: VideoSection = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching video section:", error);
    throw error;
  }
}

/**
 * Get full video URL from video path
 * Handles both absolute URLs and relative paths
 * @param videoPath - The video path from API
 * @returns Full video URL
 */
export function getVideoUrl(videoPath: string): string {
  // If it's already an absolute URL, return as-is
  if (videoPath.startsWith("http://") || videoPath.startsWith("https://")) {
    return videoPath;
  }

  // Otherwise, prepend the API base URL (without /api suffix for media files)
  const baseUrl = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${baseUrl}/${videoPath}`;
}
