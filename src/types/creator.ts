export interface Creator {
  id: string;
  name: string;
  channelId: string;
  thumbnailUrl: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId?: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoId: string;
  channelTitle: string;
  publishedAt: string;
  viewCount?: string;
  duration?: string;
  isShort: boolean;
}

export interface VideoStatistics {
  viewCount: string;
  likeCount: string;
  commentCount: string;
}