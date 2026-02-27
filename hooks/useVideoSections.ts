"use client";

import { useState, useEffect, useCallback } from "react";
import { VideoSection, VideoSectionListItem } from "@/types/videoSection";
import {
  getVideoSections,
  getVideoSectionBySlug,
} from "@/lib/api/videoSections";

interface UseVideoSectionsResult {
  videos: VideoSectionListItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch all video sections
 * @returns { videos, loading, error, refetch }
 */
export function useVideoSections(): UseVideoSectionsResult {
  const [videos, setVideos] = useState<VideoSectionListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVideoSections();
      setVideos(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch video sections";
      setError(errorMessage);
      console.error("Error in useVideoSections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return {
    videos,
    loading,
    error,
    refetch: fetchVideos,
  };
}

interface UseVideoSectionResult {
  video: VideoSection | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch a single video section by slug
 * @param slug - The video section slug
 * @returns { video, loading, error }
 */
export function useVideoSection(slug: string): UseVideoSectionResult {
  const [video, setVideo] = useState<VideoSection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("No slug provided");
      return;
    }

    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVideoSectionBySlug(slug);
        setVideo(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch video section";
        setError(errorMessage);
        console.error("Error in useVideoSection:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [slug]);

  return {
    video,
    loading,
    error,
  };
}
