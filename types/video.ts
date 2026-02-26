export interface VideoSectionItem {
  id: number;
  title: string;
  video_path: string;
  slug: string;
  category: string;
  thumbnail_url?: string;
  description?: string;
  published_at?: string;
}

export interface VideoApiResponse {
  data: VideoSectionItem[];
}
