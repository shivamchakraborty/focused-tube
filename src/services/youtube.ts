import { getYouTubeApiKey, YOUTUBE_API_BASE_URL } from '../config/constants';
import { Creator, Video } from '../types/creator';
import { generateUniqueId } from '../utils/idGenerator';
import { parseDuration } from '../utils/formatters';

export async function searchChannel(query: string): Promise<Creator | null> {
  const response = await fetch(
    `${YOUTUBE_API_BASE_URL}/search?part=snippet&type=channel&q=${encodeURIComponent(
      query
    )}&key=${getYouTubeApiKey()}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to search channel');
  }
  
  const data = await response.json();
  if (!data.items?.length) return null;

  const channel = data.items[0];
  return {
    id: generateUniqueId(),
    name: channel.snippet.title,
    channelId: channel.id.channelId,
    thumbnailUrl: channel.snippet.thumbnails.high.url,
    categoryId: 'default',
  };
}

export async function getLatestVideos(channelId: string, pageToken?: string): Promise<{
  videos: Video[];
  shorts: Video[];
  nextPageToken?: string;
}> {
  const channelResponse = await fetch(
    `${YOUTUBE_API_BASE_URL}/channels?part=contentDetails&id=${channelId}&key=${getYouTubeApiKey()}`
  );
  
  if (!channelResponse.ok) {
    throw new Error('Failed to fetch channel details');
  }
  
  const channelData = await channelResponse.json();
  const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;
  
  if (!uploadsPlaylistId) {
    throw new Error('Could not find uploads playlist');
  }

  const playlistResponse = await fetch(
    `${YOUTUBE_API_BASE_URL}/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylistId}${
      pageToken ? `&pageToken=${pageToken}` : ''
    }&key=${getYouTubeApiKey()}`
  );
  
  if (!playlistResponse.ok) {
    throw new Error('Failed to fetch playlist items');
  }
  
  const playlistData = await playlistResponse.json();
  const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
  
  const videoResponse = await fetch(
    `${YOUTUBE_API_BASE_URL}/videos?part=statistics,contentDetails&id=${videoIds}&key=${getYouTubeApiKey()}`
  );
  
  if (!videoResponse.ok) {
    throw new Error('Failed to fetch video details');
  }
  
  const videoData = await videoResponse.json();
  const videoDetailsMap = new Map(
    videoData.items.map((item: any) => [
      item.id,
      {
        statistics: item.statistics,
        duration: item.contentDetails.duration,
      },
    ])
  );
  
  const videos: Video[] = [];
  const shorts: Video[] = [];

  playlistData.items.forEach((item: any) => {
    const videoDetails = videoDetailsMap.get(item.snippet.resourceId.videoId);
    const duration = videoDetails?.duration || 'PT0S';
    const totalSeconds = parseDuration(duration);
    
    const video = {
      id: generateUniqueId(),
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      videoId: item.snippet.resourceId.videoId,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: videoDetails?.statistics.viewCount || '0',
      duration: videoDetails?.duration || '',
      isShort: totalSeconds <= 108, // 1.8 minutes in seconds
    };

    if (video.isShort) {
      shorts.push(video);
    } else {
      videos.push(video);
    }
  });

  return {
    videos,
    shorts,
    nextPageToken: playlistData.nextPageToken,
  };
}