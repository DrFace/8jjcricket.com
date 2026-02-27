// Video section data structure for list items
export interface VideoSectionListItem {
  id: number;
  title: string;
  video_path: string;
  slug: string;
  category: string;
}

// Full video section data structure with timestamps
export interface VideoSection extends VideoSectionListItem {
  created_at: string;
  updated_at: string;
}

// Error response type
export interface VideoSectionError {
  message: string;
}

// API response types
export type VideoSectionsListResponse = VideoSectionListItem[];

// Video card props
export interface VideoCardProps {
  video: VideoSectionListItem;
  onClick?: () => void;
}

// Video player props
export interface VideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

export type VideoSectionRespond = {
  id: number;
  title: string;
  slug: string;
  video_path: string;
  category: string;
};
